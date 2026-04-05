import type { Metadata } from "next";
import { listProducts } from "@/features/research/products/service";
import { listTrends } from "@/features/research/trends/service";
import { getAnalyticsOverview } from "@/features/analytics/service";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/section-header";
import { KPIBlock } from "@/components/kpi-block";
import { ChartCard } from "@/components/chart-card";
import { BarRankingChart } from "@/components/charts/bar-ranking-chart";
import { LinePerformanceChart } from "@/components/charts/line-performance-chart";

export const metadata: Metadata = buildMetadata(
  "Dashboard | Kính Affiliate Studio",
  "Tổng quan sản phẩm, trend, script và hiệu suất content affiliate.",
  "/dashboard",
);

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, trends, analytics] = await Promise.all([
    listProducts(),
    listTrends(),
    getAnalyticsOverview(),
  ]);

  const trendChart = trends.slice(0, 7).map((item) => ({
    label: item.name.slice(0, 18),
    value: item.heatLevel,
  }));

  const viewsChart = analytics.videos.slice(0, 12).map((item) => ({
    label: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
      item.publishedAt,
    ),
    value: item.views,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Tổng quan"
        title="Một nhịp nhìn đủ để biết hôm nay nên test gì."
        description="Bảng điều phối gọn cho nghiên cứu sản phẩm, xu hướng mới và hiệu suất nội dung đang chạy."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock label="Sản phẩm đang theo dõi" value={String(products.length)} delta="+4 tuần này" tone="positive" />
        <KPIBlock label="Trend mới 14 ngày" value={String(trends.filter((item) => item.heatLevel >= 7).length)} delta="ưu tiên test" tone="warning" />
        <KPIBlock label="Tổng lượt xem" value={new Intl.NumberFormat("vi-VN").format(analytics.totalViews)} delta="toàn bộ video" />
        <KPIBlock label="Tổng commission" value={`${Math.round(analytics.totalCommission).toLocaleString("vi-VN")}đ`} delta={`${analytics.winners.length} video thắng`} tone="positive" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <ChartCard
          title="Nhịp xem gần nhất"
          description="Theo dõi nhanh xu hướng view trên các video mới nhất."
        >
          <LinePerformanceChart data={viewsChart} />
        </ChartCard>
        <ChartCard
          title="Trend nên nhìn trước"
          description="Xếp theo độ nóng trong các trend mới nhập."
        >
          <BarRankingChart data={trendChart} />
        </ChartCard>
      </div>
    </div>
  );
}
