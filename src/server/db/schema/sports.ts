import { index, varchar, text, vector } from "drizzle-orm/pg-core";
import { createTable } from "./index";

export const basketball202324 = createTable(
  "basketball_2023-24",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    page: varchar("page", { length: 255 }).notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index().using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const volleyball202324 = createTable(
  "volleyball_2023-24",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    page: varchar("page", { length: 255 }).notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index().using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
