import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listVideoPerformance } from "@/features/analytics/service";
import { listProducts } from "@/features/research/products/service";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Báo cáo | Kính Affiliate Studio",
  "Báo cáo ngày, tuần, tháng cho content affiliate với top video, top sản phẩm, top hook và recommendation summary.",
  "/reports",
);

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [videos, products] = await Promise.all([listVideoPerformance(), listProducts()]);
  const daily = videos.slice(0, 10);
  const weekly = videos.slice(0, 25);
  const monthly = videos.slice(0, 60);
  const weeklyCommission = weekly.reduce((sum, item) => sum + item.commission, 0);
  const monthlyViews = monthly.reduce((sum, item) => sum + item.views, 0);
  const topProducts = products.slice(0, 5);
  const topWinners = [...videos]
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 10);
  const weakVideos = [...videos]
    .sort((a, b) => a.commission - b.commission)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Báo cáo"
        title="Báo cáo quyết định"
        description="Giữ báo cáo ngắn, đọc nhanh và đủ sức dẫn tới hành động. Mỗi khối bên dưới đều phục vụ quyết định giữ, scale, dừng hoặc re-test."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <KPIBlock label="Báo cáo ngày" value={`${daily.length} video`} />
        <KPIBlock
          label="Báo cáo tuần"
          value={`${Math.round(weeklyCommission).toLocaleString("vi-VN")}đ`}
          tone="positive"
        />
        <KPIBlock label="Báo cáo tháng" value={monthlyViews.toLocaleString("vi-VN")} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassPanel id="daily-report" className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Báo cáo ngày</h2>
          <div className="space-y-3">
            {daily.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.views.toLocaleString("vi-VN")} views · CTR {item.ctr}%
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel id="weekly-report" className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Báo cáo tuần</h2>
          <div className="space-y-3">
            {weekly.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(item.commission).toLocaleString("vi-VN")}đ commission
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel id="monthly-report" className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Báo cáo tháng</h2>
          <div className="space-y-3">
            {monthly.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.orders} đơn · {item.format}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Top 10 video tốt nhất</h2>
          <div className="space-y-3">
            {topWinners.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div>
                  <p className="font-medium text-foreground">
                    {index + 1}. {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.product.name}</p>
                </div>
                <TagChip tone="success">
                  {Math.round(item.commission).toLocaleString("vi-VN")}đ
                </TagChip>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Top 10 video kém nhất</h2>
          <div className="space-y-3">
            {weakVideos.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div>
                  <p className="font-medium text-foreground">
                    {index + 1}. {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.product.name}</p>
                </div>
                <TagChip tone="danger">
                  {Math.round(item.commission).toLocaleString("vi-VN")}đ
                </TagChip>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Top sản phẩm và top hook</h2>
          <div className="space-y-3">
            {topProducts.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <TagChip tone="info">{item.totalScore}/100</TagChip>
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recommendation summary</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              Giữ lại các hook đang kéo CTR tốt và đưa sang thêm ít nhất 2 format khác để kiểm tra độ bền.
            </p>
            <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              Với video commission thấp nhưng completion còn ổn, ưu tiên re-test phần mở đầu thay vì bỏ toàn bộ script.
            </p>
            <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              Các sản phẩm score cao nhưng chưa có nhiều video nên được đẩy sang module script trong batch tiếp theo.
            </p>
            <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              Có thể export tiếp dữ liệu sang CSV hoặc markdown ở bước sau nếu cần gửi nội bộ.
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
