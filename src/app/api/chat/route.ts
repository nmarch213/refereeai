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
    .map((doc) => `Page ${doc.page}: ${doc.content}`)
    .join("\n\n");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  messages.push({
    role: "system",
    content: `Context from the ${sport} Rule Book:\n${context}`,
  });

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a knowledgeable assistant specializing in ${sport} rules and regulations. Your responses should:
1. Directly reference specific rules from the ${sport} Rule Book when applicable.
2. Cite the page number and exact rule number (if available) for each reference.
3. Provide clear explanations of the rules and their applications.
4. If a question cannot be answered with the given context, state that and suggest where to find more information.
5. Use official terminology from the ${sport} Rule Book.
6. Format your responses using markdown:
   - Use **bold** for rule numbers and important terms.
   - Use *italics* for emphasis on key points.
   - Use > blockquotes for direct quotes from the rule book.
   - Use - or * for bullet points when listing multiple items.
   - Use ### for subheadings when organizing your response.
   - Use \`inline code\` for specific measurements or short rule references.

Always base your answers on the official rules provided in the context. If you're unsure or if the information isn't in the context, say so.`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
