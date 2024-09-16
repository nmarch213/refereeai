/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";
import { basketball202324, volleyball202324 } from "~/server/db/schema";
import fs from "fs/promises";
import path from "path";
import { embed } from "ai";
import { openai } from "../../../utils/openai";
import matter from "gray-matter";

const books = [
  {
    sport: "basketball",
    year: "2023-24",
    processed: true,
    schema: basketball202324,
  },
  {
    sport: "volleyball",
    year: "2023-24",
    processed: false,
    schema: volleyball202324,
  },
];

async function getMdxFiles(MDX_DIR: string) {
  const files = await fs.readdir(MDX_DIR);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const fileContents = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = await fs.readFile(path.join(MDX_DIR, file), "utf-8");
      const { data, content: mdxContent } = matter(content);
      const metadata = `Page: ${data.page || ""}`;
      const fullContent = `${metadata}. ${mdxContent}`;
      return {
        id: file.replace(".mdx", ""),
        page: data.page || "",
        fullContent: fullContent,
      };
    }),
  );

  return fileContents;
}

async function main() {
  for (const book of books) {
    if (!book.processed) continue;

    const MDX_DIR = `src/app/assets/books/${book.sport}/${book.year}/mdx`;
    const schema = book.schema;

    const mdxFiles = await getMdxFiles(MDX_DIR);

    for (const file of mdxFiles) {
      const embedding = await generateEmbedding(file.fullContent);

      await db
        .insert(schema)
        .values({
          id: `${book.sport}_${book.year}_${file.id}`,
          page: file.page,
          content: file.fullContent,
          embedding,
        })
        .onConflictDoUpdate({
          target: schema.id,
          set: {
            page: file.page,
            content: file.fullContent,
            embedding,
          },
        });

      console.log(`Processed ${book.sport} ${book.year} ${file.id}`);
    }

    console.log(
      `${book.sport} ${book.year} MDX embeddings seeded successfully!`,
    );
  }
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
