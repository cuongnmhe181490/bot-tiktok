import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { createProduct } from "@/features/research/products/service";
import { productSchema } from "@/features/research/products/schema";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { rows?: unknown[] };
    const rows = payload.rows ?? [];
    const created = [];

    for (const row of rows) {
      const parsed = productSchema.parse(row);
      created.push(await createProduct(parsed));
    }

    revalidatePath("/dashboard");
    revalidatePath("/research/products");

    return apiSuccess(created, `Đã import ${created.length} sản phẩm.`);
  } catch (error) {
    return apiError(error);
  }
}
