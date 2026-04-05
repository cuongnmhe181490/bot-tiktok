import { z } from "zod";
import { boundedNumber } from "@/lib/validation";

export const scoringSettingsSchema = z.object({
  easeWeight: boundedNumber("Trọng số độ dễ quay", 1, 100, false),
  competitionWeight: boundedNumber("Trọng số cạnh tranh", 1, 100, false),
  saturationWeight: boundedNumber("Trọng số bão hòa", 1, 100, false),
  offerWeight: boundedNumber("Trọng số offer", 1, 100, false),
  commissionWeight: boundedNumber("Trọng số hoa hồng", 1, 100, false),
});

export type ScoringSettingsInput = z.infer<typeof scoringSettingsSchema>;

export const dataSettingsSchema = z.object({
  freeOnlyMode: z.boolean().refine((value) => value === true, {
    message: "Hệ thống hiện chỉ hỗ trợ chế độ dữ liệu free-only.",
  }),
  showDemoData: z.boolean(),
});

export type DataSettingsInput = z.infer<typeof dataSettingsSchema>;
