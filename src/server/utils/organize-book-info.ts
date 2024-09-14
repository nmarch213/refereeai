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
14. Use consistent header levels (e.g., # for main sections, ## for subsections, ### for rules).
15. Create a table of contents at the beginning of the document, updating it as new content is added.
16. Use HTML comments to mark the beginning and end of each major section for easier navigation.
17. Implement a consistent naming convention for internal links (e.g., #rule-1-2 for Rule 1.2).
18. Use markdown footnotes for additional explanations or clarifications.`;

  const userPrompt = `Here's the previously translated content:

${previousContent}

Now, merge, link, and append the following new content from the ${bookType} Rules book into the existing markdown format:

${mdxContent}

Please ensure that:
1. You merge overlapping or related content with the existing text.
2. You create internal links between related sections using markdown syntax.
3. You append entirely new content to the end of the existing text.
4. You update any table of contents or index to reflect the changes.
5. The final output is a cohesive, well-structured document that incorporates both the existing and new content.
6. Remove all references to Page Numbers as this will be handled by the table of contents at the top of the document.
7. You use HTML comments to clearly mark the beginning and end of newly added or modified sections.
8. You implement a consistent internal link structure (e.g., #section-1-2 for Section 1.2).
9. You add footnotes for any additional explanations or clarifications that don't fit directly in the main text.
10. You create a glossary section at the end of the document for important terms and concepts.`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return text;
}

async function optimizeOutput(content: string, bookType: string) {
  const systemPrompt = `You are an expert editor specializing in ${bookType} rulebooks. Your task is to refine and optimize the given markdown content, ensuring it's well-structured, consistent, and easy to navigate.`;

  const userPrompt = `Please review and optimize the following markdown content:

${content}

Focus on:
1. Ensuring consistent formatting and style throughout the document.
2. Optimizing the structure and hierarchy of headers.
3. Improving internal links and cross-references.
4. Eliminating any redundancies or duplications.
5. Enhancing the overall flow and readability of the content.
6. Verifying that all new content is properly integrated and linked.
7. Updating the table of contents or index to accurately reflect the current structure.
8. Continually update the table of contents as new content is added.

Please provide the optimized markdown content.`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return text;
}

async function addInternalLinks(content: string, bookType: string) {
  const systemPrompt = `You are an expert in ${bookType} rulebooks. Your task is to add internal links between Rules and Sections in the given markdown content.`;

  const userPrompt = `Please add internal links between Rules and Sections in the following markdown content:

${content}

Guidelines:
1. Use markdown syntax to create links between related Rules and Sections.
2. Ensure that links are bidirectional (i.e., if Rule 1 links to Section 2, Section 2 should also link back to Rule 1).
3. Only add links where there's a clear relationship between Rules and Sections.
4. Maintain the existing structure and formatting of the content.
5. Do not add external links or change any other content.

Please provide the updated markdown content with internal links added.`;

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

  for (const file of mdxFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(config.mdxDir, file);
    const result = await processFile(filePath, config.bookType, outputContent);

    outputContent = await optimizeOutput(result, config.bookType);
    outputContent = await addInternalLinks(outputContent, config.bookType);
  }

  await fs.writeFile(config.outputFile, outputContent);
  console.log(
    `Translated, optimized, and linked markdown content written to ${config.outputFile}`,
  );
}

export async function generateBookSummary(config: BookConfig) {
  try {
    await processAllFiles(config);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}
