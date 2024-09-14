import { generateText } from "ai";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { openai } from "./openai";

interface BookConfig {
  mdxDir: string;
  outputFile: string;
  bookType: string;
}

async function getMdxFiles(mdxDir: string) {
  const files = await fs.readdir(mdxDir);
  return files.filter((file) => file.endsWith(".mdx"));
}

async function processFile(
  filePath: string,
  bookType: string,
  previousContent: string,
) {
  const content = await fs.readFile(filePath, "utf-8");
  const { content: mdxContent } = matter(content);

  const systemPrompt = `You are an expert in translating ${bookType} rulebooks into clear, concise, and well-structured markdown format. Your task is to take the provided content, merge it with the previous content, create appropriate links, and append new information.

Guidelines:
1. Maintain the original structure and hierarchy of the content.
2. Use appropriate markdown formatting (headers, lists, tables, etc.) to enhance readability.
3. Ensure all rule numbers and references are accurately preserved.
4. Use bold or italic text to emphasize key points or important terms.
5. Create tables for any tabular data present in the original content.
6. Use blockquotes for any official definitions or important notes.
7. Include any diagrams or illustrations as markdown-compatible image links (if available).
8. Organize content into logical sections using appropriate header levels.
9. Use code blocks for any specific examples or scenarios that benefit from distinct formatting.
10. Maintain consistent terminology throughout the document.
11. Ensure the markdown is easily readable and accessible for quick reference.
12. Create internal links between related sections or rules using markdown syntax.
13. Merge new content with existing content where appropriate, avoiding duplication.
14. Append entirely new sections or rules to the end of the existing content.
15. Update any table of contents or index to reflect the newly added or merged content.
16. Ensure smooth transitions between existing and new content.`;

  const userPrompt = `Here's the previously translated content:

${previousContent}

Now, merge, link, and append the following new content from the ${bookType} Rules book into the existing markdown format:

${mdxContent}

Please ensure that:
1. You merge overlapping or related content with the existing text.
2. You create internal links between related sections using markdown syntax.
3. You append entirely new content to the end of the existing text.
4. You update any table of contents or index to reflect the changes.
5. The final output is a cohesive, well-structured document that incorporates both the existing and new content.`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return text;
}

async function processAllFiles(config: BookConfig) {
  const mdxFiles = await getMdxFiles(config.mdxDir);
  let outputContent = "";

  let previousContent = "";
  for (const file of mdxFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(config.mdxDir, file);
    const result = await processFile(
      filePath,
      config.bookType,
      previousContent,
    );

    outputContent += `${result}`;
    previousContent = outputContent; // Update previousContent for the next iteration
  }

  await fs.writeFile(config.outputFile, outputContent);
  console.log(`Translated markdown content written to ${config.outputFile}`);
}

export async function generateBookSummary(config: BookConfig) {
  try {
    await processAllFiles(config);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}
