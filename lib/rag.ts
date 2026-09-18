import { createAdminClient } from "./supabase/admin";
import { generateEmbedding } from "./embeddings";
import { CIEL_SEED_KNOWLEDGE, type KnowledgeChunk } from "./knowledge/seed-data";

export interface RetrievedChunk {
  id: string;
  sourceTitle: string;
  sourceType: string;
  sourceUrl?: string;
  pageNumber?: number;
  content: string;
  similarity: number;
}

export interface Citation {
  title: string;
  type: string;
  url?: string;
  page?: number;
  snippet?: string;
}

/**
 * Common conversational greetings or acknowledgments that should NOT trigger
 * a document retrieval.
 */
export function isConversationalQuery(query: string): boolean {
  const clean = query.trim().toLowerCase().replace(/[^\w\s]/g, "");
  const patterns = [
    /^(hi|hello|hey|heya|hiya|howdy)$/,
    /^(good\s+(morning|afternoon|evening|day))$/,
    /^(greetings|welcome)$/,
    /^(thanks|thank\s+you|thx|cheers|ok|okay|got\s+it)$/,
    /^(who\s+are\s+you|what\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|help)$/,
  ];
  return patterns.some((p) => p.test(clean));
}

/**
 * Searches the CIEL knowledge base using vector similarity via Supabase pgvector,
 * with automatic fallback to high-precision keyword/semantic retrieval on CIEL_SEED_KNOWLEDGE.
 */
export async function searchKnowledgeBase(
  query: string,
  options: { limit?: number; threshold?: number } = {}
): Promise<RetrievedChunk[]> {
  const limit = options.limit ?? 4;
  const threshold = options.threshold ?? 0.25;

  // 1. If it's just a greeting, do not search documents
  if (isConversationalQuery(query)) {
    return [];
  }

  // 2. Try Supabase pgvector RPC if table exists
  try {
    const queryEmbedding = await generateEmbedding(query);
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("match_ciel_knowledge", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((item: {
        id: string;
        source_title: string;
        source_type: string;
        source_url?: string;
        page_number?: number;
        content: string;
        similarity: number;
      }) => ({
        id: item.id,
        sourceTitle: item.source_title,
        sourceType: item.source_type,
        sourceUrl: item.source_url,
        pageNumber: item.page_number,
        content: item.content,
        similarity: item.similarity,
      }));
    }
  } catch {
    // Supabase table or function not initialized yet; fallback to seed retrieval
  }

  // 3. Fallback to high-precision seed knowledge search
  return searchSeedKnowledge(query, limit);
}

/**
 * High-precision keyword & term frequency search on seed knowledge.
 * Only returns chunks that actually contain or relate to query terms.
 */
function searchSeedKnowledge(
  query: string,
  limit: number
): RetrievedChunk[] {
  const qLower = query.toLowerCase();
  // Filter out stop words
  const stopWords = new Set([
    "what", "is", "the", "are", "do", "you", "provide", "can", "how", "for", "and", "a", "an",
    "in", "of", "to", "at", "by", "from", "with", "about", "tell", "me", "some", "any"
  ]);
  const terms = qLower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (terms.length === 0) {
    // If only stop words were queried and it wasn't a greeting, match general overview if "ciel" was mentioned
    if (qLower.includes("ciel")) {
      const overview = CIEL_SEED_KNOWLEDGE.find((c) => c.category === "overview");
      return overview ? [mapToRetrieved(overview, 0.9)] : [];
    }
    return [];
  }

  const scored = CIEL_SEED_KNOWLEDGE.map((chunk) => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.sourceTitle.toLowerCase();
    const categoryLower = chunk.category.toLowerCase();

    for (const term of terms) {
      // Direct category or title match
      if (categoryLower.includes(term)) score += 0.4;
      if (titleLower.includes(term)) score += 0.3;

      // Keyword match
      for (const kw of chunk.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === term) score += 0.5;
        else if (kwLower.includes(term) || term.includes(kwLower)) score += 0.3;
      }

      // Content match
      if (contentLower.includes(term)) {
        score += 0.15;
      }
    }

    return { chunk, score };
  });

  // Filter chunks with positive relevance and sort descending
  const relevant = scored
    .filter((item) => item.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return relevant.map(({ chunk, score }) => mapToRetrieved(chunk, Math.min(score, 0.99)));
}

function mapToRetrieved(chunk: KnowledgeChunk, similarity: number): RetrievedChunk {
  return {
    id: chunk.id,
    sourceTitle: chunk.sourceTitle,
    sourceType: chunk.sourceType,
    sourceUrl: chunk.sourceUrl,
    pageNumber: chunk.pageNumber,
    content: chunk.content,
    similarity,
  };
}

/**
 * Formats retrieved chunks into unique citations for UI presentation.
 */
export function extractCitations(chunks: RetrievedChunk[]): Citation[] {
  const map = new Map<string, Citation>();

  for (const chunk of chunks) {
    const key = `${chunk.sourceTitle}-${chunk.pageNumber || ""}`;
    if (!map.has(key)) {
      map.set(key, {
        title: chunk.sourceTitle,
        type: chunk.sourceType,
        url: chunk.sourceUrl,
        page: chunk.pageNumber,
        snippet: chunk.content.slice(0, 160) + (chunk.content.length > 160 ? "..." : ""),
      });
    }
  }

  return Array.from(map.values());
}
