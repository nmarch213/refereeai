import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import type { Sport } from "../_models/sports";
import type { BookYear } from "../_models/years";
import dynamic from "next/dynamic";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-4 mt-6 text-3xl font-semibold" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-5 text-2xl font-medium" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mb-1" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-4 border-gray-300 pl-4 italic"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded bg-gray-100 p-4 dark:bg-gray-800"
      {...props}
    />
  ),
};

interface MDXBookPageProps {
  sport: Sport;
  year: BookYear;
}

export async function MDXBookPage({ sport, year }: MDXBookPageProps) {
  const content = await fs.readFile(
    path.join(process.cwd(), `src/assets/books/${sport}/${year}`, `book-2.md`),
    "utf-8",
  );

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote components={components} source={content} />
    </div>
  );
}
