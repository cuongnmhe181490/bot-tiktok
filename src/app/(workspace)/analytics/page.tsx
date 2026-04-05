import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAnalyticsOverview } from "@/features/analytics/service";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";
import { ChartCard } from "@/components/chart-card";
import { LinePerformanceChart } from "@/components/charts/line-performance-chart";
import { BarRankingChart } from "@/components/charts/bar-ranking-chart";

export const metadata: Metadata = buildMetadata(
  "Hiệu suất nội dung | Kính Affiliate Studio",
  "Theo dõi top hook, angle, recent winners, recent losers và commission content affiliate.",
  "/analytics",
);

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsOverview();

  const lineData = analytics.videos.slice(0, 10).map((item) => ({
    label: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
      item.publishedAt,
    ),
    value: item.commission,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 4"
        title="Hiệu suất nội dung"
        description="Nhìn ra hook, angle và format đang kiếm tiền để ra quyết định re-test nhanh hơn."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock label="Video thắng" value={String(analytics.winners.length)} tone="positive" />
        <KPIBlock label="Video cần xem lại" value={String(analytics.losers.length)} tone="danger" />
        <KPIBlock label="Tổng commission" value={`${Math.round(analytics.totalCommission).toLocaleString("vi-VN")}đ`} />
        <KPIBlock label="Tổng views" value={analytics.totalViews.toLocaleString("vi-VN")} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <ChartCard title="Commission theo các video gần nhất" description="Đủ để nhìn nhịp lên xuống mà không bị nhiễu.">
          <LinePerformanceChart data={lineData} />
        </ChartCard>
        <ChartCard title="Top hook theo views" description="Hook nào đang kéo mắt người xem tốt hơn.">
          <BarRankingChart data={analytics.topHooks.slice(0, 5)} />
        </ChartCard>
      </div>
    </div>
  );
}
