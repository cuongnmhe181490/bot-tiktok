import { GoalType, ToneType } from "@prisma/client";
import { z } from "zod";
import { boundedNumber, optionalText, trimmedText } from "@/lib/validation";

export const scriptDraftSchema = z.object({
  title: trimmedText("Tên bộ kịch bản", 3, 120),
  productId: trimmedText("Sản phẩm", 3, 80),
  audience: trimmedText("Đối tượng khách hàng", 3, 140),
  painPoints: trimmedText("Pain points", 10, 400, true),
  strengths: trimmedText("Điểm mạnh", 10, 400, true),
  notes: optionalText("Lưu ý", 500, true),
  tone: z.nativeEnum(ToneType, { message: "Tone không hợp lệ." }),
  goal: z.nativeEnum(GoalType, { message: "Mục tiêu video không hợp lệ." }),
  durationSeconds: boundedNumber("Độ dài video", 15, 180, false),
  templateId: z.string().optional(),
});

export type ScriptDraftInput = z.infer<typeof scriptDraftSchema>;
