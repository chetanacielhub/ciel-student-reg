import { searchKnowledgeBase, extractCitations } from "../lib/rag";
import { generateChatResponse } from "../lib/gemini";

async function testQuery(userQuery: string) {
  console.log(`\n==================================================`);
  console.log(`QUERY: "${userQuery}"`);
  console.log(`==================================================`);

  const chunks = await searchKnowledgeBase(userQuery, { limit: 3 });
  console.log(`Retrieved chunks: ${chunks.length}`);
  chunks.forEach((c, idx) => {
    console.log(`  [${idx + 1}] "${c.sourceTitle}" (${c.sourceType}${c.pageNumber ? ` · Page ${c.pageNumber}` : ""}) - sim: ${c.similarity.toFixed(2)}`);
  });

  const citations = extractCitations(chunks);
  const res = await generateChatResponse({
    messages: [{ role: "user", content: userQuery }],
    contextChunks: chunks,
  });

  console.log(`Citations:`, citations.map(c => `${c.title}${c.page ? ` · Page ${c.page}` : ""}`));
  console.log(`Is Out Of Domain: ${res.isOutOfDomain}`);
  console.log(`\nResponse:\n${res.content}\n`);
}

async function runAll() {
  await testQuery("Hello");
  await testQuery("What is CIEL?");
  await testQuery("Who are the mentors at CIEL?");
  await testQuery("What incubation facilities does CIEL provide?");
  await testQuery("How can I apply for seed support?");
  await testQuery("Who won yesterday cricket match?");
}

runAll().catch(console.error);
