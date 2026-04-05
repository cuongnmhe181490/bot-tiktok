import { getConfidenceLevelLabel, getSourceTypeLabel, getVerificationStatusLabel } from "@/lib/labels";

export function getSourceTone(sourceType: string, isDemo?: boolean) {
  if (isDemo || sourceType === "SYSTEM_DEMO") return "warning" as const;
  if (sourceType === "TIKTOK_CREATIVE_CENTER") return "info" as const;
  if (sourceType === "GOOGLE_TRENDS") return "success" as const;
  if (sourceType === "CSV_IMPORT") return "default" as const;
  if (sourceType === "INTERNAL_GENERATED") return "warning" as const;
  return "default" as const;
}

export function getConfidenceTone(level: string) {
  if (level === "HIGH") return "success" as const;
  if (level === "LOW") return "danger" as const;
  return "warning" as const;
}

export function getVerificationTone(status: string) {
  if (status === "DA_DOI_CHIEU") return "success" as const;
  if (status === "DU_LIEU_DEMO") return "warning" as const;
  return "default" as const;
}

export function buildProvenanceSummary(input: {
  source: string;
  sourceType: string;
  confidenceLevel: string;
  verificationStatus: string;
  isDemo?: boolean | undefined;
}) {
  return {
    sourceLabel: input.isDemo ? "Dữ liệu demo" : input.source || getSourceTypeLabel(input.sourceType),
    sourceTypeLabel: getSourceTypeLabel(input.sourceType),
    confidenceLabel: getConfidenceLevelLabel(input.confidenceLevel),
    verificationLabel: getVerificationStatusLabel(input.verificationStatus),
  };
}
