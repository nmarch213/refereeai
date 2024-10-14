import { sql, relations } from "drizzle-orm";
import { pgTableCreator, pgEnum } from "drizzle-orm/pg-core";
import {
  varchar,
  timestamp,
  integer,
  vector,
  index,
  text,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `ref_${name}`);

export const rulebookTypeEnum = pgEnum("ref_rulebook_type", [
  "RULES",
  "BOOK",
  "MECHANICS",
  "CASEPLAY",
]);

export const governingBodies = createTable("governing_body", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const sports = createTable("sport", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  imgUrl: varchar("img_url", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  governingBodyId: varchar("governing_body_id", { length: 255 })
    .notNull()
    .references(() => governingBodies.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const rulebooks = createTable(
  "rulebook",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sportId: varchar("sport_id", { length: 255 })
      .notNull()
      .references(() => sports.id),
    year: integer("year").notNull(),
    type: rulebookTypeEnum("type").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    sportYearTypeIdx: index("sport_year_type_idx").on(
      table.sportId,
      table.year,
      table.type,
    ),
    embeddingIdx: index().using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const sportsRelations = relations(sports, ({ one, many }) => ({
  governingBody: one(governingBodies, {
    fields: [sports.governingBodyId],
    references: [governingBodies.id],
  }),
  rulebooks: many(rulebooks),
}));

export const rulebooksRelations = relations(rulebooks, ({ one }) => ({
  sport: one(sports, {
    fields: [rulebooks.sportId],
    references: [sports.id],
  }),
}));

export const governingBodiesRelations = relations(
  governingBodies,
  ({ many }) => ({
    sports: many(sports),
  }),
);

// Export the enum values for use in other files
export const RULEBOOK_TYPES = rulebookTypeEnum.enumValues;
