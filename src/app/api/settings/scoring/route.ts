import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { scoringSettingsSchema } from "@/features/settings/schema";
import { updateScoringSettings } from "@/features/settings/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = scoringSettingsSchema.parse(payload);
    const settings = await updateScoringSettings(parsed);

    revalidatePath("/dashboard");
    revalidatePath("/research/products");
    revalidatePath("/settings");

    return apiSuccess(settings, "Đã cập nhật trọng số scoring.");
  } catch (error) {
    return apiError(error);
  }
}
