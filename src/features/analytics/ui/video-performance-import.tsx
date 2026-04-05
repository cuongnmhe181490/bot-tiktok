"use client";

import { ConfidenceLevel, SourceType, VerificationStatus, type Product } from "@prisma/client";
import Papa from "papaparse";
import * as React from "react";
import { toast } from "sonner";
import { postJson } from "@/lib/http";
import { videoPerformanceSchema, type VideoPerformanceInput } from "@/features/analytics/schema";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/tag-chip";

type VideoPerformanceImportProps = {
  products: Product[];
};

type PreviewState = {
  rows: VideoPerformanceInput[];
  invalid: { row: number; reason: string }[];
};

export function VideoPerformanceImport({ products }: VideoPerformanceImportProps) {
  const [preview, setPreview] = React.useState<PreviewState>({ rows: [], invalid: [] });
  const [pending, setPending] = React.useState(false);
  const productLookup = React.useMemo(
    () => new Map(products.map((product) => [product.name.toLowerCase(), product])),
    [products],
  );

  const parseRow = React.useCallback(
    (row: Record<string, string>) => {
      const product = productLookup.get((row.product_name || "").toLowerCase());
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm khớp với product_name.");
      }

      return videoPerformanceSchema.parse({
        title: row.title,
        productId: product.id,
        productGroup: row.product_group || product.category,
        source: row.source || "CSV Upload",
        sourceType: (row.source_type as SourceType) || SourceType.CSV_IMPORT,
        publishedAt: row.published_at || new Date(),
        videoUrl: row.video_url,
        collectedAt: row.published_at || new Date(),
        importedAt: new Date(),
        lastVerifiedAt: undefined,
        confidenceLevel: (row.confidence_level as ConfidenceLevel) || ConfidenceLevel.MEDIUM,
        verificationStatus:
          (row.verification_status as VerificationStatus) || VerificationStatus.CHUA_XAC_MINH,
        externalReferenceUrl: row.video_url,
        notes: row.notes || "Import từ CSV analytics.",
        hook: row.hook,
        angle: row.angle,
        format: row.format,
        durationSeconds: Number(row.duration_seconds || 30),
        captionType: row.caption_type,
        ctaType: row.cta_type,
        note: row.notes || "",
        views: Number(row.views || 0),
        avgWatchTime: Number(row.avg_watch_time || 0),
        completionRate: Number(row.completion_rate || 0),
        clicks: Number(row.clicks || 0),
        ctr: Number(row.ctr || 0),
        orders: Number(row.orders || 0),
        revenue: Number(row.revenue || 0),
        commission: Number(row.commission || 0),
        status: (row.status as VideoPerformanceInput["status"]) || "DA_DANG",
      });
    },
    [productLookup],
  );

  const onFileChange = async (file: File | null) => {
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: VideoPerformanceInput[] = [];
        const invalid: { row: number; reason: string }[] = [];

        results.data.forEach((row, index) => {
          try {
            rows.push(parseRow(row));
          } catch (error) {
            invalid.push({
              row: index + 2,
              reason: error instanceof Error ? error.message : "Dòng dữ liệu không hợp lệ.",
            });
          }
        });

        setPreview({ rows, invalid });
      },
      error: () => toast.error("Không đọc được file CSV analytics."),
    });
  };

  const onImport = async () => {
    if (preview.rows.length === 0) {
      toast.error("Chưa có dòng hợp lệ để import.");
      return;
    }

    setPending(true);
    const result = await postJson("/api/analytics/videos/import", { rows: preview.rows });
    setPending(false);

    if (!result.ok) {
      toast.error(result.message ?? "Không thể import analytics.");
      return;
    }

    toast.success(result.message ?? "Đã import analytics.");
    setPreview({ rows: [], invalid: [] });
  };

  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/40 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Import CSV nội bộ</p>
          <p className="text-sm text-muted-foreground">
            Dùng cho dữ liệu analytics tự tổng hợp, không phụ thuộc API bên ngoài.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/api/analytics/videos/template">Tải mẫu CSV</a>
          </Button>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Chọn CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <TagChip tone="success">{preview.rows.length} dòng hợp lệ</TagChip>
        <TagChip tone={preview.invalid.length > 0 ? "danger" : "default"}>
          {preview.invalid.length} dòng lỗi
        </TagChip>
        <TagChip tone="info">Nguồn: CSV nội bộ</TagChip>
      </div>

      {preview.rows.length > 0 ? (
        <div className="space-y-3">
          {preview.rows.slice(0, 4).map((row, index) => (
            <div key={`${row.title}-${index}`} className="rounded-2xl bg-white/55 px-4 py-3 text-sm dark:bg-white/7">
              <p className="font-medium text-foreground">{row.title}</p>
              <p className="text-muted-foreground">
                {row.productGroup} · {row.views.toLocaleString("vi-VN")} views · {row.orders} đơn
              </p>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={onImport} disabled={pending}>
              {pending ? "Đang import..." : "Xác nhận import"}
            </Button>
          </div>
        </div>
      ) : null}

      {preview.invalid.length > 0 ? (
        <div className="space-y-1 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          {preview.invalid.slice(0, 5).map((item) => (
            <p key={`${item.row}-${item.reason}`}>Dòng {item.row}: {item.reason}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
