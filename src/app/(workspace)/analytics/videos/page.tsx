import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { listVideoPerformance } from "@/features/analytics/service";
import { VideoPerformanceForm } from "@/features/analytics/ui/video-performance-form";
import { DataTable } from "@/components/data-table";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Bản ghi video | Kính Affiliate Studio",
  "Theo dõi từng video affiliate với các chỉ số views, CTR, orders, revenue và commission.",
  "/analytics/videos",
);

export const dynamic = "force-dynamic";

export default async function AnalyticsVideosPage() {
  const [videos, products] = await Promise.all([listVideoPerformance(), listProducts()]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Bản ghi chi tiết"
        title="Video performance log"
        description="Giữ log sạch để top hook, top angle và báo cáo ngày/tuần/tháng có dữ liệu đáng tin."
      />
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <DataTable
          data={videos}
          getKey={(item) => item.id}
          rowHref={(item) => `/analytics/videos/${item.id}`}
          columns={[
            {
              key: "title",
              header: "Video",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs">{item.product.name}</p>
                </div>
              ),
            },
            {
              key: "views",
              header: "Views",
              render: (item) => <span className="font-mono">{item.views.toLocaleString("vi-VN")}</span>,
            },
            {
              key: "ctr",
              header: "CTR",
              render: (item) => <span className="font-mono">{item.ctr}%</span>,
            },
            {
              key: "status",
              header: "Trạng thái",
              render: (item) => <TagChip>{item.status.replaceAll("_", " ")}</TagChip>,
            },
          ]}
        />
        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Thêm bản ghi mới</h2>
            <p>Lưu đầy đủ hook, angle, format và các chỉ số sau đăng để báo cáo đáng tin hơn.</p>
          </div>
          <VideoPerformanceForm products={products} />
        </GlassPanel>
      </div>
    </div>
  );
}
