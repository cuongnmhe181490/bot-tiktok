import Link from "next/link";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { ProductForm } from "@/features/research/products/ui/product-form";
import { SectionHeader } from "@/components/section-header";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { GlassPanel } from "@/components/glass-panel";
import { TagChip } from "@/components/tag-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = buildMetadata(
  "Nghiên cứu sản phẩm | Kính Affiliate Studio",
  "Quản lý sản phẩm affiliate, chấm điểm theo scoring engine và lọc nhanh ứng viên nên test.",
  "/research/products",
);

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 1"
        title="Nghiên cứu sản phẩm"
        description="Gom sản phẩm về một nơi, chấm điểm nhanh và giữ note nội bộ đủ rõ để ra quyết định test."
        action={
          <Button asChild variant="outline">
            <Link href="/api/products/export">
              <Download className="size-4" />
              Export CSV
            </Link>
          </Button>
        }
      />

      <FilterBar>
        <Input placeholder="Lọc theo ngành hàng" />
        <Input placeholder="Lọc theo trạng thái" />
        <Input placeholder="Lọc theo score tối thiểu" />
        <Input placeholder="Lọc theo nguồn" />
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DataTable
          data={products}
          getKey={(item) => item.id}
          rowHref={(item) => `/research/products/${item.id}`}
          columns={[
            {
              key: "name",
              header: "Sản phẩm",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs">{item.category}</p>
                </div>
              ),
            },
            {
              key: "score",
              header: "Score",
              render: (item) => <span className="font-mono text-sm">{item.totalScore}</span>,
            },
            {
              key: "price",
              header: "Giá sale",
              render: (item) => (
                <span className="font-mono text-sm">
                  {Math.round(item.salePrice).toLocaleString("vi-VN")}đ
                </span>
              ),
            },
            {
              key: "status",
              header: "Trạng thái",
              render: (item) => <TagChip>{item.status.replaceAll("_", " ")}</TagChip>,
            },
          ]}
        />

        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Quick add</h2>
            <p>Thêm nhanh một sản phẩm mới với validation đầy đủ ở cả client và server.</p>
          </div>
          <ProductForm />
        </GlassPanel>
      </div>
    </div>
  );
}
