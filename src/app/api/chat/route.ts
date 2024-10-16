import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, embed, streamText } from "ai";
import { sql, desc, cosineDistance, gt, eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  rulebooks,
  rulebookSimpleSentences,
  rules,
} from "~/server/db/schema/rules";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const sport = "basketball";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages, rulebookId } = await req.json();

  if (!rulebookId) {
    return new Response("Invalid rulebook ID", { status: 400 });
  }
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    value: convertToCoreMessages(messages)
      .map((m) => m.content)
      .join("\n"),
  });

  const similarity = sql<number>`1 - (${cosineDistance(
    rulebookSimpleSentences.embeddings,
    embedding,
  )})`;

  const results = await db
    .select({
      id: rulebookSimpleSentences.id,
      ruleId: rules.id,
      ruleNumber: rules.ruleNumber,
      sectionNumber: rules.sectionNumber,
      articleNumber: rules.articleNumber,
      simpleSentence: rulebookSimpleSentences.text,
      similarity,
    })
    .from(rulebookSimpleSentences)
    .innerJoin(rules, eq(rulebookSimpleSentences.ruleId, rules.id))
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(5);

  const context = results
    .map(
      (doc) =>
        `Rule ${doc.ruleNumber}.${doc.sectionNumber}.${doc.articleNumber}: ${doc.simpleSentence}`,
    )
    .join("\n\n");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  messages.push({
    role: "system",
    content: `Context from the ${sport} Rule Book:\n${context}`,
  });

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a knowledgeable and engaging assistant specializing in ${sport} rules and regulations. Your responses should:

<Guidelines>
1. Reference rules directly from the response where applicable. (e.g. "Rule 1.2.3: No player may dribble the ball more than three times.")
2. Provide clear, detailed explanations of the rules and their applications, using a "show, don't tell" approach.
3. Use vivid descriptions to help users visualize scenarios and better understand the rules.
4. If a question cannot be answered with the given context, state that clearly and suggest where to find more information.
5. Adapt your tone to match the user's level of expertise, from beginner to advanced.
6. Use a unique style that brings the rules to life, making them more engaging and memorable.
7. Format your responses using markdown:
   - Use **bold** for rule numbers and important terms.
   - Use *italics* for emphasis on key points.
   - Use > blockquotes for direct quotes from the rule book.
   - Use - or * for bullet points when listing multiple items.
   - Use ### for subheadings when organizing your response.
   - Use \`inline code\` for specific measurements or short rule references.
8. When appropriate, use analogies or real-world examples to illustrate complex rules.
9. Occasionally introduce minor "plot points" or scenarios to make explanations more interactive and engaging.
10. Balance formal rule explanations with more casual language to maintain interest.
11. Encourage critical thinking by posing follow-up questions or hypothetical situations.
</Guidelines>

Always base your answers on the official rules provided in the context. If you're unsure or if the information isn't in the context, say so. Remember, your goal is not just to recite rules, but to help users truly understand and appreciate the intricacies of ${sport}.`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
