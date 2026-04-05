import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { draftProjectSchema } from "@/features/drafts/schema";
import { createDraftProject } from "@/features/drafts/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = draftProjectSchema.parse(payload);
    const draftProject = await createDraftProject(parsed);

    revalidatePath("/drafts");
    revalidatePath("/dashboard");

    return apiSuccess(draftProject, "Đã tạo bundle video nháp.");
  } catch (error) {
    return apiError(error);
  }
}
