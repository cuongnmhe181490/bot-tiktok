import { getDb } from "@/server/db";
import { demoProducts, demoScriptDrafts, demoScriptTemplates } from "@/server/demo-data";
import { readOrDemo } from "@/server/read-or-demo";
import { generateScriptPackage } from "@/features/scripts/helpers";
import type { ScriptDraftInput } from "@/features/scripts/schema";

export async function listScriptDrafts() {
  return readOrDemo(
    () =>
      getDb().scriptDraft.findMany({
        include: {
          product: true,
          template: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    () =>
      demoScriptDrafts.map((item) => ({
        ...item,
        product: demoProducts.find((product) => product.id === item.productId)!,
        template: demoScriptTemplates.find((template) => template.id === item.templateId) ?? null,
      })),
  );
}

export async function getScriptDraftById(id: string) {
  return readOrDemo(
    () =>
      getDb().scriptDraft.findUnique({
        where: { id },
        include: {
          product: true,
          template: true,
        },
      }),
    () => {
      const script = demoScriptDrafts.find((item) => item.id === id);
      if (!script) return null;
      return {
        ...script,
        product: demoProducts.find((product) => product.id === script.productId)!,
        template: demoScriptTemplates.find((template) => template.id === script.templateId) ?? null,
      };
    },
  );
}

export async function listScriptTemplates() {
  return readOrDemo(
    () =>
      getDb().scriptTemplate.findMany({
        orderBy: { name: "asc" },
      }),
    () => [...demoScriptTemplates],
  );
}

export async function createScriptDraft(input: ScriptDraftInput) {
  const product = await getDb().product.findUnique({
    where: { id: input.productId },
  });

  if (!product) {
    throw new Error("Không tìm thấy sản phẩm để tạo kịch bản.");
  }

  const generated = generateScriptPackage({
    productName: product.name,
    customerPersona: input.audience,
    painPoints: input.painPoints,
    strengths: input.strengths,
    notes: input.notes,
    tone: input.tone,
    goal: input.goal,
    durationSeconds: input.durationSeconds,
  });

  return getDb().scriptDraft.create({
    data: {
      title: input.title,
      audience: input.audience,
      painPoints: input.painPoints,
      strengths: input.strengths,
      notes: input.notes ?? null,
      tone: input.tone,
      goal: input.goal,
      durationSeconds: input.durationSeconds,
      productId: input.productId,
      templateId: input.templateId || null,
      hooks: generated.hooks,
      angles: generated.angles,
      voiceOvers: generated.voiceOvers,
      shotLists: generated.shotLists,
      captions: generated.captions,
      ctas: generated.ctas,
      teleprompter: generated.teleprompter,
      subtitleReady: generated.subtitleReady,
      safetyCheck: generated.safetyCheck,
      bestVersion: false,
    },
  });
}
