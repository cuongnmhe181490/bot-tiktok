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
  "Báo cáo ngày, tuần, tháng cho content affiliate với top video, top sản phẩm và khuyến nghị ra quyết định ngắn gọn.",
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
  const topWinners = [...videos].sort((a, b) => b.commission - a.commission).slice(0, 10);
  const weakVideos = [...videos].sort((a, b) => a.commission - b.commission).slice(0, 10);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Báo cáo"
        title="Tóm tắt để ra quyết định nhanh"
        description="Trang này không chỉ liệt kê số. Nó gom những tín hiệu đủ ngắn để bạn biết nên giữ, scale, dừng hay re-test trong batch kế tiếp."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <KPIBlock label="Nhịp ngày" value={`${daily.length} video`} delta="đủ dữ liệu để đọc nhanh" />
        <KPIBlock
          label="Commission tuần"
          value={`${Math.round(weeklyCommission).toLocaleString("vi-VN")}đ`}
          delta="đang là chỉ số ra quyết định chính"
          tone="positive"
        />
        <KPIBlock
          label="Views tháng"
          value={monthlyViews.toLocaleString("vi-VN")}
          delta="đo độ phủ và nhịp phân phối"
          tone="warning"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Summary blocks</h2>
          <div className="grid gap-3">
            {[
              {
                title: "Báo cáo ngày",
                note: "Xem nhanh những video vừa chạy gần nhất để phát hiện tín hiệu sớm.",
                value: `${daily[0]?.views.toLocaleString("vi-VN") ?? 0} views ở bản mới nhất`,
              },
              {
                title: "Báo cáo tuần",
                note: "Nhìn nhóm thắng, nhóm hụt nhịp và các sản phẩm đáng được giữ ngân sách.",
                value: `${Math.round(weeklyCommission).toLocaleString("vi-VN")}đ commission`,
              },
              {
                title: "Báo cáo tháng",
                note: "Đọc độ bền của sản phẩm, hook và format theo dữ liệu tích lũy rộng hơn.",
                value: `${monthlyViews.toLocaleString("vi-VN")} lượt xem`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                <p className="mt-3 text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recommendation summary</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Giữ các hook đang kéo CTR tốt và thử thêm ít nhất một format khác để kiểm tra độ bền.",
              "Với video commission thấp nhưng completion vẫn ổn, ưu tiên thay phần mở đầu trước khi bỏ toàn bộ script.",
              "Các sản phẩm score cao nhưng còn ít video nên được đẩy sang module script ở batch kế tiếp.",
              "Những video thua liên tục nên gom vào một nhóm re-test riêng để tránh làm nhiễu dashboard chính.",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Top 10 video tốt nhất</h2>
            <TagChip tone="success">Nên giữ làm mẫu</TagChip>
          </div>
          <div className="space-y-3">
            {topWinners.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 p-4 dark:bg-white/6"
              >
                <div className="min-w-0">
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Top 10 video kém nhất</h2>
            <TagChip tone="danger">Nên xem lại</TagChip>
          </div>
          <div className="space-y-3">
            {weakVideos.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 p-4 dark:bg-white/6"
              >
                <div className="min-w-0">
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
          <h2 className="text-lg font-semibold text-foreground">Top sản phẩm</h2>
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
          <h2 className="text-lg font-semibold text-foreground">Top hook nên giữ nhịp</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {topWinners.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm font-medium text-foreground">{item.hook}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.format} · {item.orders} đơn
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
