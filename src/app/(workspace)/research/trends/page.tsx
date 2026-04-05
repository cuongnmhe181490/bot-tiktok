import type { Metadata } from "next";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSourceTypeLabel, getTrendTypeLabel } from "@/lib/labels";
import { getTrendActionLabel } from "@/features/research/trends/helpers";
import { listProducts } from "@/features/research/products/service";
import { listTrends } from "@/features/research/trends/service";
import { CreativeCenterImport } from "@/features/research/trends/ui/creative-center-import";
import { GoogleTrendsImport } from "@/features/research/trends/ui/google-trends-import";
import { TrendForm } from "@/features/research/trends/ui/trend-form";
import { DataTable } from "@/components/data-table";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = buildMetadata(
  "Trend Inbox | Kính Affiliate Studio",
  "Trend Inbox free-only cho Kính Affiliate Studio: nhập nhanh từ TikTok Creative Center, import Google Trends CSV và phân biệt rõ dữ liệu tham chiếu với gợi ý nội bộ.",
  "/research/trends",
);

type TrendsPageProps = {
  searchParams?: Promise<{
    type?: string;
    niche?: string;
    sort?: string;
    sourceType?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function TrendsPage({ searchParams }: TrendsPageProps) {
  const params = (await searchParams) ?? {};
  const [trends, products] = await Promise.all([listTrends(), listProducts()]);

  const filtered = trends
    .filter((item) => {
      if (params.type && item.trendType !== params.type) return false;
      if (params.niche && item.suitableNiche !== params.niche) return false;
      if (params.sourceType && item.sourceType !== params.sourceType) return false;
      return true;
    })
    .sort((a, b) => {
      switch (params.sort) {
        case "saturation":
          return b.saturationLevel - a.saturationLevel;
        case "newest":
          return b.discoveredAt.getTime() - a.discoveredAt.getTime();
        default:
          return (b.trendScore ?? b.heatLevel * 10) - (a.trendScore ?? a.heatLevel * 10);
      }
    });

  const trendMatches = filtered.slice(0, 5).map((trend) => ({
    trend,
    products: products.filter((product) => product.category === trend.suitableNiche).slice(0, 3),
  }));

  const sourceSummary = Object.entries(
    filtered.reduce<Record<string, number>>((acc, item) => {
      acc[item.sourceType] = (acc[item.sourceType] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Trend Inbox"
        title="Radar xu hướng free-only"
        description="Tất cả trend trong khu này chỉ đến từ nguồn miễn phí hoặc dữ liệu bạn tự nhập: TikTok Creative Center, Google Trends, CSV nội bộ và dữ liệu demo."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a href="/api/trends/template?kind=google">
                <Download className="size-4" />
                Mẫu Google Trends
              </a>
            </Button>
            <Button asChild>
              <Link href="#trend-inbox">
                <Plus className="size-4" />
                Mở Trend Inbox
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassPanel className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Nguồn đang có</p>
          <div className="flex flex-wrap gap-2">
            {sourceSummary.map(([sourceType, count]) => (
              <TagChip key={sourceType} tone="info">
                {getSourceTypeLabel(sourceType)} · {count}
              </TagChip>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trend nào cũng hiển thị nguồn, thời điểm thu thập, mức độ tin cậy và trạng thái xác minh.
          </p>
        </GlassPanel>
        <GlassPanel className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Fact data</p>
          <p className="text-sm text-muted-foreground">
            Bản ghi nhập tay, CSV import, Google Trends và TikTok Creative Center được xem là dữ liệu tham chiếu.
          </p>
          <DataTrustBadges
            source="TikTok Creative Center"
            sourceType="TIKTOK_CREATIVE_CENTER"
            confidenceLevel="HIGH"
            verificationStatus="DA_DOI_CHIEU"
          />
        </GlassPanel>
        <GlassPanel className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Gợi ý nội bộ</p>
          <p className="text-sm text-muted-foreground">
            Điểm số, action label và gợi ý ghép trend với sản phẩm chỉ là lớp hỗ trợ nội bộ, không phải dữ liệu nền tảng.
          </p>
          <TagChip tone="warning">Gợi ý nội bộ</TagChip>
        </GlassPanel>
      </div>

      <FilterBar
        summary="Lọc theo loại trend, niche hoặc nguồn để quét nhanh tín hiệu thật."
        activeCount={[params.type, params.niche, params.sourceType, params.sort].filter(Boolean).length}
      >
        <form className="contents" action="/research/trends">
          <Input name="type" defaultValue={params.type} placeholder="Loại trend" />
          <Input name="niche" defaultValue={params.niche} placeholder="Niche" />
          <Input name="sourceType" defaultValue={params.sourceType} placeholder="Nguồn" />
          <div className="flex gap-2">
            <Input name="sort" defaultValue={params.sort} placeholder="Sort: score / saturation / newest" />
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              Lọc
            </Button>
          </div>
        </form>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <DataTable
            data={filtered}
            getKey={(item) => item.id}
            mobileTitle={(item) => item.name}
            columns={[
              {
                key: "name",
                header: "Trend",
                render: (item) => (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <TagChip tone="warning">{getTrendActionLabel(item.heatLevel, item.saturationLevel, item.confidenceLevel)}</TagChip>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.suitableNiche} · {getTrendTypeLabel(item.trendType)}
                    </p>
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
                key: "heat",
                header: "Tín hiệu",
                render: (item) => (
                  <div className="space-y-1 text-sm">
                    <p className="font-mono text-foreground">
                      Heat {item.heatLevel}/10
                      {typeof item.trendScore === "number" ? ` · Score ${item.trendScore}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dễ áp dụng {item.applicability}/10 · Bão hòa {item.saturationLevel}/10
                    </p>
                  </div>
                ),
              },
              {
                key: "source",
                header: "Nguồn",
                render: (item) => (
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{item.source}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.region || "Không rõ vùng"} · {item.timeWindow || "Không có khung thời gian"}
                    </p>
                  </div>
                ),
              },
            ]}
          />

          {filtered.length === 0 ? (
            <GlassPanel className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-foreground">Chưa có trend khớp bộ lọc</h2>
              <p className="text-sm text-muted-foreground">
                Thử nới bộ lọc hoặc dùng Trend Inbox để nhập thêm trend từ nguồn miễn phí.
              </p>
            </GlassPanel>
          ) : null}
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Trend nên ghép với sản phẩm nào</h2>
              <p className="text-sm text-muted-foreground">
                Đây là gợi ý nội bộ dựa trên cùng niche. Không phải dữ liệu lấy từ nền tảng.
              </p>
            </div>
            <div className="space-y-3">
              {trendMatches.map(({ trend, products: matchedProducts }) => (
                <div key={trend.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{trend.name}</p>
                    <TagChip tone="warning">Gợi ý nội bộ</TagChip>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{trend.note || trend.description}</p>
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
        </div>
      </div>

      <div id="trend-inbox" className="grid gap-4 xl:grid-cols-3">
        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Creative Center quick import</h2>
            <p className="text-sm text-muted-foreground">
              Dán nhanh tín hiệu vừa thấy trên TikTok Creative Center. Không dùng API, không scrape.
            </p>
          </div>
          <CreativeCenterImport />
        </GlassPanel>

        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Google Trends import</h2>
            <p className="text-sm text-muted-foreground">
              Import CSV công khai từ Google Trends, xem trước số dòng hợp lệ rồi mới xác nhận.
            </p>
          </div>
          <GoogleTrendsImport />
        </GlassPanel>

        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Nhập tay có cấu trúc</h2>
            <p className="text-sm text-muted-foreground">
              Dùng khi bạn muốn lưu một tín hiệu riêng, thêm niche và ghi chú xác minh chi tiết.
            </p>
          </div>
          <TrendForm />
        </GlassPanel>
      </div>
    </div>
  );
}
