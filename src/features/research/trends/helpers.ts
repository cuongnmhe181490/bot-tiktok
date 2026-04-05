import { ConfidenceLevel, SourceType, VerificationStatus } from "@prisma/client";
import { sanitizePlainText, slugify } from "@/lib/sanitize";

export function normalizeTrendName(value: string) {
  return slugify(sanitizePlainText(value)).replaceAll("-", " ");
}

export function isLikelyDuplicateTrend(name: string, existingNames: string[]) {
  const normalized = normalizeTrendName(name);
  return existingNames.some((item) => {
    const current = normalizeTrendName(item);
    return current === normalized || current.includes(normalized) || normalized.includes(current);
  });
}

export function getTrendActionLabel(heatLevel: number, saturationLevel: number, confidenceLevel?: ConfidenceLevel) {
  if (saturationLevel >= 8) return "Đã bão hòa";
  if (heatLevel >= 8 && confidenceLevel === ConfidenceLevel.HIGH) return "Nên thử ngay";
  if (confidenceLevel === ConfidenceLevel.LOW) return "Cần đối chiếu thêm";
  return "Nên theo dõi";
}

export function inferTrendConfidence(input: {
  sourceType: SourceType;
  externalReferenceUrl?: string | null | undefined;
  collectedAt?: Date | null | undefined;
  isDemo?: boolean | undefined;
}) {
  if (input.isDemo || input.sourceType === SourceType.SYSTEM_DEMO) return ConfidenceLevel.MEDIUM;
  if (input.externalReferenceUrl && input.collectedAt) return ConfidenceLevel.HIGH;
  if (input.sourceType === SourceType.MANUAL) return ConfidenceLevel.LOW;
  return ConfidenceLevel.MEDIUM;
}

export function inferVerificationStatus(input: {
  isDemo?: boolean;
  lastVerifiedAt?: Date | null;
}) {
  if (input.isDemo) return VerificationStatus.DU_LIEU_DEMO;
  if (input.lastVerifiedAt) return VerificationStatus.DA_DOI_CHIEU;
  return VerificationStatus.CHUA_XAC_MINH;
}
