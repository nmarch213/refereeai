import { config } from "dotenv";
import { generateBookSummary } from "./organize-book-info";
import { BookConfig, convertMdxToMd } from "./convert-mdx-to-md";

config();
// npx tsx -r dotenv/config --env-file=.env.local src/server/utils/generate-summary.ts

// Avoid logging entire process.env for security reasons
console.log("Environment variables loaded");

const configs: BookConfig[] = [
  {
    mdxDir: "src/app/assets/books/basketball/2023-24/mdx",
    outputDir: "src/app/assets/books/basketball/2023-24/md",
    bookType: "NFHS Basketball Rulebook",
    processed: true,
  },
  {
    mdxDir: "src/app/assets/books/volleyball/2023-24/mdx",
    outputDir: "src/app/assets/books/volleyball/2023-24/md",
    bookType: "NFHS Volleyball Rulebook",
    processed: false,
  },
];

async function main() {
  console.log("Starting book summary generation...");

  for (const config of configs) {
    await convertMdxToMd(config);
  }
  console.log("Book summary generation completed.");
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
