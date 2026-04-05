import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { createProduct } from "@/features/research/products/service";
import { productSchema } from "@/features/research/products/schema";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = productSchema.parse(payload);
    const product = await createProduct(parsed);

    revalidatePath("/dashboard");
    revalidatePath("/research/products");

    return apiSuccess(product, "Đã thêm sản phẩm mới.");
  } catch (error) {
    return apiError(error);
  }
}
