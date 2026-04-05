import { z } from "zod";
import { trimmedText } from "@/lib/validation";

export const draftProjectSchema = z.object({
  title: trimmedText("Tên dự án", 3, 120),
  productName: trimmedText("Tên sản phẩm", 3, 120),
  rawScript: trimmedText("Raw script", 20, 3000, true),
});

export type DraftProjectInput = z.infer<typeof draftProjectSchema>;
