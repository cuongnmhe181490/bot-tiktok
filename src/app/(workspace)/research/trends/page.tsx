import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { listTrends } from "@/features/research/trends/service";
import { TrendForm } from "@/features/research/trends/ui/trend-form";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = buildMetadata(
  "Xu hướng | Kính Affiliate Studio",
  "Radar xu hướng affiliate với heat indicator, mức độ dễ áp dụng, mức bão hòa và gợi ý trend nên ghép với sản phẩm nào.",
  "/research/trends",
);

type TrendsPageProps = {
  searchParams?: Promise<{
    type?: string;
    niche?: string;
    sort?: string;
  }>;
};

export const dynamic = "force-dynamic";

function getActionTone(heatLevel: number, saturationLevel: number) {
  if (heatLevel >= 8 && saturationLevel <= 6) {
    return { label: "Nên dùng ngay", tone: "success" as const };
  }
  if (saturationLevel >= 8) {
    return { label: "Đã bão hòa", tone: "danger" as const };
  }
  return { label: "Nên quan sát", tone: "warning" as const };
}

export default async function TrendsPage({ searchParams }: TrendsPageProps) {
  const params = (await searchParams) ?? {};
  const [trends, products] = await Promise.all([listTrends(), listProducts()]);

  const filtered = trends
    .filter((item) => {
      if (params.type && item.trendType !== params.type) return false;
      if (params.niche && item.suitableNiche !== params.niche) return false;
      return true;
    })
    .sort((a, b) => {
      switch (params.sort) {
        case "saturation":
          return b.saturationLevel - a.saturationLevel;
        case "newest":
          return b.discoveredAt.getTime() - a.discoveredAt.getTime();
        default:
          return b.heatLevel - a.heatLevel;
      }
    });

  const trendMatches = filtered.slice(0, 4).map((trend) => ({
    trend,
    products: products
      .filter((product) => product.category === trend.suitableNiche)
      .slice(0, 2),
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 1"
        title="Radar xu hướng"
        description="Trang này giữ các trend theo ngữ cảnh riêng: đọc độ nóng, độ dễ áp dụng và độ bão hòa để biết trend nào nên dùng ngay, trend nào chỉ nên quan sát."
        action={
          <Button asChild>
            <Link href="#quick-add">
              <Plus className="size-4" />
              Thêm trend
            </Link>
          </Button>
        }
      />

      <FilterBar>
        <form className="contents" action="/research/trends">
          <Input name="type" defaultValue={params.type} placeholder="Loại trend" />
          <Input name="niche" defaultValue={params.niche} placeholder="Niche phù hợp" />
          <Input name="sort" defaultValue={params.sort} placeholder="Sort: heat / saturation / newest" />
          <div className="flex items-center">
            <Button type="submit" variant="outline" size="sm">
              Áp dụng
            </Button>
          </div>
        </form>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <DataTable
            data={filtered}
            getKey={(item) => item.id}
            columns={[
              {
                key: "name",
                header: "Trend",
                render: (item) => {
                  const action = getActionTone(item.heatLevel, item.saturationLevel);
                  return (
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <TagChip tone={action.tone}>{action.label}</TagChip>
                      </div>
                      <p className="text-xs">{item.suitableNiche} · {item.trendType.replaceAll("_", " ").toLowerCase()}</p>
                    </div>
                  );
                },
              },
              {
                key: "heat",
                header: "Heat",
                render: (item) => (
                  <div className="space-y-1">
                    <p className="font-mono text-sm text-foreground">{item.heatLevel}/10</p>
                    <div className="h-2 rounded-full bg-slate-200/70 dark:bg-white/10">
                      <div
                        className="h-2 rounded-full bg-sky-500/70"
                        style={{ width: `${item.heatLevel * 10}%` }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "apply",
                header: "Dễ áp dụng",
                render: (item) => <span className="font-mono text-sm">{item.applicability}/10</span>,
              },
              {
                key: "sat",
                header: "Bão hòa",
                render: (item) => <span className="font-mono text-sm">{item.saturationLevel}/10</span>,
              },
            ]}
          />

          {filtered.length === 0 ? (
            <GlassPanel className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-foreground">Chưa có trend phù hợp bộ lọc</h2>
              <p className="text-sm text-muted-foreground">
                Thử bỏ bớt niche hoặc loại trend để mở rộng radar. Sau đó ghép lại với nhóm sản phẩm đang cần test.
              </p>
            </GlassPanel>
          ) : null}
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Trend gợi ý ghép với sản phẩm nào</h2>
              <p className="text-sm text-muted-foreground">
                Gợi ý nhanh theo cùng niche để rút ngắn thời gian lên batch quay.
              </p>
            </div>
            <div className="space-y-3">
              {trendMatches.map(({ trend, products: matchedProducts }) => (
                <div key={trend.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{trend.name}</p>
                    <TagChip tone={getActionTone(trend.heatLevel, trend.saturationLevel).tone}>
                      {getActionTone(trend.heatLevel, trend.saturationLevel).label}
                    </TagChip>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{trend.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {matchedProducts.length > 0 ? (
                      matchedProducts.map((product) => (
                        <TagChip key={product.id} tone="info">
                          {product.name}
                        </TagChip>
                      ))
                    ) : (
                      <TagChip>Chưa có sản phẩm cùng niche</TagChip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel id="quick-add" className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Thêm trend mới</h2>
              <p className="text-sm text-muted-foreground">
                Lưu trend dưới dạng dữ liệu có cấu trúc để sau này còn ghép được với generator và connector.
              </p>
            </div>
            <TrendForm />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
