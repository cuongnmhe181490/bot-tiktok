"use client";

import { TrendType, SourceType, ConfidenceLevel, VerificationStatus } from "@prisma/client";
import Papa from "papaparse";
import * as React from "react";
import { toast } from "sonner";
import { postJson } from "@/lib/http";
import { trendSchema, type TrendInput } from "@/features/research/trends/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagChip } from "@/components/tag-chip";

type PreviewState = {
  rows: TrendInput[];
  invalid: { row: number; reason: string }[];
};

function mapRowToTrend(row: Record<string, string>, niche: string): TrendInput {
  const keyword = row.keyword || row.query || row.topic || row.Topic || row.Keyword;
  const score = Number(row.trend_score || row.value || row.score || row["Interest"]);

  return {
    name: keyword || "",
    trendType: TrendType.GOC_NHIN,
    source: "Google Trends",
    sourceType: SourceType.GOOGLE_TRENDS,
    description: `Trend được nhập từ Google Trends cho keyword: ${keyword}.`,
    suitableNiche: niche || row.niche || "Chưa gắn niche",
    externalReferenceUrl: "",
    region: row.region || row.geo || "VN",
    timeWindow: row.time_window || row.period || row.window || "",
    trendScore: Number.isFinite(score) ? score : 0,
    heatLevel: Number.isFinite(score) ? Math.min(10, Math.max(1, Math.round(score / 10))) : 6,
    applicability: 6,
    saturationLevel: 4,
    discoveredAt: new Date(),
    collectedAt: new Date(),
    importedAt: new Date(),
    lastVerifiedAt: undefined,
    confidenceLevel: ConfidenceLevel.HIGH,
    verificationStatus: VerificationStatus.CHUA_XAC_MINH,
    notes: "Import từ Google Trends CSV.",
    note: row.notes || "",
  };
}

export function GoogleTrendsImport() {
  const [niche, setNiche] = React.useState("");
  const [preview, setPreview] = React.useState<PreviewState>({ rows: [], invalid: [] });
  const [pending, setPending] = React.useState(false);

  const onFileChange = async (file: File | null) => {
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: TrendInput[] = [];
        const invalid: { row: number; reason: string }[] = [];

        results.data.forEach((row, index) => {
          try {
            rows.push(trendSchema.parse(mapRowToTrend(row, niche)));
          } catch {
            invalid.push({
              row: index + 2,
              reason: "Thiếu cột keyword/topic hoặc dữ liệu score không hợp lệ.",
            });
          }
        });

        setPreview({ rows, invalid });
      },
      error: () => {
        toast.error("Không đọc được file CSV.");
      },
    });
  };

  const onImport = async () => {
    if (preview.rows.length === 0) {
      toast.error("Chưa có dòng hợp lệ để import.");
      return;
    }

    setPending(true);
    const result = await postJson("/api/trends/import", { rows: preview.rows });
    setPending(false);

    if (!result.ok) {
      toast.error(result.message ?? "Không thể import Google Trends.");
      return;
    }

    toast.success(result.message ?? "Đã import dữ liệu Google Trends.");
    setPreview({ rows: [], invalid: [] });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Input value={niche} onChange={(event) => setNiche(event.target.value)} placeholder="Gắn nhanh vào niche hoặc nhóm sản phẩm" />
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/api/trends/template?kind=google">Tải mẫu CSV</a>
          </Button>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Chọn file CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <TagChip tone="success">{preview.rows.length} dòng hợp lệ</TagChip>
        <TagChip tone={preview.invalid.length > 0 ? "danger" : "default"}>
          {preview.invalid.length} dòng lỗi
        </TagChip>
        <TagChip tone="info">Nguồn: Google Trends</TagChip>
      </div>

      {preview.rows.length > 0 ? (
        <div className="space-y-3 rounded-[1.6rem] border border-white/40 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Xem trước import</p>
            <p className="text-sm text-muted-foreground">
              Hệ thống sẽ map keyword/topic sang tên trend, score sang trend score và tự gắn nguồn Google Trends.
            </p>
          </div>
          <div className="space-y-2">
            {preview.rows.slice(0, 5).map((row, index) => (
              <div key={`${row.name}-${index}`} className="rounded-2xl bg-white/55 px-4 py-3 text-sm dark:bg-white/7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <TagChip tone="info">{row.region || "Không rõ vùng"}</TagChip>
                  <TagChip tone="success">Score {row.trendScore ?? 0}</TagChip>
                </div>
                <p className="mt-1 text-muted-foreground">{row.timeWindow || "Không có khung thời gian"} · {row.suitableNiche}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={onImport} disabled={pending}>
              {pending ? "Đang import..." : "Xác nhận import"}
            </Button>
          </div>
        </div>
      ) : null}

      {preview.invalid.length > 0 ? (
        <div className="rounded-[1.4rem] border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          {preview.invalid.slice(0, 5).map((item) => (
            <p key={`${item.row}-${item.reason}`}>Dòng {item.row}: {item.reason}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
