import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { listVideoPerformance } from "@/features/analytics/service";
import { VideoPerformanceForm } from "@/features/analytics/ui/video-performance-form";
import { VideoPerformanceImport } from "@/features/analytics/ui/video-performance-import";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getVideoStatusLabel } from "@/lib/labels";

export const metadata: Metadata = buildMetadata(
  "Bản ghi video | Kính Affiliate Studio",
  "Nhật ký hiệu suất từng video affiliate với hook, angle, format, CTR, orders và commission.",
  "/analytics/videos",
);

type AnalyticsVideosPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

export const dynamic = "force-dynamic";

function getStatusTone(status: string) {
  if (status === "THANG") return "success" as const;
  if (status === "KHONG_HIEU_QUA") return "danger" as const;
  if (status === "TAM_DUNG") return "warning" as const;
  return "info" as const;
}

export default async function AnalyticsVideosPage({
  searchParams,
}: AnalyticsVideosPageProps) {
  const params = (await searchParams) ?? {};
  const [videos, products] = await Promise.all([listVideoPerformance(), listProducts()]);
  const query = (params.q ?? "").trim().toLowerCase();

  const filteredVideos = videos.filter((item) => {
    if (params.status && item.status !== params.status) return false;
    if (query) {
      const haystack = [item.title, item.product.name, item.hook, item.angle].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Nhật ký video"
        title="Bản ghi performance theo từng video"
        description="Analytics ở đây chỉ dùng dữ liệu bạn tự nhập, CSV import hoặc dữ liệu demo. Trust badge giúp phân biệt bản ghi đã đối chiếu, chưa xác minh hay chỉ là dữ liệu mẫu."
      />

      <FilterBar
        summary="Giữ bộ lọc thật gọn để xem nhanh video nào đang thắng, video nào cần xem lại."
        activeCount={(params.q ? 1 : 0) + (params.status ? 1 : 0)}
      >
        <form className="contents" action="/analytics/videos">
          <Input name="q" defaultValue={params.q} placeholder="Tìm tiêu đề, hook, sản phẩm..." />
          <Input name="status" defaultValue={params.status} placeholder="Trạng thái" />
          <div className="md:col-span-2 flex items-center gap-2">
            <Button type="submit" variant="outline" size="sm">
              Áp dụng
            </Button>
            <span className="text-xs text-muted-foreground">
              {filteredVideos.length} bản ghi
            </span>
          </div>
        </form>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <DataTable
            data={filteredVideos}
            getKey={(item) => item.id}
            rowHref={(item) => `/analytics/videos/${item.id}`}
            mobileTitle={(item) => (
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.product.name}</p>
              </div>
            )}
            columns={[
              {
                key: "title",
                header: "Video",
                render: (item) => (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs">{item.product.name}</p>
                    <DataTrustBadges
                      source={item.source}
                      sourceType={item.sourceType}
                      confidenceLevel={item.confidenceLevel}
                      verificationStatus={item.verificationStatus}
                      isDemo={item.isDemo}
                    />
                  </div>
                ),
              },
              {
                key: "hook",
                header: "Hook",
                render: (item) => <span className="line-clamp-2 text-sm">{item.hook}</span>,
              },
              {
                key: "metrics",
                header: "Hiệu suất",
                render: (item) => (
                  <div className="text-sm">
                    <p>{item.views.toLocaleString("vi-VN")} views</p>
                    <p className="text-xs text-muted-foreground">
                      CTR {item.ctr}% · {item.orders} đơn
                    </p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Trạng thái",
                render: (item) => (
                  <TagChip tone={getStatusTone(item.status)}>{getVideoStatusLabel(item.status)}</TagChip>
                ),
              },
            ]}
          />

          {filteredVideos.length === 0 ? (
            <GlassPanel className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-foreground">Chưa có bản ghi khớp bộ lọc</h2>
              <p className="text-sm text-muted-foreground">
                Thử bỏ bớt trạng thái hoặc từ khóa để quay lại tập dữ liệu gốc.
              </p>
            </GlassPanel>
          ) : null}
        </div>

        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Thêm bản ghi mới</h2>
            <p className="text-sm text-muted-foreground">
              Ghi lại dữ liệu thật theo hướng free-only: nhập tay hoặc import CSV nội bộ. Mọi bản ghi đều có nguồn, lần nhập và trạng thái xác minh.
            </p>
          </div>
          <VideoPerformanceImport products={products} />
          <VideoPerformanceForm products={products} />
        </GlassPanel>
      </div>
    </div>
  );
}
