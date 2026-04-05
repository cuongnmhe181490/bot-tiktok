import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listVideoPerformance } from "@/features/analytics/service";
import { listProducts } from "@/features/research/products/service";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = buildMetadata(
  "Báo cáo | Kính Affiliate Studio",
  "Tổng hợp báo cáo ngày, tuần, tháng và gợi ý re-test cho content affiliate.",
  "/reports",
);

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [videos, products] = await Promise.all([listVideoPerformance(), listProducts()]);
  const daily = videos.slice(0, 7);
  const weeklyCommission = daily.reduce((sum, item) => sum + item.commission, 0);
  const monthlyViews = videos.reduce((sum, item) => sum + item.views, 0);
  const retestCandidates = products.filter((item) => item.status === "DANG_TEST").slice(0, 5);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Báo cáo"
        title="Tóm tắt ngày, tuần và tháng"
        description="Giữ báo cáo ngắn, đọc nhanh và đủ dữ kiện để ra quyết định re-test hoặc scale."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <KPIBlock label="Commission 7 ngày" value={`${Math.round(weeklyCommission).toLocaleString("vi-VN")}đ`} tone="positive" />
        <KPIBlock label="Views tháng" value={monthlyViews.toLocaleString("vi-VN")} />
        <KPIBlock label="Ứng viên re-test" value={String(retestCandidates.length)} tone="warning" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold">Gợi ý re-test</h2>
          <div className="space-y-3">
            {retestCandidates.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm">Score {item.totalScore} · {item.category}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold">Nhịp tuần này</h2>
          <div className="space-y-3">
            {daily.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm">
                  {item.views.toLocaleString("vi-VN")} views · {Math.round(item.commission).toLocaleString("vi-VN")}đ
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
