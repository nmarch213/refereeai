import fs from "fs/promises";
import path from "path";

async function removeDelimiters(filePath: string) {
  let content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  if (lines.length < 2) {
    console.log(`File ${filePath} has fewer than 2 lines. No changes made.`);
    return;
  }

  let modified = false;

  // Check and remove  markdown from the first line
  if (lines[0] === " markdown") {
    lines.shift();
    modified = true;
  }

  // Check and remove   from the last line
  if (lines[lines.length - 1] === " ") {
    lines.pop();
    modified = true;
  }

  if (modified) {
    content = lines.join("\n");
    await fs.writeFile(filePath, content);
    console.log(`Delimiters removed successfully from ${filePath}`);
  } else {
    console.log(
      `No delimiters found at the start or end of ${filePath}. No changes made.`,
    );
  }
}

async function processDirectory(directoryPath: string) {
  const files = await fs.readdir(directoryPath);

  for (const file of files) {
    if (path.extname(file) === ".md") {
      const filePath = path.join(directoryPath, file);
      await removeDelimiters(filePath);
    }
  }
}

// Usage
const directoryPath = "src/app/assets/books/basketball/2023-24/md";
const volleyballDirectoryPath = "src/app/assets/books/volleyball/2023-24/md";
processDirectory(directoryPath).catch(console.error);
processDirectory(volleyballDirectoryPath).catch(console.error);
