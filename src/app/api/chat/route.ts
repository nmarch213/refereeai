import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, embed, streamText } from "ai";
import { sql, desc, cosineDistance, gt } from "drizzle-orm";
import { db } from "~/server/db";
import { basketball202324 } from "~/server/db/schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Perform similarity search
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: convertToCoreMessages(messages)
      .map((m) => m.content)
      .join("\n"),
  });
  const similarity = sql<number>`1 - (${cosineDistance(
    basketball202324.embedding,
    embedding,
  )})`;
  const results = await db
    .select({
      id: basketball202324.id,
      title: basketball202324.title,
      page: basketball202324.page,
      chapter: basketball202324.chapter,
      content: basketball202324.content,
      similarity,
    })
    .from(basketball202324)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(5);

  const context = results
    .map(
      (doc) =>
        `Title: ${doc.title}, Page: ${doc.page}, Content: ${doc.content}`,
    )
    .join("\n\n");

  messages.push({
    role: "system",
    content: `Context:\n${context}`,
  });

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system:
      "You are a helpful assistant knowledgeable about basketball rules and regulations.",
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
