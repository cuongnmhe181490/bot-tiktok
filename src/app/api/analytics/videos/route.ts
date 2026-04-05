import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { videoPerformanceSchema } from "@/features/analytics/schema";
import { createVideoPerformance } from "@/features/analytics/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = videoPerformanceSchema.parse(payload);
    const video = await createVideoPerformance(parsed);

    revalidatePath("/analytics");
    revalidatePath("/analytics/videos");
    revalidatePath("/reports");

    return apiSuccess(video, "Đã lưu bản ghi hiệu suất.");
  } catch (error) {
    return apiError(error);
  }
}
