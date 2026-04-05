import { getDb } from "@/server/db";
import { demoDraftProjects } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import { buildDraftPackage } from "@/features/drafts/helpers";
import type { DraftProjectInput } from "@/features/drafts/schema";

export async function listDraftProjects() {
  return readOrDemo(
    () =>
      getDb().draftProject.findMany({
        orderBy: { updatedAt: "desc" },
      }),
    () => [...demoDraftProjects].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
  );
}

export async function getDraftProjectById(id: string) {
  return readOrDemo(
    () =>
      getDb().draftProject.findUnique({
        where: { id },
      }),
    () => demoDraftProjects.find((item) => item.id === id) ?? null,
  );
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
