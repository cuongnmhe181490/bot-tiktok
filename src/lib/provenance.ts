import { ConfidenceLevel, SourceType, VerificationStatus } from "@prisma/client";
import { z } from "zod";
import { optionalText, optionalUrl, safeDate, trimmedText } from "@/lib/validation";

export const provenanceSchema = z.object({
  source: trimmedText("Nguồn dữ liệu", 2, 120),
  sourceType: z.nativeEnum(SourceType, {
    message: "Loại nguồn dữ liệu không hợp lệ.",
  }),
  collectedAt: safeDate("Lần thu thập").optional(),
  importedAt: safeDate("Lần nhập hệ thống"),
  lastVerifiedAt: safeDate("Lần xác minh gần nhất").optional(),
  confidenceLevel: z.nativeEnum(ConfidenceLevel, {
    message: "Mức độ tin cậy không hợp lệ.",
  }),
  verificationStatus: z.nativeEnum(VerificationStatus, {
    message: "Trạng thái xác minh không hợp lệ.",
  }),
  externalReferenceUrl: optionalUrl("Liên kết tham chiếu"),
  notes: optionalText("Ghi chú dữ liệu", 400, true),
});

export type ProvenanceInput = z.infer<typeof provenanceSchema>;

export function normalizeVerificationStatus(input: ProvenanceInput) {
  if (input.sourceType === SourceType.SYSTEM_DEMO) {
    return VerificationStatus.DU_LIEU_DEMO;
  }

  if (input.lastVerifiedAt) {
    return VerificationStatus.DA_DOI_CHIEU;
  }

  return input.verificationStatus;
}

export function deriveConfidenceLevel(input: {
  sourceType: SourceType;
  externalReferenceUrl?: string | undefined;
  collectedAt?: Date | undefined;
}) {
  if (input.sourceType === SourceType.SYSTEM_DEMO) return ConfidenceLevel.MEDIUM;
  if (input.externalReferenceUrl && input.collectedAt) return ConfidenceLevel.HIGH;
  if (input.sourceType === SourceType.MANUAL) return ConfidenceLevel.LOW;
  return ConfidenceLevel.MEDIUM;
}
