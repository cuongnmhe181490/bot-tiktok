import { getDb } from "@/server/db";
import { demoTrends } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import type { TrendInput } from "@/features/research/trends/schema";

export async function listTrends() {
  return readOrDemo(
    () =>
      getDb().trend.findMany({
        orderBy: [{ discoveredAt: "desc" }, { heatLevel: "desc" }],
      }),
    () =>
      [...demoTrends].sort(
        (a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime() || b.heatLevel - a.heatLevel,
      ),
  );
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
