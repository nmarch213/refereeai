import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

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
  previousSummary: string,
  bookType: string,
) {
  const content = await fs.readFile(filePath, "utf-8");
  const { content: mdxContent } = matter(content);

  const prompt = `Summarize the following content from a ${bookType} Rules book, considering the previous summary:

Previous summary:
${previousSummary}

New content:
${mdxContent}

Guidelines:
1. Focus on rule interpretations and their practical applications.
2. Highlight any key changes or updates to existing rules.
3. Organize content by game situations or rule categories for clarity.
4. Include brief examples or scenarios for complex rules.
5. Emphasize officiating techniques and best practices related to the rules.
6. Maintain consistent terminology throughout the summary.
7. Summarize key points in bullet form for quick reference.
8. Add cross-references to related rules or sections when applicable.
9. Continuously improve and refine the previous summary, integrating new information seamlessly.
10. Create meaningful links between different sections of content.
11. Ensure the summary is easily readable and accessible for quick reference during games or training.
12. When stating specific rules, use exact quotes from the official rulebook and clearly indicate these with quotation marks.
13. For each rule mentioned, provide the exact rule number or section for easy reference.

Provide a concise yet comprehensive summary that captures the essential rules, interpretations, and officiating guidelines, integrating with and improving upon the previous summary where relevant. Ensure that official rule statements are quoted verbatim and properly referenced.`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: prompt }],
  });

  return text;
}

async function processAllFiles(config: BookConfig) {
  const mdxFiles = await getMdxFiles(config.mdxDir);
  let outputContent = `# Comprehensive ${config.bookType} Rules Summary\n\n## Table of Contents\n\n`;
  let previousSummary = "";

  // Generate table of contents
  for (const file of mdxFiles) {
    outputContent += `- [${path.basename(file, ".mdx")}](#${path.basename(file, ".mdx").toLowerCase().replace(/\s+/g, "-")})\n`;
  }

  outputContent += "\n---\n\n";

  for (const file of mdxFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(config.mdxDir, file);
    const result = await processFile(
      filePath,
      previousSummary,
      config.bookType,
    );

    outputContent += `## ${path.basename(file, ".mdx")}\n\n${result}\n\n---\n\n`;
    previousSummary = result;
  }

  await fs.writeFile(config.outputFile, outputContent);
  console.log(`Comprehensive summary written to ${config.outputFile}`);
}

export async function generateBookSummary(config: BookConfig) {
  try {
    await processAllFiles(config);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}
