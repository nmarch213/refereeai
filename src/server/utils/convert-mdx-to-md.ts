import { generateText } from "ai";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { openai } from "./openai";
import { mkdir } from "fs/promises";

export interface BookConfig {
  mdxDir: string;
  outputDir: string;
  bookType: string;
  processed: boolean;
}

async function getMdxFiles(mdxDir: string) {
  const files = await fs.readdir(mdxDir);
  return files.filter((file) => file.endsWith(".mdx"));
}

async function processFile(filePath: string, bookType: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const { content: mdxContent } = matter(content);

  // Extract page number from file name
  const fileName = path.basename(filePath, ".mdx");
  const pageMatch = /^page(\d+)$/.exec(fileName);
  const pageNumber = pageMatch ? pageMatch[1] : "";

  const systemPrompt = `You are an expert in organizing ${bookType} rulebooks into well-structured markdown format. Your primary task is to maintain 100% accuracy of the original content while improving its organization, readability, and internal linking in markdown.

Guidelines:
1. Preserve all original content with 100% accuracy - do not add, remove, or modify any rules or information.
2. Use appropriate markdown formatting to enhance readability without changing the content:
   - Use headers (##, ###, ####) to structure the content hierarchically.
   - Use lists (-, 1., 2., etc.) for enumerated items or steps.
   - Use tables for any existing tabular data.
   - Use bold (**text**) or italic (*text*) for emphasis only where it exists in the original.
3. Maintain the original numbering and referencing system for rules.
4. Use blockquotes (>) only for direct quotes or official definitions present in the original text.
5. Preserve any existing diagrams or illustrations as markdown-compatible image links.
6. Use code blocks (\`\`\`) only for specific examples or scenarios that are formatted distinctly in the original.
7. Create a hierarchical structure using appropriate header levels, matching the original document's structure.
8. Use HTML comments <!-- Section: Name --> to mark the beginning of major sections for easier navigation.
9. Implement consistent internal linking using the format #section-name for headers.
10. Ensure the markdown is easily readable while maintaining the exact original content.
11. Create unique identifiers for each rule, section, and subsection. Use the format:
    - For main sections: #section-[section-name]
    - For subsections: #subsection-[parent-section]-[subsection-name]
    - For rules: #rule-[rule-number]
12. Add markdown links to references of other rules or sections. Use the format [Rule X.X](#rule-x-x) or [Section Y](#section-y).
14. If a rule references another rule, add a link to that rule in parentheses after the reference.
15. Ensure all links are lowercase and use hyphens instead of spaces.

Your goal is to make the content more accessible in markdown format without altering its substance or meaning in any way, while adding helpful internal links.`;

  const userPrompt = `Please convert the following content from page ${pageNumber} of the ${bookType} Rules book into markdown format. Maintain 100% accuracy of the content while organizing it for better readability in markdown and adding internal links:

<original-content>
${mdxContent}
</original-content>

Ensure that all rules, numbering, and information are preserved exactly as they appear in the original content. Add internal links as specified in the guidelines.`;

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

  // Create the output directory if it doesn't exist
  await mkdir(config.outputDir, { recursive: true });

  for (const file of mdxFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(config.mdxDir, file);
    const result = await processFile(filePath, config.bookType);

    // Generate output file name
    const outputFileName = path.basename(file, ".mdx") + ".md";
    const outputFilePath = path.join(config.outputDir, outputFileName);

    // Write processed content to individual file
    await fs.writeFile(outputFilePath, result);
    console.log(`Processed content written to ${outputFilePath}`);
  }

  console.log(`All files processed and written to ${config.outputDir}`);
}

export async function convertMdxToMd(config: BookConfig) {
  if (config.processed) {
    return;
  }
  try {
    await processAllFiles(config);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}
