import { TagChip } from "@/components/tag-chip";
import {
  buildProvenanceSummary,
  getConfidenceTone,
  getSourceTone,
  getVerificationTone,
} from "@/lib/data-trust";

type DataTrustBadgesProps = {
  source: string;
  sourceType: string;
  confidenceLevel: string;
  verificationStatus: string;
  isDemo?: boolean | undefined;
  internalSuggestion?: boolean | undefined;
};

export function DataTrustBadges({
  source,
  sourceType,
  confidenceLevel,
  verificationStatus,
  isDemo,
  internalSuggestion,
}: DataTrustBadgesProps) {
  const summary = buildProvenanceSummary({
    source,
    sourceType,
    confidenceLevel,
    verificationStatus,
    isDemo,
  });

  return (
    <div className="flex flex-wrap gap-2">
      {internalSuggestion ? <TagChip tone="warning">Gợi ý nội bộ</TagChip> : null}
      {isDemo ? <TagChip tone="warning">Demo</TagChip> : null}
      <TagChip tone={getSourceTone(sourceType, isDemo)}>{summary.sourceTypeLabel}</TagChip>
      <TagChip tone={getVerificationTone(verificationStatus)}>{summary.verificationLabel}</TagChip>
      <TagChip tone={getConfidenceTone(confidenceLevel)}>{summary.confidenceLabel}</TagChip>
    </div>
  );
}
