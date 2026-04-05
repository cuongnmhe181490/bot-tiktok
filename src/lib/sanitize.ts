import sanitizeHtml from "sanitize-html";

export function sanitizePlainText(input: unknown) {
  const raw = String(input ?? "");
  const cleaned = sanitizeHtml(raw, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return cleaned.replace(/\s+/g, " ").trim();
}

export function sanitizeMultilineText(input: unknown) {
  const raw = String(input ?? "");
  const cleaned = sanitizeHtml(raw, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return cleaned
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
}

export function slugify(input: string) {
  return sanitizePlainText(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isMeaningfulText(value: string) {
  if (!value.trim()) return false;

  const compact = value.replace(/\s/g, "");
  if (compact.length < 3) return false;
  if (/(.)\1{5,}/u.test(compact)) return false;

  const uniqueChars = new Set(compact.toLowerCase()).size;
  if (compact.length >= 8 && uniqueChars <= 2) return false;

  return /[\p{L}\p{N}]/u.test(compact);
}
