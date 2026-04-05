import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getProductById } from "@/features/research/products/service";
import { SectionHeader } from "@/components/section-header";
import { GlassPanel } from "@/components/glass-panel";
import { TagChip } from "@/components/tag-chip";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return buildMetadata(
    product ? `${product.name} | Nghiên cứu sản phẩm` : "Chi tiết sản phẩm",
    product?.shortDescription ?? "Chi tiết sản phẩm trong module nghiên cứu.",
    `/research/products/${id}`,
  );
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Chi tiết sản phẩm"
        title={product.name}
        description={product.shortDescription}
      />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <TagChip>{product.status.replaceAll("_", " ")}</TagChip>
            <TagChip tone="info">{product.category}</TagChip>
            <TagChip tone="success">Score {product.totalScore}</TagChip>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Giá sale</p>
              <p className="font-mono text-xl font-semibold text-foreground">
                {Math.round(product.salePrice).toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoa hồng ước tính</p>
              <p className="font-mono text-xl font-semibold text-foreground">
                {Math.round(product.estimatedCommission).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Giải thích điểm</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-white/50 p-4 text-sm text-muted-foreground dark:bg-white/6">
              {product.scoreBreakdown}
            </pre>
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Kịch bản gần đây</p>
            <div className="mt-3 space-y-3">
              {product.scripts.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm">{item.audience}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Video gần đây</p>
            <div className="mt-3 space-y-3">
              {product.videos.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm">{item.views.toLocaleString("vi-VN")} views</p>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
