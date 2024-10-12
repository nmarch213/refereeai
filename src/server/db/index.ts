import { drizzle } from "drizzle-orm/vercel-postgres";
import postgres from "postgres";

import * as schema from "./schema";
import { sql } from "@vercel/postgres";
import { config } from "dotenv";
import { env } from "~/env";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ref_${name}`);

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.POSTGRES_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

config({ path: ".env.local" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const db = drizzle(sql, { schema });
