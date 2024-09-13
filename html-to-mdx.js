/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-nocheck
import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import path from "path";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

/**
 * @param {string | ArrayBuffer | DataView | undefined} htmlContent
 */
function htmlToMdx(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Find the main content div (parent-p* where * is any number)
  const contentDiv = document.querySelector('div[id^="parent-p"]');

  if (!contentDiv) {
    return ""; // Return empty string if no content div is found
  }

  // Extract all text spans
  const spans = contentDiv.querySelectorAll("span.ps.pr.op.co");

  // Combine spans into paragraphs
  const paragraphs = [];
  let currentParagraph = [];

  spans.forEach((span) => {
    const text = span.textContent.trim();
    if (text.endsWith(".") || text.endsWith(":")) {
      currentParagraph.push(text);
      paragraphs.push(currentParagraph.join(" "));
      currentParagraph = [];
    } else {
      currentParagraph.push(text);
    }
  });

  // If there's any remaining text, add it as a paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  // Convert paragraphs to Markdown
  const markdownContent = paragraphs.join("\n\n");

  // Extract page number and title
  const pageNumber =
    document.querySelector('span[epub\\:type="pagebreak"]')?.id || "";
  const title = document.querySelector("title")?.textContent || "";

  // Add MDX-specific elements
  const mdxContent = `
# ${title}

Page: ${pageNumber}

${markdownContent}
  `;

  return mdxContent;
}

async function ensureDirectoryExists(directory) {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

async function processHtmlFiles(inputDir, outputDir) {
  try {
    await ensureDirectoryExists(outputDir);

    const files = await readdir(inputDir);
    const htmlFiles = files.filter((file) => file.endsWith(".html"));

    for (const file of htmlFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(".html", ".mdx"));

      const htmlContent = await readFile(inputPath, "utf8");
      const mdxContent = htmlToMdx(htmlContent);

      await writeFile(outputPath, mdxContent);
      console.log(`Converted ${file} to MDX successfully.`);
    }
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

// Define input and output directories
const inputDirectory = "src/app/assets/books/basketball/2023-24/xhtml";
const outputDirectory = "src/app/assets/books/basketball/2023-24/mdx";

// Run the conversion process
processHtmlFiles(inputDirectory, outputDirectory);
