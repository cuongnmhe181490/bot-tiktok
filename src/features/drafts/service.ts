import { getDb } from "@/server/db";
import { buildDraftPackage } from "@/features/drafts/helpers";
import type { DraftProjectInput } from "@/features/drafts/schema";

export async function listDraftProjects() {
  return getDb().draftProject.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDraftProjectById(id: string) {
  return getDb().draftProject.findUnique({
    where: { id },
  });
}

export async function createDraftProject(input: DraftProjectInput) {
  const generated = buildDraftPackage(input);

  return getDb().draftProject.create({
    data: {
      title: input.title,
      productName: input.productName,
      rawScript: input.rawScript,
      ...generated,
    },
  });
}
