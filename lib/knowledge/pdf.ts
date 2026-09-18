import type { KnowledgeChunk } from "./seed-data";

export interface PDFPageContent {
  pageNumber: number;
  text: string;
}

/**
 * Splits extracted PDF text pages into citation-ready knowledge chunks.
 * Retains page number information for citations such as "CIEL Brochure · Page 4".
 */
export function chunkPDFPages(options: {
  title: string;
  sourceUrl?: string;
  pages: PDFPageContent[];
  category?: string;
  chunkSize?: number;
}): KnowledgeChunk[] {
  const {
    title,
    sourceUrl,
    pages,
    category = "pdf",
    chunkSize = 650,
  } = options;

  const chunks: KnowledgeChunk[] = [];

  for (const page of pages) {
    const clean = page.text.replace(/\s+/g, " ").trim();
    if (!clean) continue;

    if (clean.length <= chunkSize) {
      chunks.push({
        id: `pdf-${encodeURIComponent(title).slice(0, 15)}-p${page.pageNumber}-0`,
        sourceTitle: title,
        sourceType: "pdf",
        sourceUrl,
        pageNumber: page.pageNumber,
        category,
        content: clean,
        keywords: extractKeywords(clean),
      });
      continue;
    }

    let start = 0;
    let partIdx = 0;
    while (start < clean.length) {
      let end = start + chunkSize;
      if (end < clean.length) {
        const lastSpace = clean.lastIndexOf(" ", end);
        if (lastSpace > start) end = lastSpace;
      }

      const chunkText = clean.substring(start, end).trim();
      if (chunkText.length > 50) {
        chunks.push({
          id: `pdf-${encodeURIComponent(title).slice(0, 15)}-p${page.pageNumber}-${partIdx}`,
          sourceTitle: title,
          sourceType: "pdf",
          sourceUrl,
          pageNumber: page.pageNumber,
          category,
          content: chunkText,
          keywords: extractKeywords(chunkText),
        });
        partIdx++;
      }

      start = end - 80; // 80 char overlap
      if (start >= clean.length) break;
    }
  }

  return chunks;
}

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
