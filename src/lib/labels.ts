import {
  confidenceLevelOptions,
  goalOptions,
  productStatusOptions,
  sourceTypeOptions,
  toneOptions,
  trendTypeOptions,
  verificationStatusOptions,
  videoStatusOptions,
} from "@/config/domain";

function lookupLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
  fallback?: string,
) {
  if (!value) return fallback ?? "";
  return options.find((item) => item.value === value)?.label ?? fallback ?? value;
}

export function getProductStatusLabel(value: string) {
  return lookupLabel(productStatusOptions, value, value.replaceAll("_", " "));
}

export function getVideoStatusLabel(value: string) {
  return lookupLabel(videoStatusOptions, value, value.replaceAll("_", " "));
}

export function getToneLabel(value: string) {
  return lookupLabel(toneOptions, value, value.replaceAll("_", " "));
}

export function getGoalLabel(value: string) {
  return lookupLabel(goalOptions, value, value.replaceAll("_", " "));
}

export function getTrendTypeLabel(value: string) {
  return lookupLabel(trendTypeOptions, value, value.replaceAll("_", " "));
}

export function getSourceTypeLabel(value: string) {
  return lookupLabel(sourceTypeOptions, value, value.replaceAll("_", " "));
}

export function getConfidenceLevelLabel(value: string) {
  return lookupLabel(confidenceLevelOptions, value, value.replaceAll("_", " "));
}

export function getVerificationStatusLabel(value: string) {
  return lookupLabel(verificationStatusOptions, value, value.replaceAll("_", " "));
}
