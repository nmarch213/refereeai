import {
  pgTableCreator,
  primaryKey,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `ref_${name}`);

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
