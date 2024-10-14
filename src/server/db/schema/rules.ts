import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { governingBodies, sports } from "./sports";

export const rulebooks = pgTable("rulebooks", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sportId: varchar("sport_id", { length: 255 })
    .notNull()
    .references(() => sports.id),
  governingBodyId: varchar("governing_body_id", { length: 255 })
    .notNull()
    .references(() => governingBodies.id),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rules = pgTable("rules", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  rulebookId: varchar("rulebook_id", { length: 255 })
    .notNull()
    .references(() => rulebooks.id),
  ruleNumber: integer("rule_number").notNull(),
  sectionNumber: integer("section_number").notNull(),
  articleNumber: integer("article_number").notNull(),
  text: text("text").notNull(),
});

export const rulebookSimpleSentences = pgTable(
  "rulebook_simple_sentences",
  {
    id: serial("id").primaryKey(),
    ruleId: varchar("rule_id", { length: 255 }).references(() => rules.id),
    text: text("text").notNull(),
    embedding: varchar("embedding", { length: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIdx: index().using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const rulebooksRelations = relations(rulebooks, ({ many }) => ({
  rules: many(rules),
}));

export const rulesRelations = relations(rules, ({ one, many }) => ({
  rulebook: one(rulebooks, {
    fields: [rules.rulebookId],
    references: [rulebooks.id],
  }),
  sentences: many(rulebookSimpleSentences),
}));
