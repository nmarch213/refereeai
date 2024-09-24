import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { basketball202324 } from "~/server/db/schema";
import { sql, desc } from "drizzle-orm";
import { embed, generateText } from "ai";
import { openai } from "~/server/utils/openai";

async function generateEmbedding(input: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: input,
  });
  return embedding;
}

async function similaritySearch(query: string, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);

  const results = await db
    .select({
      id: basketball202324.id,
      page: basketball202324.page,
      content: basketball202324.content,
      similarity:
        sql<number>`1 - (${basketball202324.embedding} <=> ${queryEmbedding}::vector)`.as(
          "similarity",
        ),
    })
    .from(basketball202324)
    .orderBy(desc(sql`similarity`))
    .limit(topK);

  return results;
}

async function basketballChat(userQuery: string) {
  const relevantDocs = await similaritySearch(userQuery);

  const context = relevantDocs
    .map((doc) => `Page: ${doc.page}, Content: ${doc.content}`)
    .join("\n\n");

  const { text } = await generateText({
    model: openai.chat("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant knowledgeable about basketball rules and regulations.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nUser question: ${userQuery}`,
      },
    ],
  });

  return text;
}

export const basketballRouter = createTRPCRouter({
  chat: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const answer = await basketballChat(input.query);
      return { answer };
    }),
});
