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
  const { Node } = dom.window;

  const contentDiv = document.querySelector('div[id^="parent-p"]');
  if (!contentDiv) return "";

  function parseElement(element, depth = 0) {
    let content = "";
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          content += text + " ";
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        switch (child.tagName.toLowerCase()) {
          case "b":
          case "strong":
            content += `**${parseElement(child, depth).trim()}** `;
            break;
          case "i":
          case "em":
            content += `*${parseElement(child, depth).trim()}* `;
            break;
          case "ul":
          case "ol":
            content +=
              "\n\n" +
              Array.from(child.children)
                .map(
                  (li) =>
                    `${"  ".repeat(depth)}- ${parseElement(li, depth + 1).trim()}`,
                )
                .join("\n") +
              "\n\n";
            break;
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            const level = parseInt(child.tagName[1]);
            content += `\n\n${"#".repeat(level)} ${parseElement(child, depth).trim()}\n\n`;
            break;
          case "p":
            content += `\n\n${parseElement(child, depth).trim()}\n\n`;
            break;
          case "table":
            content += "\n\n" + parseTable(child) + "\n\n";
            break;
          default:
            content += parseElement(child, depth);
        }
      }
    }
    return content;
  }

  function parseTable(tableElement) {
    const rows = Array.from(tableElement.rows);
    const headerRow = rows.shift();
    const headers = Array.from(headerRow.cells).map((cell) =>
      cell.textContent.trim(),
    );
    const markdown = [
      `| ${headers.join(" | ")} |`,
      `| ${headers.map(() => "---").join(" | ")} |`,
      ...rows.map(
        (row) =>
          `| ${Array.from(row.cells)
            .map((cell) => cell.textContent.trim())
            .join(" | ")} |`,
      ),
    ].join("\n");
    return markdown;
  }

  const content = parseElement(contentDiv)
    .trim()
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/gm, "")
    .replace(/^\s+/gm, "");

  return { content, title: contentDiv.textContent.trim() };
}

function extractPageNumber(fileName) {
  const match = fileName.match(/page(\d+)\.html/);
  return match ? parseInt(match[1], 10) : null;
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

    let indexContent = "";

    for (const file of htmlFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(".html", ".mdx"));

      const htmlContent = await readFile(inputPath, "utf8");
      const { content: mdxContent, title } = htmlToMdx(htmlContent);

      const pageNumber = extractPageNumber(file);

      // Add frontmatter with metadata
      const frontmatter = `---
title: "${title}"
page: ${pageNumber}
---

`;

      await writeFile(outputPath, frontmatter + mdxContent);
      console.log(`Converted ${file} to MDX with metadata successfully.`);

      // Append the content to the index file
      indexContent += mdxContent + "\n\n";
    }

    // Write the index.mdx file
    const indexPath = path.join(outputDir, "index.mdx");
    await writeFile(indexPath, indexContent);
    console.log("Created index.mdx with all content successfully.");
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

// Define base directories
const baseInputDirectory = "src/app/assets/books";
const baseOutputDirectory = "src/app/assets/books";

const books = [
  { sport: "basketball", year: "2023-24", processed: true },
  { sport: "volleyball", year: "2023-24", processed: false },
];

// Process each book
async function processBooks() {
  for (const book of books) {
    if (!book.processed) {
      const inputDirectory = path.join(
        baseInputDirectory,
        book.sport,
        book.year,
        "html",
      );
      const outputDirectory = path.join(
        baseOutputDirectory,
        book.sport,
        book.year,
        "mdx",
      );

      console.log(`Processing ${book.sport} ${book.year}...`);
      await processHtmlFiles(inputDirectory, outputDirectory);
      book.processed = true;
      console.log(`Finished processing ${book.sport} ${book.year}.`);
    } else {
      console.log(`Skipping ${book.sport} ${book.year} (already processed).`);
    }
  }
}

// Run the conversion process for all books
processBooks().catch((error) =>
  console.error("Error processing books:", error),
);
