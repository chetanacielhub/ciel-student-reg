-- ============================================================================
-- CIEL KNOWLEDGE BASE (pgvector + Embeddings for RAG)
-- Migration: 0002_ciel_knowledge_base.sql
-- ============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Knowledge chunks table
CREATE TABLE IF NOT EXISTS public.ciel_knowledge_chunks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_title  TEXT NOT NULL,                           -- e.g. "CIEL Website", "CIEL Incubation Handbook", "CIEL Brochure"
  source_type   TEXT NOT NULL DEFAULT 'website',         -- 'website', 'pdf', 'policy', 'charter', 'faq'
  source_url    TEXT,                                    -- URL or relative path e.g. "https://www.cielhub.org/incubation"
  page_number   INTEGER,                                 -- Nullable, page number in PDF e.g. 4
  content       TEXT NOT NULL,                           -- Raw chunk text for context injection
  metadata      JSONB DEFAULT '{}'::jsonb,               -- Additional attributes (section, category, author)
  embedding     VECTOR(768),                             -- 768 dimensions for Gemini text-embedding-004
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HNSW vector index for high-performance cosine similarity queries
CREATE INDEX IF NOT EXISTS ciel_knowledge_chunks_embedding_idx
  ON public.ciel_knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);

-- Index on source title & type for filtering
CREATE INDEX IF NOT EXISTS ciel_knowledge_chunks_source_idx
  ON public.ciel_knowledge_chunks (source_type, source_title);

-- 4. Vector matching RPC function
CREATE OR REPLACE FUNCTION public.match_ciel_knowledge (
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.30,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  source_title TEXT,
  source_type TEXT,
  source_url TEXT,
  page_number INTEGER,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.source_title,
    k.source_type,
    k.source_url,
    k.page_number,
    k.content,
    k.metadata,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM public.ciel_knowledge_chunks k
  WHERE k.embedding IS NOT NULL
    AND 1 - (k.embedding <=> query_embedding) >= match_threshold
  ORDER BY k.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- 5. Row Level Security (RLS)
ALTER TABLE public.ciel_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public, authenticated, service_role) to read knowledge chunks for AI answering
DROP POLICY IF EXISTS "Public read access to ciel_knowledge_chunks" ON public.ciel_knowledge_chunks;
CREATE POLICY "Public read access to ciel_knowledge_chunks"
  ON public.ciel_knowledge_chunks
  FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

-- Allow service_role to manage (insert, update, delete) knowledge chunks
DROP POLICY IF EXISTS "Service role management of ciel_knowledge_chunks" ON public.ciel_knowledge_chunks;
CREATE POLICY "Service role management of ciel_knowledge_chunks"
  ON public.ciel_knowledge_chunks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
