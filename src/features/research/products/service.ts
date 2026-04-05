import { ProductStatus } from "@prisma/client";
import { getDb } from "@/server/db";
import { demoProducts, demoScriptDrafts, demoVideoPerformance } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import { slugify } from "@/lib/sanitize";
import { normalizeVerificationStatus } from "@/lib/provenance";
import { computeProductScore } from "@/features/research/products/helpers";
import type { ProductInput } from "@/features/research/products/schema";
import { getDataSettings, getScoringSettings } from "@/features/settings/service";

export async function listProducts() {
  const settings = await getDataSettings();
  const products = await readOrDemo(
    () =>
      getDb().product.findMany({
        orderBy: [{ totalScore: "desc" }, { importedAt: "desc" }],
      }),
    () => [...demoProducts].sort((a, b) => b.totalScore - a.totalScore),
  );

  return settings.showDemoData ? products : products.filter((item) => !item.isDemo);
}

export async function getProductById(id: string) {
  const settings = await getDataSettings();
  const product = await readOrDemo(
    () =>
      getDb().product.findUnique({
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
      }),
    () => {
      const product = demoProducts.find((item) => item.id === id);
      if (!product) return null;

      return {
        ...product,
        scripts: demoScriptDrafts
          .filter((item) => item.productId === id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 5),
        videos: demoVideoPerformance
          .filter((item) => item.productId === id)
          .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
          .slice(0, 8),
      };
    },
  );

  if (!settings.showDemoData && product?.isDemo) return null;
  return product;
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
      sourceType: input.sourceType,
      collectedAt: input.collectedAt ?? null,
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
      lastVerifiedAt: input.lastVerifiedAt ?? null,
      confidenceLevel: input.confidenceLevel,
      verificationStatus: normalizeVerificationStatus(input),
      isDemo: input.sourceType === "SYSTEM_DEMO",
      notes: input.notes ?? null,
      externalReferenceUrl: input.externalReferenceUrl ?? null,
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
