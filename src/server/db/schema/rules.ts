import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
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
    embeddingIdx: index("rulebook_simple_sentences_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

// Add relations
export const rulebooksRelations = relations(rulebooks, ({ one, many }) => ({
  sport: one(sports, {
    fields: [rulebooks.sportId],
    references: [sports.id],
  }),
  governingBody: one(governingBodies, {
    fields: [rulebooks.governingBodyId],
    references: [governingBodies.id],
  }),
  rules: many(rules),
}));

export const rulesRelations = relations(rules, ({ one, many }) => ({
  rulebook: one(rulebooks, {
    fields: [rules.rulebookId],
    references: [rulebooks.id],
  }),
  simpleSentences: many(rulebookSimpleSentences),
}));

export const rulebookSimpleSentencesRelations = relations(
  rulebookSimpleSentences,
  ({ one }) => ({
    rule: one(rules, {
      fields: [rulebookSimpleSentences.ruleId],
      references: [rules.id],
    }),
  }),
);
