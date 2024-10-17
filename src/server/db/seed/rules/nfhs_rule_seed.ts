import fs from "fs/promises";
import { db } from "../..";
import { rulebooks, rulebookSimpleSentences, rules } from "../../schema/rules";
import { sports } from "../../schema/sports";
import { eq } from "drizzle-orm";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// npx tsx -r dotenv/config --env-file=.env.local src/server/db/seed/rules/nfhs_rule_seed.ts

const RulebookPropositionSchema = z.object({
  ruleNumber: z.number().describe("The rule number"),
  sentences: z.array(
    z.object({
      text: z.string().describe("The proposition text of the rulebook content"),
      ruleReference: z.object({
        rule: z.number().describe("The rule number (e.g. 2)"),
        section: z
          .number()
          .describe("The section number (e.g. 2.3 Rule 2 Section 3)"),
        article: z
          .number()
          .describe(
            "The article number (e.g. 2.3.4 Rule 2 Section 3 Article 4)",
          ),
      }),
    }),
  ),
});
const sportRules = [
  {
    sport: "basketball",
    year: "2024-25",
    processed: false,
    governingBodyId: "7f317f59-e607-4bc7-a473-a3d835b21a21",
    sportId: "f96c2435-4572-4b31-9b7b-57894cb1b4ef",
  },
];

const rulesDir = (sport: string, year: string) =>
  `src/assets/books/${sport}/${year}/rules.json`;

async function SeedRules() {
  console.log("Starting rule processing...");
  const unprocessedRules = sportRules.filter((rule) => !rule.processed);
  console.log(`Found ${unprocessedRules.length} unprocessed rules.`);

  for (const rule of unprocessedRules) {
    try {
      await processRule(rule);
      console.log(`Successfully processed rule for ${rule.sport} ${rule.year}`);
    } catch (error) {
      console.error(
        `Error processing rule for ${rule.sport} ${rule.year}:`,
        error,
      );
    }
  }

  console.log("Rule processing completed.");
}

async function processRule(rule: (typeof sportRules)[0]) {
  console.log(`Processing rule for ${rule.sport} ${rule.year}...`);

  let rulesRaw: string;
  try {
    rulesRaw = await fs.readFile(rulesDir(rule.sport, rule.year), "utf-8");
  } catch (error) {
    throw new Error(`Failed to read rules file: ${error as string}`);
  }

  let parsedRules;
  try {
    parsedRules = RulebookPropositionSchema.array().parse(JSON.parse(rulesRaw));
  } catch (error) {
    throw new Error(`Failed to parse rules: ${error as string}`);
  }

  console.log(`Parsed ${parsedRules.length} rules.`);

  const rulebook = await createRulebook(
    rule.sportId,
    rule.governingBodyId,
    rule.year,
  );
  if (!rulebook) throw new Error("Rulebook not created");

  console.log(`Created rulebook with ID: ${rulebook.id}`);

  const ruleInserts = parsedRules.flatMap((pr) =>
    pr.sentences.map((sentence) => ({
      rulebookId: rulebook.id,
      ruleNumber: pr.ruleNumber,
      sectionNumber: sentence.ruleReference.section,
      articleNumber: sentence.ruleReference.article,
    })),
  );

  let insertedRules;
  try {
    insertedRules = await db
      .insert(rules)
      .values(ruleInserts)
      .onConflictDoNothing()
      .returning();
    console.log(`Inserted ${insertedRules.length} rules.`);
  } catch (error) {
    throw new Error(`Failed to insert rules: ${error as string}`);
  }

  console.log("Generating embeddings and inserting sentences...");
  const sentenceInserts = (
    await Promise.all(
      parsedRules.flatMap((pr) =>
        pr.sentences.map(async (sentence) => {
          try {
            const ruleId = insertedRules.find(
              (r) =>
                r.ruleNumber === pr.ruleNumber &&
                r.sectionNumber === sentence.ruleReference.section &&
                r.articleNumber === sentence.ruleReference.article,
            )?.id;

            if (!ruleId) {
              console.warn(
                `No matching rule found for sentence: ${sentence.text}`,
              );
              return null;
            }

            const embeddings = await generateEmbedding(sentence.text);
            return { ruleId, text: sentence.text, embeddings };
          } catch (error) {
            console.error(`Error processing sentence: ${error as string}`);
            return null;
          }
        }),
      ),
    )
  ).filter(
    (
      insert,
    ): insert is { ruleId: string; text: string; embeddings: number[] } =>
      insert !== null,
  );

  try {
    const insertResult = await db
      .insert(rulebookSimpleSentences)
      .values(sentenceInserts);
    console.log(`Inserted ${insertResult.rowCount} sentences.`);
  } catch (error) {
    throw new Error(`Failed to insert sentences: ${error as string}`);
  }
}

async function createRulebook(
  sportId: string,
  governingBodyId: string,
  year: string,
) {
  const sport = await db.query.sports.findFirst({
    where: eq(sports.id, sportId),
  });
  if (!sport) throw new Error("Sport not found");

  return db
    .insert(rulebooks)
    .values({
      sportId,
      governingBodyId,
      name: `${sport.name} ${year} Rulebook`,
      year: parseInt(year, 10),
    })
    .returning()
    .then((rulebooks) => rulebooks[0]);
}

async function generateEmbedding(input: string) {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-ada-002"),
      value: input,
    });
    return embedding;
  } catch (error) {
    throw new Error(`Failed to generate embedding: ${error as string}`);
  }
}

async function main() {
  console.log("-------------");
  console.log("SEEDING RULES");
  console.log("-------------");

  SeedRules()
    .then(() => {
      console.log("Script completed successfully.");
      process.exit(0);
    })
    .catch((e) => {
      console.error("Script failed:", e);
      process.exit(1);
    });
}

await main();
