import { ProductStatus } from "@prisma/client";
import { getDb } from "@/server/db";
import { slugify } from "@/lib/sanitize";
import { computeProductScore } from "@/features/research/products/helpers";
import type { ProductInput } from "@/features/research/products/schema";
import { getScoringSettings } from "@/features/settings/service";

export async function listProducts() {
  return getDb().product.findMany({
    orderBy: [{ totalScore: "desc" }, { importedAt: "desc" }],
  });
}

export async function getProductById(id: string) {
  return getDb().product.findUnique({
    where: { id },
    include: {
      scripts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      videos: {
        orderBy: { publishedAt: "desc" },
        take: 8,
      },
    },
  });
}

export async function createProduct(input: ProductInput) {
  const settings = await getScoringSettings();
  const score = computeProductScore(
    {
      easeOfFilming: input.easeOfFilming,
      competitionLevel: input.competitionLevel,
      saturationLevel: input.saturationLevel,
      offerAttractiveness: input.offerAttractiveness,
      commissionPercent: input.commissionPercent,
    },
    settings,
  );

  return getDb().product.create({
    data: {
      name: input.name,
      slug: input.slug || slugify(input.name),
      productUrl: input.productUrl,
      source: input.source,
      category: input.category,
      originalPrice: input.originalPrice,
      salePrice: input.salePrice,
      discountPercent: input.discountPercent,
      commissionPercent: input.commissionPercent,
      estimatedCommission: input.estimatedCommission,
      rating: input.rating,
      reviewCount: input.reviewCount,
      shopName: input.shopName,
      voucher: input.voucher ?? null,
      freeship: input.freeship,
      importedAt: input.importedAt,
      shortDescription: input.shortDescription,
      internalNote: input.internalNote ?? null,
      status: input.status,
      easeOfFilming: input.easeOfFilming,
      competitionLevel: input.competitionLevel,
      saturationLevel: input.saturationLevel,
      offerAttractiveness: input.offerAttractiveness,
      totalScore: score.totalScore,
      scoreBreakdown: score.scoreBreakdown,
    },
  });
}

export async function deleteProduct(id: string) {
  return getDb().product.delete({ where: { id } });
}

export async function getProductResearchSummary() {
  const products = await listProducts();
  const topProducts = products.slice(0, 5);
  const needTest = products.filter((product) => product.status === ProductStatus.DANG_TEST);

  return {
    products,
    topProducts,
    needTest,
  };
}
