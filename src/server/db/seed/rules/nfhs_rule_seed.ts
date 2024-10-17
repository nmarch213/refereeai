import fs from "fs/promises";
import { db } from "../..";
import { rulebooks, rulebookSimpleSentences, rules } from "../../schema/rules";
import { sports } from "../../schema/sports";
import { eq } from "drizzle-orm";
import { RulebookPropositionSchema } from "../embedding/rulebook/create-rulebook-chunks";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const sportRules = [
  {
    sport: "basketball",
    year: "2023-24",
    processed: false,
    governingBodyId: "7f317f59-e607-4bc7-a473-a3d835b21a21",
    sportId: "f96c2435-4572-4b31-9b7b-57894cb1b4ef",
  },
];

const rulesDir = (sport: string, year: string) =>
  `src/assets/books/${sport}/${year}/rules.json`;

async function main() {
  for (const rule of sportRules) {
    if (rule.processed) continue;

    const rulesRaw = await fs.readFile(
      rulesDir(rule.sport, rule.year),
      "utf-8",
    );

    const rulebook = await createRulebook(
      rule.sportId,
      rule.governingBodyId,
      rule.year,
    );

    if (!rulebook) {
      throw new Error("Rulebook not created");
    }

    const parsedRules = RulebookPropositionSchema.array().parse(
      JSON.parse(rulesRaw),
    );

    for (const pr of parsedRules) {
      for (const sentence of pr.sentences) {
        const rule = await createRule(
          rulebook.id,
          pr.ruleNumber,
          sentence.ruleReference.section,
          sentence.ruleReference.article,
        );
        if (rule) {
          await createSimpleSentenceWithEmbeddings(rule.id, sentence.text);
          continue;
        }
      }
    }
  }
}

async function createSimpleSentenceWithEmbeddings(
  ruleId: string,
  text: string,
) {
  const embeddings = await generateEmbedding(text);
  return await db
    .insert(rulebookSimpleSentences)
    .values({
      ruleId,
      text,
      embeddings,
    })
    .returning();
}

async function createRule(
  rulebookId: string,
  ruleNumber: number,
  sectionNumber: number,
  articleNumber: number,
) {
  const existingRule = await db
    .select()
    .from(rules)
    .where(
      eq(rules.rulebookId, rulebookId) &&
        eq(rules.ruleNumber, ruleNumber) &&
        eq(rules.sectionNumber, sectionNumber) &&
        eq(rules.articleNumber, articleNumber),
    );
  if (existingRule) {
    return existingRule[0];
  }
  const newRule = await db
    .insert(rules)
    .values({
      rulebookId,
      ruleNumber,
      sectionNumber,
      articleNumber,
    })
    .returning();
  return newRule[0];
}

async function createRulebook(
  sportId: string,
  governingBodyId: string,
  year: string,
) {
  const sport = await db.query.sports.findFirst({
    where: eq(sports.id, sportId),
  });
  if (!sport) {
    throw new Error("Sport not found");
  }
  const rulebook = await db
    .insert(rulebooks)
    .values({
      sportId,
      governingBodyId,
      name: `${sport.name} ${year} Rulebook`,
      year: parseInt(year, 10),
    })
    .returning();

  return rulebook[0];
}

async function generateEmbedding(input: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: input,
  });
  return embedding;
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
