import { z } from "zod";
import { generateObject } from "ai";
import { propositionSystemPrompt } from "./proposal-indexing.prompts";
import fs from "fs";
import readline from "readline";
import { config } from "dotenv";
import { openai } from "~/server/utils/openai";

config();

const splitRulebook = async (): Promise<string[]> => {
  const file = "src/app/assets/books/basketball/2023-24/index.mdx";
  const chunks: string[] = [];
  let currentChunk = "";
  let lineCount = 0;
  let chunkCount = 0;

  console.log(`Starting to process file: ${file}`);

  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lineCount++;
    const trimmedLine = line.trim();
    if (trimmedLine === "") {
      if (currentChunk !== "") {
        chunks.push(currentChunk.trim());
        chunkCount++;
        console.log(
          `Chunk ${chunkCount} created with ${currentChunk.split(" ").length} words`,
        );
        currentChunk = "";
      }
    } else {
      currentChunk += trimmedLine + " ";
    }

    if (lineCount % 100 === 0) {
      console.log(`Processed ${lineCount} lines`);
    }
  }

  if (currentChunk !== "") {
    chunks.push(currentChunk.trim());
    chunkCount++;
    console.log(
      `Final chunk ${chunkCount} created with ${currentChunk.split(" ").length} words`,
    );
  }

  console.log(
    `Finished processing. Total lines: ${lineCount}, Total chunks: ${chunkCount}`,
  );

  return chunks;
};

async function createRulebookChunks(sport: string, year: string) {
  const chunks = await splitRulebook();
  const limitedChunks = chunks.slice(4, 8);
  const results = [];
  const outputPath = "./chunks.json";
  let lastRuleReference: {
    rule?: string;
    section?: string;
    article?: string;
  } = {};

  for (let i = 0; i < limitedChunks.length; i++) {
    const chunk = limitedChunks[i];
    console.log(`Processing chunk ${i + 1} of ${limitedChunks.length}`);

    const response = await generateObject({
      model: openai.chat("gpt-4o-mini"),
      schema: RulebookProposition,
      system: propositionSystemPrompt(sport),
      prompt: `Decompose the following Rulebook Content: 
			<Content>
			${chunk}
			</Content>
			
      <LastRuleReference>
      ${lastRuleReference ? JSON.stringify(lastRuleReference) : "None"}
      </LastRuleReference>`,
    });

    results.push(response.object.sentences);
    lastRuleReference = response.object.sentences.at(-1)?.ruleReference ?? {};

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

  console.log(`All chunks processed. Final results saved in ${outputPath}`);
  return results;
}

const RulebookProposition = z.object({
  sentences: z.array(
    z.object({
      text: z.string().describe("The proposition text of the rulebook content"),
      ruleReference: z
        .object({
          rule: z.string().describe("The rule number (e.g. Rule 2)").optional(),
          section: z
            .string()
            .describe("The section number (e.g. 2.3 Rule 2 Section 3)")
            .optional(),
          article: z
            .string()
            .describe(
              "The article number (e.g. 2.3.4 Rule 2 Section 3 Article 4)",
            )
            .optional(),
        })
        .optional(),
    }),
  ),
});

async function main() {
  createRulebookChunks("basketball", "2023-24")
    .then(() => {
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

await main();
