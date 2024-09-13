import { type Config } from "drizzle-kit";
import { config } from "dotenv";

import { env } from "~/env";

config({ path: ".env" });

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["ref_*"],
} satisfies Config;
