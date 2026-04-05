import { z } from "zod";
import {
  isMeaningfulText,
  sanitizeMultilineText,
  sanitizePlainText,
  slugify,
} from "@/lib/sanitize";

function meaningfulRefinement(message: string) {
  return (value: string) => isMeaningfulText(value) || message;
}

export const trimmedText = (
  label: string,
  min: number,
  max: number,
  multiline = false,
) =>
  z
    .string({ error: `${label} không hợp lệ.` })
    .transform((value) =>
      multiline ? sanitizeMultilineText(value) : sanitizePlainText(value),
    )
    .refine((value) => value.length > 0, `${label} không được để trống.`)
    .refine((value) => value.length >= min, `${label} phải có ít nhất ${min} ký tự.`)
    .refine((value) => value.length <= max, `${label} không được vượt quá ${max} ký tự.`)
    .refine(meaningfulRefinement(`${label} cần có nội dung rõ ràng hơn.`));

export const optionalText = (label: string, max: number, multiline = false) =>
  z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const sanitized = multiline
        ? sanitizeMultilineText(value)
        : sanitizePlainText(value);
      return sanitized.length === 0 ? undefined : sanitized;
    })
    .refine(
      (value) => !value || value.length <= max,
      `${label} không được vượt quá ${max} ký tự.`,
    )
    .refine(
      (value) => !value || isMeaningfulText(value),
      `${label} cần có nội dung rõ ràng hơn.`,
    );

export const normalizedSlug = z
  .string()
  .optional()
  .transform((value) => slugify(value ?? ""))
  .refine((value) => value.length <= 140, "Slug không được vượt quá 140 ký tự.");

export const strictUrl = (label: string) =>
  z
    .string({ error: `${label} không hợp lệ.` })
    .transform((value) => sanitizePlainText(value))
    .refine((value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    }, `${label} phải là đường dẫn hợp lệ, ví dụ https://example.com.`);

export const boundedNumber = (
  label: string,
  min: number,
  max: number,
  allowFloat = true,
) =>
  z.coerce
    .number({ error: `${label} phải là số hợp lệ.` })
    .refine((value) => Number.isFinite(value), `${label} phải là số hợp lệ.`)
    .refine((value) => value >= min, `${label} phải lớn hơn hoặc bằng ${min}.`)
    .refine((value) => value <= max, `${label} phải nhỏ hơn hoặc bằng ${max}.`)
    .refine(
      (value) => allowFloat || Number.isInteger(value),
      `${label} phải là số nguyên.`,
    );

export const safeDate = (label: string) =>
  z.coerce
    .date({ error: `${label} không đúng định dạng ngày.` })
    .refine((value) => !Number.isNaN(value.getTime()), `${label} không hợp lệ.`);
