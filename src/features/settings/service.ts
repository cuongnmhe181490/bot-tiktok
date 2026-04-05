import { getDb } from "@/server/db";
import type { ScoringSettingsInput } from "@/features/settings/schema";

export async function getScoringSettings() {
  const db = getDb();
  const current = await db.scoringSettings.findFirst();

  if (current) return current;

  return db.scoringSettings.create({
    data: {
      easeWeight: 20,
      competitionWeight: 20,
      saturationWeight: 15,
      offerWeight: 25,
      commissionWeight: 20,
    },
  });
}

export async function updateScoringSettings(input: ScoringSettingsInput) {
  const current = await getScoringSettings();

  return getDb().scoringSettings.update({
    where: { id: current.id },
    data: input,
  });
}
