/**
 * Shared string & HTML utilities (DRY – Don't Repeat Yourself).
 *
 * Consolidates every text-processing helper that was previously scattered
 * across `contents.ts`, `clean-html.js`, and page components.
 */

// ---------------------------------------------------------------------------
// HTML / text normalisation
// ---------------------------------------------------------------------------

/** Strip all HTML tags and decode common HTML entities → plain text. */
export function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const FALLBACK_SUMMARY = "Kho tri thức công nghệ được biên soạn chuyên sâu.";

/** Shorten *plain* text to `maxLength` characters. */
export function shortenText(raw: string, maxLength = 170): string {
  const text = stripHtml(raw);
  if (!text) return FALLBACK_SUMMARY;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

/** Convert a heading string to a URL-safe slug (strips Vietnamese diacritics). */
export function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

/** Ensure `baseId` is unique within `usedIds` by appending a counter. */
export function withUniqueId(baseId: string, usedIds: Map<string, number>): string {
  const key = baseId || "section";
  const count = usedIds.get(key) ?? 0;
  usedIds.set(key, count + 1);
  return count === 0 ? key : `${key}-${count + 1}`;
}

// ---------------------------------------------------------------------------
// Date / number formatting
// ---------------------------------------------------------------------------

/** Format an ISO date string to `dd/MM/yyyy` in Vietnamese locale. */
export function formatDateVi(dateValue?: string, fallback = "Chưa cập nhật"): string {
  if (!dateValue) return fallback;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Format a number with Vietnamese thousands separators. */
export function formatNumberVi(value?: number): string {
  return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

// ---------------------------------------------------------------------------
// Reading time
// ---------------------------------------------------------------------------

/** Estimate reading time in minutes from an HTML string (~220 words/min). */
export function readingTimeInMinutes(html: string): number {
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return 1;
  const wordCount = plainText.split(" ").length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

// ---------------------------------------------------------------------------
// HTML extraction helpers (used during build + runtime)
// ---------------------------------------------------------------------------

/** Extract `<body>` inner HTML, then narrow to `<main>` if present. */
export function extractPrimaryHtmlContent(rawHtml: string): string {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

  const mainMatch = bodyContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = mainMatch ? mainMatch[1] : bodyContent;

  content = content.replace(/<header[\s\S]*?<\/header>/gi, "");
  content = content.replace(/<aside[\s\S]*?<\/aside>/gi, "");

  return content;
}

/** Try to extract a short description from HTML: meta → first <p> → body. */
export function extractSummaryFromHtml(rawHtml: string): string {
  const metaDescription = rawHtml.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i,
  )?.[1];
  if (metaDescription) return shortenText(metaDescription);

  const firstParagraph = rawHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  if (firstParagraph) return shortenText(firstParagraph);

  const bodyContent = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? rawHtml;
  return shortenText(bodyContent);
}

/** Extract a short summary from raw Markdown content. */
export function extractSummaryFromMarkdown(mdContent: string): string {
  const paragraphs = mdContent
    .split(/\n{2,}/)
    .map((section) =>
      section
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/^#+\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_~]/g, " "),
    )
    .map((section) => stripHtml(section))
    .filter((section) => section.length > 20);

  return shortenText(paragraphs[0] ?? "");
}

/** Derive a human-readable title from a slug. */
export function titleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
