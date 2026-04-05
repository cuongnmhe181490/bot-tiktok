import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { videoPerformanceSchema } from "@/features/analytics/schema";
import { createVideoPerformance } from "@/features/analytics/service";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { rows?: unknown[] };
    const rows = payload.rows ?? [];

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("Chưa có dòng dữ liệu nào để import.");
    }

    const created = [];

    for (const row of rows) {
      const parsed = videoPerformanceSchema.parse(row);
      created.push(await createVideoPerformance(parsed));
    }

    revalidatePath("/analytics");
    revalidatePath("/analytics/videos");
    revalidatePath("/reports");

    return apiSuccess(created, `Đã import ${created.length} bản ghi analytics.`);
  } catch (error) {
    return apiError(error);
  }
}
