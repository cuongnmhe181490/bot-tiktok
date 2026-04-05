import { PrismaClient } from "@prisma/client";
import {
  demoDataSettings,
  demoDraftProjects,
  demoProducts,
  demoScoringSettings,
  demoScriptDrafts,
  demoScriptTemplates,
  demoTrends,
  demoVideoPerformance,
} from "../src/server/demo-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.videoPerformance.deleteMany();
  await prisma.scriptDraft.deleteMany();
  await prisma.scriptTemplate.deleteMany();
  await prisma.draftProject.deleteMany();
  await prisma.trend.deleteMany();
  await prisma.product.deleteMany();
  await prisma.dataSettings.deleteMany();
  await prisma.scoringSettings.deleteMany();

  await prisma.scoringSettings.create({ data: demoScoringSettings });
  await prisma.dataSettings.create({ data: demoDataSettings });

  for (const product of demoProducts) {
    await prisma.product.create({ data: product });
  }

  for (const trend of demoTrends) {
    await prisma.trend.create({ data: trend });
  }

  for (const template of demoScriptTemplates) {
    await prisma.scriptTemplate.create({ data: template });
  }

  for (const script of demoScriptDrafts) {
    await prisma.scriptDraft.create({ data: script });
  }

  for (const draft of demoDraftProjects) {
    await prisma.draftProject.create({ data: draft });
  }

  for (const video of demoVideoPerformance) {
    await prisma.videoPerformance.create({ data: video });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
