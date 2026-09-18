import fs from "node:fs";
import path from "node:path";
import { isConversationalQuery, type RetrievedChunk } from "./rag";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PRIMARY_MODEL = "gemini-flash-lite-latest";
const FALLBACK_MODEL = "gemini-flash-latest";

/**
 * Ensures GEMINI_API_KEY is retrieved reliably, checking process.env first
 * and reading .env directly from disk if the environment hasn't reloaded.
 */
export function getGeminiApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [k, ...v] = trimmed.split("=");
          if (k.trim() === "GEMINI_API_KEY") {
            const key = v.join("=").replace(/^["']|["']$/g, "").trim();
            if (key) {
              process.env.GEMINI_API_KEY = key;
              return key;
            }
          }
        }
      }
    }
  } catch {
    // Ignore error
  }
  return undefined;
}

const SYSTEM_INSTRUCTION = `You are Ciela (pronounced "See-eh-la"), the official AI Assistant and Innovation Concierge for CIEL (Centre for Innovation & Entrepreneurship Learning) at Chetana's Institutes, Bandra East, Mumbai.

IDENTITY & CHARACTERISTICS:
- Name: Ciela
- Role: CIEL's AI Assistant & Innovation Guide
- Voice & Tone: Warm, inspiring, articulate, empathetic, and knowledgeable. You speak with high emotional intelligence, motivating student entrepreneurs and innovators while maintaining institutional elegance and precision.
- Self-Identification: In your greetings, refer to yourself naturally as "Ciela, CIEL's AI Assistant".

GROUNDING & DOMAIN RULES:
1. When CIEL KNOWLEDGE CONTEXT is provided, base your answers directly, factually, and thoroughly on that context.
2. If the user greets you (e.g. "Hello", "Hi", "Good morning") or asks who you are, introduce yourself warmly as Ciela and explain how you can assist them with incubation, seed support, accelerator cohorts, student startups, mentors, or council activities.
3. If the user asks an unrelated query (sports match scores, cricket, movies, recipes, general politics, celebrity gossip), politely decline in Ciela's signature voice:
"I am Ciela, CIEL's AI Assistant, dedicated to our innovation ecosystem, incubation facilities, entrepreneurship programs, and institutional documents. I do not have information on this topic in our knowledge base. Please feel free to ask me about CIEL's incubation support, seed funding, accelerator cohorts, student startups, or mentorship!"
4. Format your responses with exceptional readability using bold highlights, clean bullet points, and welcoming phrasing.`;

/**
 * Generates an answer from Gemini grounded strictly in the retrieved CIEL knowledge chunks.
 */
export async function generateChatResponse(params: {
  messages: ChatMessage[];
  contextChunks: RetrievedChunk[];
}): Promise<{
  content: string;
  isOutOfDomain: boolean;
}> {
  const { messages, contextChunks } = params;
  const apiKey = getGeminiApiKey();
  const latestMessage = messages[messages.length - 1]?.content || "";

  // 1. Handle Conversational Greetings (Hello, Hi, Good morning, etc.)
  if (isConversationalQuery(latestMessage)) {
    return {
      content:
        "Hello! 👋 I'm **Ciela**, CIEL's AI Assistant at the Centre for Innovation & Entrepreneurship Learning (Chetana Campus, Bandra East, Mumbai).\n\nI would love to help you explore our innovation ecosystem:\n- **Incubation & Prototyping Labs** (co-working, makerspace, seed grants up to ₹5–10L)\n- **Accelerator Cohorts & Student Startups** (Austrange, Hydra Edge, Synko, etc.)\n- **Student Innovation Council (SiC)** activities & membership\n- **Mentorship Panel & Institutional IPR/Patent Policies**\n\nWhat would you like to know about CIEL today?",
      isOutOfDomain: false,
    };
  }

  // 2. Check out-of-domain heuristics early
  const isOutOfDomain = detectOutOfDomainQuery(latestMessage);
  if (isOutOfDomain) {
    return {
      content:
        "I am Ciela, CIEL's AI Assistant, dedicated to our innovation ecosystem, incubation facilities, entrepreneurship programs, and institutional documents. I do not have information regarding this topic in our knowledge base.\n\nPlease feel free to ask me about CIEL's incubation support, seed funding, accelerator cohorts, student startups, or mentorship!",
      isOutOfDomain: true,
    };
  }

  // 3. If GEMINI_API_KEY is available, invoke live Gemini model with fallback
  if (apiKey) {
    const contextText = contextChunks
      .map((c, i) => {
        const pageInfo = c.pageNumber ? ` (Page ${c.pageNumber})` : "";
        return `[Source ${i + 1}: ${c.sourceTitle}${pageInfo} (${c.sourceType})]\n${c.content}`;
      })
      .join("\n\n---\n\n");

    const recentHistory = messages
      .slice(-4, -1)
      .map((m) => `${m.role === "user" ? "User" : "Ciela"}: ${m.content}`)
      .join("\n");

    const prompt = `${SYSTEM_INSTRUCTION}

${recentHistory ? `RECENT CONVERSATION:\n${recentHistory}\n` : ""}
CIEL KNOWLEDGE CONTEXT:
${contextText || "No specific document chunks found for this query."}

USER QUERY:
${latestMessage}

Answer the user query as Ciela based on the instructions and provided context.`;

    const candidateModels = [PRIMARY_MODEL, FALLBACK_MODEL];

    for (const model of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            return {
              content: text.trim(),
              isOutOfDomain: false,
            };
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next:`, err);
      }
    }
  }

  // 4. Fallback if all API calls fail or key is not provided
  return {
    content: generateFallbackResponse(latestMessage, contextChunks),
    isOutOfDomain: false,
  };
}

/**
 * Detects obvious out-of-domain queries like cricket scores, recipes, unrelated movies.
 */
function detectOutOfDomainQuery(query: string): boolean {
  const lower = query.toLowerCase();

  const outOfDomainPatterns = [
    /\b(cricket|football|ipl|fifa|match|score|who won|world cup)\b/,
    /\b(weather|temperature|forecast|rain today)\b/,
    /\b(recipe|how to cook|bake a cake|ingredients for)\b/,
    /\b(celebrity|hollywood|bollywood|actor|actress|movie review)\b/,
    /\b(write a poem about cats|tell me a joke about dogs)\b/,
    /\b(president of usa|prime minister of australia)\b/,
  ];

  for (const pattern of outOfDomainPatterns) {
    if (pattern.test(lower)) {
      if (!lower.includes("ciel") && !lower.includes("incubat") && !lower.includes("chetana")) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Formats a relevant local response in Ciela's voice from matched context chunks.
 */
function generateFallbackResponse(query: string, chunks: RetrievedChunk[]): string {
  if (!chunks || chunks.length === 0) {
    return "I don't have enough specific information on this in the CIEL knowledge base.\n\nPlease feel free to ask me about our **incubation facilities**, **seed grants**, **mentors**, **accelerator cohorts**, or **Student Innovation Council (SiC)**, or reach out to the CIEL team directly at **info@cielhub.org**.";
  }

  const primaryChunk = chunks[0];
  let answer = `Here is what I found regarding your question:\n\n${primaryChunk.content}\n\n`;

  if (chunks[1] && chunks[1].sourceTitle !== primaryChunk.sourceTitle) {
    answer += `**Additional details from ${chunks[1].sourceTitle}:**\n${chunks[1].content}\n\n`;
  }

  answer += "Let me know if you would like more information on any of these programs!";
  return answer.trim();
}
