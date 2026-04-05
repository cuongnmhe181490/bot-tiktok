import { ProductStatus } from "@prisma/client";
import { z } from "zod";
import {
  boundedNumber,
  normalizedSlug,
  optionalText,
  safeDate,
  strictUrl,
  trimmedText,
} from "@/lib/validation";

export const productSchema = z.object({
  name: trimmedText("Tên sản phẩm", 3, 120),
  slug: normalizedSlug.optional(),
  productUrl: strictUrl("Link sản phẩm"),
  source: trimmedText("Nguồn", 2, 80),
  category: trimmedText("Ngành hàng", 2, 80),
  originalPrice: boundedNumber("Giá gốc", 0, 999_999_999),
  salePrice: boundedNumber("Giá sale", 0, 999_999_999),
  discountPercent: boundedNumber("Phần trăm giảm giá", 0, 100, false),
  commissionPercent: boundedNumber("Hoa hồng %", 0, 100),
  estimatedCommission: boundedNumber("Hoa hồng ước tính", 0, 999_999_999),
  rating: boundedNumber("Rating", 0, 5),
  reviewCount: boundedNumber("Số review", 0, 9_999_999, false),
  shopName: trimmedText("Tên shop", 2, 120),
  voucher: optionalText("Voucher", 120),
  freeship: z.boolean().default(false),
  importedAt: safeDate("Ngày nhập"),
  shortDescription: trimmedText("Mô tả ngắn", 10, 300, true),
  internalNote: optionalText("Note nội bộ", 1000, true),
  status: z.nativeEnum(ProductStatus, {
    message: "Trạng thái sản phẩm không hợp lệ.",
  }),
  easeOfFilming: boundedNumber("Độ dễ quay", 0, 10, false),
  competitionLevel: boundedNumber("Độ cạnh tranh", 0, 10, false),
  saturationLevel: boundedNumber("Độ bão hòa", 0, 10, false),
  offerAttractiveness: boundedNumber("Độ hấp dẫn offer", 0, 10, false),
});

export type ProductInput = z.infer<typeof productSchema>;
