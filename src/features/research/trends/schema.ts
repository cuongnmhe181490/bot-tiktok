import { TrendType } from "@prisma/client";
import { z } from "zod";
import {
  boundedNumber,
  optionalText,
  safeDate,
  strictUrl,
  trimmedText,
} from "@/lib/validation";

export const trendSchema = z.object({
  name: trimmedText("Tên trend", 3, 120),
  trendType: z.nativeEnum(TrendType, {
    message: "Loại trend không hợp lệ.",
  }),
  description: trimmedText("Mô tả", 10, 400, true),
  suitableNiche: trimmedText("Niche phù hợp", 3, 140),
  referenceUrl: strictUrl("Link tham khảo").optional().or(z.literal("")),
  heatLevel: boundedNumber("Độ nóng", 0, 10, false),
  applicability: boundedNumber("Độ dễ áp dụng", 0, 10, false),
  saturationLevel: boundedNumber("Độ bão hòa", 0, 10, false),
  discoveredAt: safeDate("Ngày phát hiện"),
  note: optionalText("Ghi chú", 500, true),
});

export type TrendInput = z.infer<typeof trendSchema>;
