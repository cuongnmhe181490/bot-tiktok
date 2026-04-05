import Papa from "papaparse";
import { listProducts } from "@/features/research/products/service";

export async function GET() {
  const products = await listProducts();
  const csv = Papa.unparse(
    products.map((item) => ({
      name: item.name,
      slug: item.slug,
      productUrl: item.productUrl,
      source: item.source,
      category: item.category,
      salePrice: item.salePrice,
      commissionPercent: item.commissionPercent,
      rating: item.rating,
      score: item.totalScore,
      status: item.status,
    })),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products-export.csv"',
    },
  });
}
