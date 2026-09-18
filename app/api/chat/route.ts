import { NextResponse } from "next/server";
import { searchKnowledgeBase, extractCitations, type Citation } from "@/lib/rag";
import { generateChatResponse, type ChatMessage } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body as { messages?: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1];
    if (!latestUserMessage || !latestUserMessage.content) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const query = latestUserMessage.content.trim();

    // 1. Retrieve matching CIEL knowledge chunks via RAG
    const chunks = await searchKnowledgeBase(query, { limit: 4 });

    // 2. Generate grounded answer via Gemini
    const { content, isOutOfDomain } = await generateChatResponse({
      messages,
      contextChunks: chunks,
    });

    // 3. Format citations only if the query is in-domain and has context
    const sources: Citation[] = isOutOfDomain ? [] : extractCitations(chunks);

    return NextResponse.json({
      message: {
        role: "assistant",
        content,
      },
      sources,
      isOutOfDomain,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat query.",
        message: {
          role: "assistant",
          content:
            "I encountered a temporary error while processing your request. Please try again or reach out directly to the CIEL team at info@cielhub.org.",
        },
        sources: [],
      },
      { status: 500 }
    );
  }
}
