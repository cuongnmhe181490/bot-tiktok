import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAnalyticsOverview } from "@/features/analytics/service";
import { ChartCard } from "@/components/chart-card";
import { BarRankingChart } from "@/components/charts/bar-ranking-chart";
import { LinePerformanceChart } from "@/components/charts/line-performance-chart";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata(
  "Hiệu suất nội dung | Kính Affiliate Studio",
  "Analytics thật cho studio affiliate: line chart, top sản phẩm, top hook, bảng video records, winners, losers và gợi ý re-test.",
  "/analytics",
);

type AnalyticsPageProps = {
  searchParams?: Promise<{
    q?: string;
    product?: string;
    format?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = (await searchParams) ?? {};
  const analytics = await getAnalyticsOverview();
  const query = (params.q ?? "").trim().toLowerCase();

  const filteredVideos = analytics.videos.filter((item) => {
    if (params.product && item.product.name !== params.product) return false;
    if (params.format && item.format !== params.format) return false;
    if (query) {
      const haystack = [item.title, item.hook, item.angle, item.format].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const lineData = filteredVideos.slice(0, 12).reverse().map((item) => ({
    label: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
      item.publishedAt,
    ),
    value: item.commission,
  }));

  const topProducts = Object.entries(
    filteredVideos.reduce<Record<string, number>>((acc, item) => {
      acc[item.product.name] = (acc[item.product.name] ?? 0) + item.commission;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value: Math.round(value) }));

  const topFormats = Object.entries(
    filteredVideos.reduce<Record<string, number>>((acc, item) => {
      acc[item.format] = (acc[item.format] ?? 0) + item.orders;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalClicks = filteredVideos.reduce((sum, item) => sum + item.clicks, 0);
  const totalOrders = filteredVideos.reduce((sum, item) => sum + item.orders, 0);
  const totalCommission = filteredVideos.reduce((sum, item) => sum + item.commission, 0);
  const totalViews = filteredVideos.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 4"
        title="Analytics nội dung"
        description="Trang này chỉ đọc từ dữ liệu nội bộ: manual entry, CSV import và demo data. Trust badge giúp bạn biết bản ghi nào đã đối chiếu, bản ghi nào chỉ nên xem như tham chiếu tạm."
        action={
          <Button asChild variant="outline">
            <Link href="/analytics/videos">Mở video records</Link>
          </Button>
        }
      />

      <FilterBar>
        <form className="contents" action="/analytics">
          <Input name="q" defaultValue={params.q} placeholder="Tìm tiêu đề, hook, angle..." />
          <Input name="product" defaultValue={params.product} placeholder="Tên sản phẩm" />
          <Input name="format" defaultValue={params.format} placeholder="Format" />
          <div className="flex items-center">
            <Button type="submit" variant="outline" size="sm">
              Áp dụng
            </Button>
          </div>
        </form>
      </FilterBar>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock label="Tổng views" value={totalViews.toLocaleString("vi-VN")} />
        <KPIBlock label="Tổng click" value={totalClicks.toLocaleString("vi-VN")} />
        <KPIBlock label="Tổng orders" value={totalOrders.toLocaleString("vi-VN")} tone="warning" />
        <KPIBlock
          label="Tổng commission"
          value={`${Math.round(totalCommission).toLocaleString("vi-VN")}đ`}
          tone="positive"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          title="Line chart theo thời gian"
          description="Commission theo nhịp đăng gần nhất để nhìn xu hướng tăng giảm."
        >
          <LinePerformanceChart data={lineData} />
        </ChartCard>
        <ChartCard
          title="Top sản phẩm"
          description="Sản phẩm kéo commission mạnh nhất trong tập dữ liệu đang lọc."
        >
          <BarRankingChart data={topProducts} />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <ChartCard
          title="Top hook"
          description="Hook đang kéo view tốt nhất."
        >
          <BarRankingChart data={analytics.topHooks.slice(0, 5)} />
        </ChartCard>

        <GlassPanel className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Format nào đang hiệu quả</h2>
            <p className="text-sm text-muted-foreground">
              Xếp theo số đơn để biết format nào nên giữ làm trục chính.
            </p>
          </div>
          <div className="space-y-3">
            {topFormats.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{label}</p>
                  <TagChip tone="success">{value} đơn</TagChip>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Gợi ý re-test</h2>
            <p className="text-sm text-muted-foreground">
              Video đang hụt nhịp nhưng vẫn còn dữ liệu để thử lại.
            </p>
          </div>
          <div className="space-y-3">
            {analytics.losers.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  CTR {item.ctr}% · {item.format} · {item.angle}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Bảng video records</h2>
            <p className="text-sm text-muted-foreground">
              Bảng rút gọn để đọc nhanh title, hook, format, views, orders và commission.
            </p>
          </div>
          <DataTable
            data={filteredVideos.slice(0, 10)}
            getKey={(item) => item.id}
            rowHref={(item) => `/analytics/videos/${item.id}`}
            columns={[
              {
                key: "title",
                header: "Video",
                render: (item) => (
                  <div className="space-y-2">
                    <Link href={`/analytics/videos/${item.id}`} className="font-medium text-foreground">
                      {item.title}
                    </Link>
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
                key: "metric",
                header: "Hiệu suất",
                render: (item) => (
                  <div className="text-sm">
                    <p>{item.views.toLocaleString("vi-VN")} views</p>
                    <p className="text-xs text-muted-foreground">
                      {item.orders} đơn · {Math.round(item.commission).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </GlassPanel>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent winners</h2>
            <div className="space-y-3">
              {analytics.winners.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(item.commission).toLocaleString("vi-VN")}đ commission
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent losers</h2>
            <div className="space-y-3">
              {analytics.losers.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Completion {item.completionRate}% · {item.format}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
