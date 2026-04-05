import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listTrends } from "@/features/research/trends/service";
import { TrendForm } from "@/features/research/trends/ui/trend-form";
import { DataTable } from "@/components/data-table";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Xu hướng | Kính Affiliate Studio",
  "Theo dõi trend mới, mức độ nóng và độ dễ áp dụng cho từng niche affiliate.",
  "/research/trends",
);

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const trends = await listTrends();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 1"
        title="Xu hướng"
        description="Giữ lại các format, hook và góc nhìn đáng thử để đội content không bị mất nhịp tìm ý tưởng."
      />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          data={trends}
          getKey={(item) => item.id}
          columns={[
            {
              key: "name",
              header: "Trend",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs">{item.suitableNiche}</p>
                </div>
              ),
            },
            {
              key: "type",
              header: "Loại",
              render: (item) => <TagChip tone="info">{item.trendType.replaceAll("_", " ")}</TagChip>,
            },
            {
              key: "heat",
              header: "Độ nóng",
              render: (item) => <span className="font-mono">{item.heatLevel}/10</span>,
            },
            {
              key: "apply",
              header: "Dễ áp dụng",
              render: (item) => <span className="font-mono">{item.applicability}/10</span>,
            },
          ]}
        />
        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Thêm trend mới</h2>
            <p>Giữ trend dưới dạng dữ liệu có cấu trúc để sau này gắn được với generator hoặc connector.</p>
          </div>
          <TrendForm />
        </GlassPanel>
      </div>
    </div>
  );
}
