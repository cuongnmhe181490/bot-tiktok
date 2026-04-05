import { getDb } from "@/server/db";
import type { TrendInput } from "@/features/research/trends/schema";

export async function listTrends() {
  return getDb().trend.findMany({
    orderBy: [{ discoveredAt: "desc" }, { heatLevel: "desc" }],
  });
}

export async function createTrend(input: TrendInput) {
  return getDb().trend.create({
    data: {
      name: input.name,
      trendType: input.trendType,
      description: input.description,
      suitableNiche: input.suitableNiche,
      referenceUrl: input.referenceUrl || null,
      heatLevel: input.heatLevel,
      applicability: input.applicability,
      saturationLevel: input.saturationLevel,
      discoveredAt: input.discoveredAt,
      note: input.note ?? null,
    },
  });
}
