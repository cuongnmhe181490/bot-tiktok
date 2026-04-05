import Link from "next/link";
import type { Metadata } from "next";
import { Download, Funnel, Plus, SlidersHorizontal } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { ProductForm } from "@/features/research/products/ui/product-form";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = buildMetadata(
  "Nghiên cứu sản phẩm | Kính Affiliate Studio",
  "Trung tâm nghiên cứu sản phẩm affiliate với search, filter, sort, score breakdown và quick add có validation chặt.",
  "/research/products",
);

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    status?: string;
    minScore?: string;
    sort?: string;
  }>;
};

export const dynamic = "force-dynamic";

const toneByStatus = {
  MOI: "info",
  DANG_TEST: "warning",
  DANG_CHAY: "default",
  THANG: "success",
  LOAI_BO: "danger",
} as const;

const labelByStatus = {
  MOI: "Mới",
  DANG_TEST: "Đang test",
  DANG_CHAY: "Đang chạy",
  THANG: "Thắng",
  LOAI_BO: "Loại bỏ",
} as const;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const products = await listProducts();

  const query = (params.q ?? "").trim().toLowerCase();
  const minScore = Number(params.minScore ?? 0);
  const categories = Array.from(new Set(products.map((item) => item.category)));
  const statuses = Array.from(new Set(products.map((item) => item.status)));

  const filtered = products
    .filter((item) => {
      if (query) {
        const haystack = [item.name, item.category, item.shopName, item.shortDescription]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (params.category && item.category !== params.category) return false;
      if (params.status && item.status !== params.status) return false;
      if (!Number.isNaN(minScore) && item.totalScore < minScore) return false;
      return true;
    })
    .sort((a, b) => {
      switch (params.sort) {
        case "commission":
          return b.estimatedCommission - a.estimatedCommission;
        case "discount":
          return b.discountPercent - a.discountPercent;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.importedAt.getTime() - a.importedAt.getTime();
        default:
          return b.totalScore - a.totalScore;
      }
    });

  const topCandidates = filtered.slice(0, 3);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 1"
        title="Trung tâm nghiên cứu sản phẩm"
        description="Tất cả bản ghi trong khu này chỉ đến từ nhập tay, CSV nội bộ hoặc dữ liệu demo. Giá trị score và các chỉ số như độ dễ quay, độ bão hòa là gợi ý nội bộ để hỗ trợ quyết định."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/api/products/export">
                <Download className="size-4" />
                Export CSV
              </Link>
            </Button>
            <Button asChild>
              <Link href="#quick-add">
                <Plus className="size-4" />
                Quick add product
              </Link>
            </Button>
          </div>
        }
      />

      <FilterBar
        mobileAction={
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4" />
            Bộ lọc
          </Button>
        }
      >
        <form className="contents" action="/research/products">
          <Input name="q" defaultValue={params.q} placeholder="Tìm theo tên, shop, mô tả..." />
          <Input name="category" defaultValue={params.category} placeholder="Ngành hàng" />
          <Input name="status" defaultValue={params.status} placeholder="Trạng thái" />
          <div className="flex gap-2">
            <Input name="minScore" defaultValue={params.minScore} placeholder="Score tối thiểu" />
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              <Funnel className="size-4" />
              Lọc
            </Button>
          </div>
          <input type="hidden" name="sort" value={params.sort ?? "score"} />
        </form>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <TagChip>{filtered.length} sản phẩm đang hiển thị</TagChip>
              <TagChip tone="info">{categories.length} ngành hàng</TagChip>
              <TagChip tone="warning">{statuses.length} trạng thái</TagChip>
            </div>
            <p className="text-sm text-muted-foreground">
              Sort hiện tại:{" "}
              <span className="font-medium text-foreground">
                {params.sort === "commission"
                  ? "hoa hồng"
                  : params.sort === "discount"
                    ? "giảm giá"
                    : params.sort === "rating"
                      ? "rating"
                      : params.sort === "newest"
                        ? "ngày nhập"
                        : "score"}
              </span>
              . Dùng cặp lọc này để chốt danh sách cần test trước khi chuyển qua khu tạo script.
            </p>
          </GlassPanel>

          <DataTable
            data={filtered}
            getKey={(item) => item.id}
            rowHref={(item) => `/research/products/${item.id}`}
            columns={[
              {
                key: "name",
                header: "Sản phẩm",
                render: (item) => (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs">{item.category} · {item.shopName}</p>
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
                key: "score",
                header: "Score",
                render: (item) => (
                  <div>
                    <p className="font-mono text-sm text-foreground">{item.totalScore}/100</p>
                    <p className="text-xs text-muted-foreground">
                      {item.scoreBreakdown.split("\n")[0]}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Gợi ý nội bộ
                    </p>
                  </div>
                ),
              },
              {
                key: "offer",
                header: "Offer",
                render: (item) => (
                  <div className="text-sm">
                    <p className="font-mono text-foreground">
                      {Math.round(item.salePrice).toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-xs text-muted-foreground">
                      -{item.discountPercent}% · HH {item.commissionPercent}%
                    </p>
                  </div>
                ),
              },
              {
                key: "rating",
                header: "Rating",
                render: (item) => (
                  <div className="text-sm">
                    <p className="font-mono text-foreground">{item.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">{item.reviewCount} review</p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Trạng thái",
                render: (item) => (
                  <TagChip tone={toneByStatus[item.status]}>{labelByStatus[item.status]}</TagChip>
                ),
              },
            ]}
          />

          {filtered.length === 0 ? (
            <GlassPanel className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-foreground">Chưa có sản phẩm khớp bộ lọc</h2>
              <p className="text-sm text-muted-foreground">
                Thử nới score tối thiểu, bỏ bớt trạng thái hoặc thêm sản phẩm mới để bắt đầu batch nghiên cứu.
              </p>
            </GlassPanel>
          ) : null}
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Top sản phẩm nên xem trước</h2>
              <p className="text-sm text-muted-foreground">
                Nhóm đang có score tốt nhất trong bộ lọc hiện tại. Score chỉ là lớp gợi ý nội bộ, không phải dữ liệu từ nền tảng.
              </p>
            </div>
            <div className="space-y-3">
              {topCandidates.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category} · {item.shopName}
                      </p>
                    </div>
                    <TagChip tone="success">{item.totalScore}/100</TagChip>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.shortDescription}</p>
                  <div className="mt-3">
                    <DataTrustBadges
                      source={item.source}
                      sourceType={item.sourceType}
                      confidenceLevel={item.confidenceLevel}
                      verificationStatus={item.verificationStatus}
                      isDemo={item.isDemo}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground whitespace-pre-line">
                    {item.scoreBreakdown}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel id="quick-add" className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Quick add product</h2>
              <p className="text-sm text-muted-foreground">
                Thêm nhanh bản ghi sản phẩm với metadata nguồn rõ ràng: dữ liệu tham chiếu tách riêng khỏi lớp scoring nội bộ.
              </p>
            </div>
            <ProductForm />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
