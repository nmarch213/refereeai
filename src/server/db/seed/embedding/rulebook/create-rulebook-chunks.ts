import { z } from "zod";
import { generateObject } from "ai";
import { propositionSystemPrompt } from "./proposal-indexing.prompts";
import fs from "fs";
import { config } from "dotenv";
import { openai } from "~/server/utils/openai";
import path from "path";

// npx tsx -r dotenv/config --env-file=.env.local src/server/db/seed/embedding/rulebook/create-rulebook-chunks.ts

config();

interface RuleChunk {
  ruleNumber: number;
  content: string;
}

const splitRulebook = async (): Promise<RuleChunk[]> => {
  const rulesDir = "src/assets/books/basketball/2024-25/rules";
  const chunks: RuleChunk[] = [];

  console.log(`Starting to process files in: ${rulesDir}`);

  const files = fs.readdirSync(rulesDir);

  for (const file of files) {
    if (file.endsWith(".txt")) {
      const filePath = path.join(rulesDir, file);
      const fileName = path.parse(file).name;
      let ruleNumber: number;

      // Handle different file naming conventions
      if (fileName.includes("-")) {
        // For files like "10-1.txt" or "10-2.txt"
        ruleNumber = parseInt(fileName.split("-")[0]!, 10);
      } else {
        // For files like "2.txt"
        ruleNumber = parseInt(fileName, 10);
      }

      if (isNaN(ruleNumber)) {
        console.warn(
          `Skipping file ${file} as it doesn't have a valid rule number.`,
        );
        continue;
      }

      console.log(`Processing file: ${file}`);

      const content = fs.readFileSync(filePath, "utf-8");

      // Check if a chunk with this rule number already exists
      const existingChunkIndex = chunks.findIndex(
        (chunk) => chunk.ruleNumber === ruleNumber,
      );

      if (existingChunkIndex !== -1 && chunks[existingChunkIndex]) {
        // If it exists, append the content
        chunks[existingChunkIndex].content += "\n\n" + content.trim();
      } else {
        // If it doesn't exist, create a new chunk
        chunks.push({
          ruleNumber,
          content: content.trim(),
        });
      }

      console.log(`Processed Rule ${ruleNumber}`);
    }
  }

  console.log(`Finished processing. Total rules: ${chunks.length}`);

  // Sort chunks by rule number
  chunks.sort((a, b) => a.ruleNumber - b.ruleNumber);

  return chunks;
};

async function createRulebookChunks(sport: string, year: string) {
  const chunks = await splitRulebook();
  const results = [];
  const outputPath = `src/assets/books/${sport}/${year}/rulebook-chunks.json`;

  for (let i = 9; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) {
      console.warn(`Skipping undefined chunk at index ${i}`);
      continue;
    }
    const { ruleNumber, content } = chunk;
    if (ruleNumber === undefined || content === undefined) {
      console.warn(
        `Skipping invalid chunk at index ${i}: missing ruleNumber or content`,
      );
      continue;
    }
    console.log(`Processing Rule ${ruleNumber} (${i + 1} of ${chunks.length})`);

    const response = await generateObject({
      model: openai.chat("gpt-4o-mini"),
      temperature: 0,
      schema: RulebookPropositionSchema,
      system: propositionSystemPrompt(sport),
      prompt: `Decompose the following Rulebook Content for Rule ${ruleNumber}: 
			<Content>
			${content}
			</Content>`,
    });

    results.push({
      ruleNumber,
      sentences: response.object.sentences,
    });

    // Write results to chunks.json after each chunk is processed
    try {
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), {
        flag: "w",
      });
      console.log(`Results updated in ${outputPath}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.error(`Error writing to file: ${error}`);
    }
  }

  console.log(`All rules processed. Final results saved in ${outputPath}`);
  return results;
}

// Update the RulebookProposition schema to include the ruleNumber
export const RulebookPropositionSchema = z.object({
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

async function main() {
  createRulebookChunks("basketball", "2024-25")
    .then(() => {
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

await main();
