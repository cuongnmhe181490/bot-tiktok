import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { dataSettingsSchema } from "@/features/settings/schema";
import { updateDataSettings } from "@/features/settings/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = dataSettingsSchema.parse(payload);
    const updated = await updateDataSettings(parsed);

    revalidatePath("/settings");
    revalidatePath("/research/products");
    revalidatePath("/research/trends");
    revalidatePath("/analytics");

    return apiSuccess(updated, "Đã cập nhật cấu hình dữ liệu.");
  } catch (error) {
    return apiError(error);
  }
}
