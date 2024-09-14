import { config } from "dotenv";
import { generateBookSummary } from "./organize-book-info";

config();
// npx tsx -r dotenv/config --env-file=.env.local src/server/utils/generate-summary.ts

// Avoid logging entire process.env for security reasons
console.log("Environment variables loaded");

async function main() {
  console.log("Starting book summary generation...");

  const basketballConfig = {
    mdxDir: "src/app/assets/books/basketball/2023-24/mdx",
    outputFile: "src/app/assets/books/basketball/2023-24/book.md",
    bookType: "Basketball Officiating",
  };

  await generateBookSummary(basketballConfig);
  console.log("Book summary generation completed.");
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
