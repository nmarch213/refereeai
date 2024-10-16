import { sql, relations } from "drizzle-orm";
import { pgTableCreator, pgEnum } from "drizzle-orm/pg-core";
import { varchar, timestamp } from "drizzle-orm/pg-core";
import { rulebooks } from "./rules";

const createTable = pgTableCreator((name) => `ref_${name}`);

export const rulebookTypeEnum = pgEnum("rulebook_type", [
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

// Add relations
export const governingBodiesRelations = relations(
  governingBodies,
  ({ many }) => ({
    sports: many(sports),
  }),
);

export const sportsRelations = relations(sports, ({ one, many }) => ({
  governingBody: one(governingBodies, {
    fields: [sports.governingBodyId],
    references: [governingBodies.id],
  }),
  rulebooks: many(rulebooks),
}));
