import { TrendType } from "@prisma/client";
import { z } from "zod";
import {
  boundedNumber,
  optionalText,
  safeDate,
  trimmedText,
} from "@/lib/validation";
import { provenanceSchema } from "@/lib/provenance";

export const trendSchema = provenanceSchema.extend({
  name: trimmedText("Tên trend", 3, 120),
  trendType: z.nativeEnum(TrendType, {
    message: "Loại trend không hợp lệ.",
  }),
  description: trimmedText("Mô tả", 10, 400, true),
  suitableNiche: trimmedText("Niche phù hợp", 3, 140),
  region: optionalText("Khu vực", 80),
  timeWindow: optionalText("Khung thời gian", 80),
  trendScore: boundedNumber("Trend score", 0, 100, false).optional(),
  heatLevel: boundedNumber("Độ nóng", 0, 10, false),
  applicability: boundedNumber("Độ dễ áp dụng", 0, 10, false),
  saturationLevel: boundedNumber("Độ bão hòa", 0, 10, false),
  discoveredAt: safeDate("Ngày phát hiện"),
  note: optionalText("Ghi chú", 500, true),
});

export type TrendInput = z.infer<typeof trendSchema>;
