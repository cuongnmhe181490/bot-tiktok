import { getDb } from "@/server/db";
import { demoDataSettings, demoScoringSettings } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import type { DataSettingsInput, ScoringSettingsInput } from "@/features/settings/schema";

export async function getScoringSettings() {
  return readOrDemo(async () => {
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
  }, () => demoScoringSettings);
}

export async function updateScoringSettings(input: ScoringSettingsInput) {
  const current = await getScoringSettings();

  return getDb().scoringSettings.update({
    where: { id: current.id },
    data: input,
  });
}

export async function getDataSettings() {
  return readOrDemo(async () => {
    const db = getDb();
    const current = await db.dataSettings.findFirst();

    if (current) return current;

    return db.dataSettings.create({
      data: {
        freeOnlyMode: true,
        showDemoData: true,
      },
    });
  }, () => demoDataSettings);
}

export async function updateDataSettings(input: DataSettingsInput) {
  const current = await getDataSettings();

  return getDb().dataSettings.update({
    where: { id: current.id },
    data: input,
  });
}
