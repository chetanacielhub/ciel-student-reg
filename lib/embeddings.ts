import { getGeminiApiKey } from "./gemini";

export const EMBEDDING_DIMENSIONS = 768;

/**
 * Returns a 768-dimensional embedding vector for the provided text using Google Generative Language API.
 * Uses gemini-embedding-001 with outputDimensionality=768.
 * If GEMINI_API_KEY is not configured or in offline mode, returns a deterministic normalized vector
 * so that tests and local development never crash.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return generateDeterministicFallbackVector(text, EMBEDDING_DIMENSIONS);
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] },
          outputDimensionality: EMBEDDING_DIMENSIONS,
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.embedding?.values) {
        return data.embedding.values;
      }
    }
    console.warn("Embedding API non-200, falling back to heuristic vector:", res.status);
    return generateDeterministicFallbackVector(text, EMBEDDING_DIMENSIONS);
  } catch (error) {
    console.warn("Gemini embedding API call failed, falling back to heuristic vector:", error);
    return generateDeterministicFallbackVector(text, EMBEDDING_DIMENSIONS);
  }
}

/**
 * Generates embeddings in batch.
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    const emb = await generateEmbedding(text);
    embeddings.push(emb);
  }
  return embeddings;
}

/**
 * Computes cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Deterministic pseudo-embedding for local offline fallback.
 */
function generateDeterministicFallbackVector(text: string, dimensions: number): number[] {
  const clean = text.toLowerCase();
  const vector = new Array(dimensions).fill(0);

  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const idx = (code * 31 + i * 17) % dimensions;
    vector[idx] += 1 / (1 + (i % 7));
  }

  // Normalize
  const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0)) || 1;
  return vector.map((v) => v / norm);
}
