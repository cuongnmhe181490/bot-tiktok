import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { scriptDraftSchema } from "@/features/scripts/schema";
import { createScriptDraft } from "@/features/scripts/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = scriptDraftSchema.parse(payload);
    const scriptDraft = await createScriptDraft(parsed);

    revalidatePath("/scripts");
    revalidatePath("/dashboard");

    return apiSuccess(scriptDraft, "Đã tạo bộ kịch bản mới.");
  } catch (error) {
    return apiError(error);
  }
}
