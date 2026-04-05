import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { trendSchema } from "@/features/research/trends/schema";
import { createTrend } from "@/features/research/trends/service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = trendSchema.parse(payload);
    const trend = await createTrend(parsed);

    revalidatePath("/dashboard");
    revalidatePath("/research/trends");

    return apiSuccess(trend, "Đã thêm trend mới.");
  } catch (error) {
    return apiError(error);
  }
}
