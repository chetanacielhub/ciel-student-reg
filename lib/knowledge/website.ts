import type { KnowledgeChunk } from "./seed-data";

/**
 * Normalizes and splits website content into clean, semantic knowledge chunks.
 */
export function chunkWebsiteContent(options: {
  title: string;
  url: string;
  content: string;
  category?: string;
  chunkSize?: number;
  overlap?: number;
}): KnowledgeChunk[] {
  const {
    title,
    url,
    content,
    category = "website",
    chunkSize = 600,
    overlap = 100,
  } = options;

  // Clean raw HTML or markdown whitespace
  const clean = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= chunkSize) {
    return [
      {
        id: `web-${encodeURIComponent(title).slice(0, 20)}-0`,
        sourceTitle: title,
        sourceType: "website",
        sourceUrl: url,
        content: clean,
        category,
        keywords: extractKeywords(clean),
      },
    ];
  }

  const chunks: KnowledgeChunk[] = [];
  let start = 0;
  let chunkIdx = 0;

  while (start < clean.length) {
    let end = start + chunkSize;
    if (end < clean.length) {
      // Avoid splitting words: find last space before end
      const lastSpace = clean.lastIndexOf(" ", end);
      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    const chunkText = clean.substring(start, end).trim();
    if (chunkText.length > 50) {
      chunks.push({
        id: `web-${encodeURIComponent(title).slice(0, 20)}-${chunkIdx}`,
        sourceTitle: title,
        sourceType: "website",
        sourceUrl: url,
        content: chunkText,
        category,
        keywords: extractKeywords(chunkText),
      });
      chunkIdx++;
    }

    start = end - overlap;
    if (start >= clean.length) break;
  }

  return chunks;
}

/**
 * Extracts basic high-frequency keywords for quick heuristic filtering.
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const stopWords = new Set([
    "this", "that", "with", "from", "have", "more", "also", "their", "which",
    "will", "they", "about", "there", "other", "into", "been", "through", "after",
  ]);

  const unique = Array.from(new Set(words.filter((w) => !stopWords.has(w))));
  return unique.slice(0, 10);
}
