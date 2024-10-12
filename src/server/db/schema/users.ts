import { pgTableCreator } from "drizzle-orm/pg-core";
import { varchar, timestamp } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { relations, sql } from "drizzle-orm";

const createTable = pgTableCreator((name) => `ref_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));
