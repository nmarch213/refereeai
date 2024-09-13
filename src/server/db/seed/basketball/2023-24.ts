/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";
import { basketball202324 } from "~/server/db/schema";
import fs from "fs/promises";
import path from "path";
import { embed } from "ai";
import { openai } from "../utils/openai";
import matter from "gray-matter";

const MDX_DIR = "src/app/assets/books/basketball/2023-24/mdx";

async function getMdxFiles() {
  const files = await fs.readdir(MDX_DIR);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const fileContents = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = await fs.readFile(path.join(MDX_DIR, file), "utf-8");
      const { data, content: mdxContent } = matter(content);
      const cleanedContent = mdxContent
        .replace(/\n+/g, " ") // Replace multiple newlines with a single space
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim(); // Remove leading and trailing whitespace
      const metadata = `Title: ${data.title || ""}, Page: ${data.page || ""}, Chapter: ${data.chapter || ""}`;
      const fullContent = `${metadata}. ${cleanedContent}`;
      return {
        id: file.replace(".mdx", ""),
        title: data.title || "",
        page: data.page || "",
        chapter: data.chapter || "",
        content: cleanedContent,
        fullContent: fullContent,
      };
    }),
  );

  return fileContents;
}

async function main() {
  try {
    const existingEntry = await db.query.basketball202324.findFirst();

    if (existingEntry) {
      console.log("MDX embeddings already seeded!");
      return;
    }
  } catch (error) {
    console.error("Error checking if MDX embeddings exist in the database.");
    throw error;
  }

  const mdxFiles = await getMdxFiles();

  for (const file of mdxFiles) {
    const embedding = await generateEmbedding(file.fullContent);

    await db
      .insert(basketball202324)
      .values({
        id: `basketball_2023-24_${file.id}`,
        title: file.title,
        page: file.page,
        chapter: file.chapter,
        content: file.content,
        embedding,
      })
      .onConflictDoUpdate({
        target: basketball202324.id,
        set: {
          title: file.title,
          page: file.page,
          chapter: file.chapter,
          content: file.content,
          embedding,
        },
      });

    console.log(`Processed ${file.id}`);
  }

  console.log("MDX embeddings seeded successfully!");
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });

async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, " ");
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: input,
  });
  return embedding;
}
