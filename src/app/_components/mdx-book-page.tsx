import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import type { Sport } from "../_models/sports";
import type { BookYear } from "../_models/years";

const components = {
  // if we add components in the mdx we add here
};

type MDXBookPageProps = {
  sport: Sport;
  year: BookYear;
};

export async function MDXBookPage({ sport, year }: MDXBookPageProps) {
  const content = await fs.readFile(
    path.join(process.cwd(), `src/assets/books/${sport}/${year}`, `book-2.md`),
    "utf-8",
  );

  return <MDXRemote components={components} source={content} />;
}
