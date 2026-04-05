import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { trendSchema } from "@/features/research/trends/schema";
import { createTrend, detectTrendDuplicates } from "@/features/research/trends/service";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { rows?: unknown[] };
    const rows = payload.rows ?? [];

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("Chưa có dòng dữ liệu nào để import.");
    }

    const parsedRows = rows.map((row) => trendSchema.parse(row));
    const duplicateCheck = await detectTrendDuplicates(parsedRows.map((row) => row.name));

    const created = [];
    const skipped = [];

    for (let index = 0; index < parsedRows.length; index += 1) {
      const item = parsedRows[index]!;
      const duplicate = duplicateCheck[index];

      if (duplicate?.duplicate) {
        skipped.push({
          name: item.name,
          reason: "Có khả năng trùng với trend đã có trong hệ thống.",
        });
        continue;
      }

      created.push(await createTrend(item));
    }

    revalidatePath("/dashboard");
    revalidatePath("/research/trends");

    return apiSuccess(
      {
        created,
        skipped,
        summary: {
          valid: parsedRows.length,
          created: created.length,
          skipped: skipped.length,
        },
      },
      `Đã import ${created.length} trend. ${skipped.length > 0 ? `${skipped.length} trend được giữ lại để tránh trùng.` : ""}`.trim(),
    );
  } catch (error) {
    return apiError(error);
  }
}
