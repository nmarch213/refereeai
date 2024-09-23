import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { openai } from "~/server/utils/openai";
import { embed, generateText } from "ai";
import { db } from "~/server/db";
import { basketball202324, volleyball202324 } from "~/server/db/schema";
import { sql, desc, cosineDistance, gt } from "drizzle-orm";

const sports = {
  basketball: basketball202324,
  volleyball: volleyball202324,
};

export const questionRouter = createTRPCRouter({
  askQuestion: publicProcedure
    .input(
      z.object({
        question: z.string(),
        sport: z.enum(["basketball", "volleyball"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { question, sport } = input;
      const sportSchema = sports[sport];

      const { embedding } = await embed({
        model: openai.embedding("text-embedding-ada-002"),
        value: question,
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

      const response = await generateText({
        model: openai("gpt-4o"),
        system: `You are a knowledgeable assistant specializing in ${sport} rules and regulations. Your responses should:
1. Prioritize accuracy above all else. Always base your answers on the official rules provided in the context.
2. For multiple-choice questions:
   - Evaluate each option separately, citing relevant rules for each.
   - Clearly state which option is correct and why, referencing specific rules.
   - Explain why other options are incorrect, if applicable.
3. Directly reference specific rules from the ${sport} Rule Book when applicable.
4. Cite the page number and exact rule number (if available) for each reference.
5. Provide clear explanations of the rules and their applications.
6. If a question cannot be answered with the given context, explicitly state that and suggest where to find more information.
7. Use official terminology from the ${sport} Rule Book.
8. Format your responses using markdown:
   - Use **bold** for rule numbers and important terms.
   - Use *italics* for emphasis on key points.
   - Use > blockquotes for direct quotes from the rule book.
   - Use - or * for bullet points when listing multiple items.
   - Use ### for subheadings when organizing your response.
   - Use \`inline code\` for specific measurements or short rule references.
9. The final line of your response should be the concise answer in bold.

Always base your answers on the official rules provided in the context. If you're unsure or if the information isn't in the context, explicitly state this limitation.`,
        messages: [
          {
            role: "system",
            content: `Context from the ${sport} Rule Book:\n${context}`,
          },
          { role: "user", content: question },
        ],
      });

      return response.text;
    }),
});
