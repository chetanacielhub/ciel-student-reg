/**
 * Ingestion Script: Seeds CIEL Knowledge Chunks & Embeddings into Supabase pgvector.
 *
 * Usage:
 *   npx tsx scripts/ingest-knowledge.ts
 */

import fs from "node:fs";
import path from "node:path";

// Load .env manually if not already loaded
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...rest] = trimmed.split("=");
        const val = rest.join("=").replace(/^["']|["']$/g, "");
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = val.trim();
        }
      }
    }
  }
} catch {
  // Ignore env read error
}


import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CIEL_SEED_KNOWLEDGE } from "../lib/knowledge/seed-data";

const EMBEDDING_MODEL = "text-embedding-004";

async function main() {
  console.log("==================================================");
  console.log("  CIEL AI Knowledge Base Ingestion Script");
  console.log("==================================================");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env."
    );
    process.exit(1);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.warn(
      "⚠️ Warning: GEMINI_API_KEY is not set in .env. Real vector embeddings cannot be generated without it."
    );
    console.warn(
      "   Please add GEMINI_API_KEY to your .env file to enable live Google embeddings.\n"
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
  const embeddingModel = genAI ? genAI.getGenerativeModel({ model: EMBEDDING_MODEL }) : null;

  console.log(`📚 Preparing to index ${CIEL_SEED_KNOWLEDGE.length} knowledge chunks...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < CIEL_SEED_KNOWLEDGE.length; i++) {
    const chunk = CIEL_SEED_KNOWLEDGE[i];
    console.log(`[${i + 1}/${CIEL_SEED_KNOWLEDGE.length}] Processing: "${chunk.sourceTitle}" (${chunk.category})...`);

    let embedding: number[] | null = null;

    if (embeddingModel) {
      try {
        const textToEmbed = `${chunk.sourceTitle}\n${chunk.content}`;
        const res = await embeddingModel.embedContent(textToEmbed);
        embedding = res.embedding.values;
      } catch (err) {
        console.warn(`  ⚠️ Failed to generate embedding for chunk ${chunk.id}:`, err);
      }
    }

    try {
      const payload: Record<string, unknown> = {
        source_title: chunk.sourceTitle,
        source_type: chunk.sourceType,
        source_url: chunk.sourceUrl || null,
        page_number: chunk.pageNumber || null,
        content: chunk.content,
        metadata: {
          category: chunk.category,
          keywords: chunk.keywords,
          chunk_id: chunk.id,
        },
      };

      if (embedding) {
        payload.embedding = embedding;
      }

      const { error } = await supabase
        .from("ciel_knowledge_chunks")
        .insert(payload);

      if (error) {
        console.error(`  ❌ Database insert error for "${chunk.sourceTitle}":`, error.message);
        failCount++;
      } else {
        console.log(`  ✅ Successfully indexed: "${chunk.sourceTitle}"`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Unexpected error during insert:`, err);
      failCount++;
    }
  }

  console.log("\n==================================================");
  console.log(`✨ Ingestion complete!`);
  console.log(`   Indexed: ${successCount}`);
  console.log(`   Failed:  ${failCount}`);
  console.log("==================================================");

  if (failCount > 0 && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(
      "\n💡 Tip: If inserts failed due to RLS, please ensure SUPABASE_SERVICE_ROLE_KEY is set in your .env,"
    );
    console.log(
      "   and that the migration 'supabase/migrations/0002_ciel_knowledge_base.sql' has been applied."
    );
  }
}

main().catch(console.error);
