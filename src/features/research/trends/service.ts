import { getDb } from "@/server/db";
import { demoTrends } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import { normalizeVerificationStatus } from "@/lib/provenance";
import { inferTrendConfidence, isLikelyDuplicateTrend } from "@/features/research/trends/helpers";
import type { TrendInput } from "@/features/research/trends/schema";
import { getDataSettings } from "@/features/settings/service";

export async function listTrends() {
  const settings = await getDataSettings();
  const trends = await readOrDemo(
    () =>
      getDb().trend.findMany({
        orderBy: [{ discoveredAt: "desc" }, { heatLevel: "desc" }],
      }),
    () =>
      [...demoTrends].sort(
        (a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime() || b.heatLevel - a.heatLevel,
      ),
  );

  return settings.showDemoData ? trends : trends.filter((item) => !item.isDemo);
}

export async function createTrend(input: TrendInput) {
  const confidenceLevel =
    input.confidenceLevel ??
    inferTrendConfidence({
      sourceType: input.sourceType,
      externalReferenceUrl: input.externalReferenceUrl,
      collectedAt: input.collectedAt,
      isDemo: input.sourceType === "SYSTEM_DEMO",
    });

  return getDb().trend.create({
    data: {
      name: input.name,
      trendType: input.trendType,
      source: input.source,
      sourceType: input.sourceType,
      description: input.description,
      suitableNiche: input.suitableNiche,
      externalReferenceUrl: input.externalReferenceUrl || null,
      region: input.region ?? null,
      timeWindow: input.timeWindow ?? null,
      trendScore: input.trendScore ?? null,
      heatLevel: input.heatLevel,
      applicability: input.applicability,
      saturationLevel: input.saturationLevel,
      discoveredAt: input.discoveredAt,
      collectedAt: input.collectedAt ?? null,
      importedAt: input.importedAt,
      lastVerifiedAt: input.lastVerifiedAt ?? null,
      confidenceLevel,
      verificationStatus: normalizeVerificationStatus({
        ...input,
        confidenceLevel,
      }),
      isDemo: input.sourceType === "SYSTEM_DEMO",
      notes: input.notes ?? null,
      note: input.note ?? null,
    },
  });
}

export async function detectTrendDuplicates(names: string[]) {
  const trends = await listTrends();
  const existingNames = trends.map((item) => item.name);
  return names.map((name) => ({
    name,
    duplicate: isLikelyDuplicateTrend(name, existingNames),
  }));
}
