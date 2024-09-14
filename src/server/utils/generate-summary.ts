import { generateBookSummary } from "./organize-book-info";

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
