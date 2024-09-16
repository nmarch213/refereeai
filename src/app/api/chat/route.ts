import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, embed, streamText } from "ai";
import { sql, desc, cosineDistance, gt } from "drizzle-orm";
import { db } from "~/server/db";
import { basketball202324, volleyball202324 } from "~/server/db/schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const sports = {
  basketball: basketball202324,
  volleyball: volleyball202324,
};

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages, sport } = await req.json();

  if (!sports[sport as keyof typeof sports]) {
    return new Response("Invalid sport", { status: 400 });
  }

  const sportSchema = sports[sport as keyof typeof sports];

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    value: convertToCoreMessages(messages)
      .map((m) => m.content)
      .join("\n"),
  });

  const similarity = sql<number>`1 - (${cosineDistance(
    sportSchema.embedding,
    embedding,
  )})`;

  const results = await db
    .select({
      id: sportSchema.id,
      page: sportSchema.page,
      content: sportSchema.content,
      similarity,
    })
    .from(sportSchema)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(5);

  const context = results
    .map((doc) => `Page: ${doc.page}, Content: ${doc.content}`)
    .join("\n\n");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  messages.push({
    role: "system",
    content: `Context:\n${context}`,
  });

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: `You are a helpful assistant knowledgeable about ${sport} rules and regulations.`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
