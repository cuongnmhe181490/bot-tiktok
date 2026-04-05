import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock3, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listDraftProjects } from "@/features/drafts/service";
import { getAnalyticsOverview } from "@/features/analytics/service";
import { listProducts } from "@/features/research/products/service";
import { listTrends } from "@/features/research/trends/service";
import { listScriptDrafts } from "@/features/scripts/service";
import { ChartCard } from "@/components/chart-card";
import { BarRankingChart } from "@/components/charts/bar-ranking-chart";
import { LinePerformanceChart } from "@/components/charts/line-performance-chart";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata(
  "Dashboard | Kính Affiliate Studio",
  "Dashboard vận hành cho studio affiliate: KPI, sản phẩm cần test, script chờ quay, video cần re-test và hiệu suất 7 ngày.",
  "/dashboard",
);

type DashboardPageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

const periodOptions = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
] as const;

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const period = periodOptions.some((item) => item.value === params.period)
    ? params.period!
    : "7d";

  const [products, trends, analytics, scripts, drafts] = await Promise.all([
    listProducts(),
    listTrends(),
    getAnalyticsOverview(),
    listScriptDrafts(),
    listDraftProjects(),
  ]);

  const periodCount = period === "today" ? 1 : period === "30d" ? 30 : 7;
  const scopedVideos = analytics.videos.slice(0, Math.min(periodCount * 3, analytics.videos.length));
  const commission7d = analytics.videos.slice(0, 7).reduce((sum, item) => sum + item.commission, 0);
  const productsToTest = products.filter((item) => item.status === "DANG_TEST");
  const scriptWaiting = scripts.filter((item) => !item.bestVersion).slice(0, 3);
  const videosToRetest = analytics.losers.slice(0, 5);
  const hotProducts = products.slice(0, 5).map((item) => ({
    label: item.name.slice(0, 18),
    value: item.totalScore,
  }));
  const winningHooks = analytics.topHooks.slice(0, 5);
  const performanceTrend = scopedVideos
    .slice()
    .reverse()
    .map((item) => ({
      label: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
        item.publishedAt,
      ),
      value: Math.round(item.commission),
    }));

  const actions = [
    {
      title: "Chốt batch test tiếp theo",
      description: `${productsToTest.length} sản phẩm đang ở vùng nên test ngay.`,
      href: "/research/products",
      icon: Sparkles,
    },
    {
      title: "Dọn script chờ quay",
      description: `${scriptWaiting.length} script chưa được chốt bản quay.`,
      href: "/scripts",
      icon: PlayCircle,
    },
    {
      title: "Xem video đang tụt nhịp",
      description: `${videosToRetest.length} video cần re-test hoặc đổi hook.`,
      href: "/analytics",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    ...products.slice(0, 2).map((item) => ({
      title: `Cập nhật sản phẩm: ${item.name}`,
      note: `Score ${item.totalScore} · ${item.category}`,
      time: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
        item.updatedAt,
      ),
    })),
    ...scripts.slice(0, 2).map((item) => ({
      title: `Tạo script: ${item.title}`,
      note: `${item.product.name} · ${item.goal.replaceAll("_", " ").toLowerCase()}`,
      time: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
        item.updatedAt,
      ),
    })),
    ...analytics.winners.slice(0, 2).map((item) => ({
      title: `Video thắng: ${item.title}`,
      note: `${Math.round(item.commission).toLocaleString("vi-VN")}đ commission`,
      time: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
        item.publishedAt,
      ),
    })),
  ].slice(0, 6);

  const nextSteps = [
    `Ghép ${trends[0]?.name.toLowerCase() ?? "trend mới"} vào 2 sản phẩm score cao nhất để mở batch test mới.`,
    `Đổi hook cho ${videosToRetest[0]?.title.toLowerCase() ?? "video CTR thấp"} vì completion đang giảm.`,
    `Khóa shot list cho ${drafts[0]?.title.toLowerCase() ?? "project đầu tiên"} trước khung quay tiếp theo.`,
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Dashboard"
        title="Một nhịp nhìn đủ để biết hôm nay nên làm gì trước."
        description="Dashboard này gom đúng các tín hiệu vận hành quan trọng: sản phẩm cần test, script chờ quay, video cần re-test và khoản commission đang kéo tăng trưởng."
        action={
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((item) => (
              <Button
                key={item.value}
                asChild
                variant={item.value === period ? "default" : "outline"}
                size="sm"
              >
                <Link href={`/dashboard?period=${item.value}`}>{item.label}</Link>
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock
          label="Sản phẩm cần test"
          value={String(productsToTest.length)}
          delta="ưu tiên trong tuần"
          tone="warning"
        />
        <KPIBlock
          label="Script chờ quay"
          value={String(scriptWaiting.length)}
          delta="cần khóa bản cuối"
          tone="neutral"
        />
        <KPIBlock
          label="Video cần re-test"
          value={String(videosToRetest.length)}
          delta="đang hụt nhịp"
          tone="danger"
        />
        <KPIBlock
          label="Tổng commission 7 ngày"
          value={`${Math.round(commission7d).toLocaleString("vi-VN")}đ`}
          delta={`${analytics.winners.length} video thắng`}
          tone="positive"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Xu hướng hiệu suất"
          description="Đọc nhịp commission ở giai đoạn gần nhất để biết nên scale hay giữ quan sát."
        >
          <LinePerformanceChart data={performanceTrend} />
        </ChartCard>
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Việc tiếp theo nên làm</h2>
              <p className="text-sm text-muted-foreground">
                Ba việc có tác động rõ nhất trong nhịp hiện tại.
              </p>
            </div>
            <Clock3 className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {nextSteps.map((item) => (
              <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <ChartCard
          title="Top sản phẩm tuần này"
          description="Sản phẩm đang có score và offer đủ đẹp để đẩy tiếp."
        >
          <BarRankingChart data={hotProducts} />
        </ChartCard>

        <ChartCard
          title="Hook đang thắng"
          description="Hook kéo view tốt nhất trong dữ liệu gần đây."
        >
          <BarRankingChart data={winningHooks} />
        </ChartCard>

        <GlassPanel className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Video cần xử lý hôm nay</h2>
            <p className="text-sm text-muted-foreground">
              Nhóm video đang có tín hiệu cần chỉnh angle, hook hoặc CTA.
            </p>
          </div>
          <div className="space-y-3">
            {videosToRetest.slice(0, 4).map((video) => (
              <div key={video.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {video.format} · {video.product.name}
                    </p>
                  </div>
                  <TagChip tone="danger">cần re-test</TagChip>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
              <p className="text-sm text-muted-foreground">
                Lối tắt đúng ngữ cảnh để không phải đi vòng qua menu.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl bg-white/55 p-4 transition hover:bg-white/70 dark:bg-white/6 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent activity feed</h2>
            <p className="text-sm text-muted-foreground">
              Tóm tắt các cập nhật gần nhất để giữ nhịp vận hành liền mạch.
            </p>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <TagChip>{item.time}</TagChip>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
