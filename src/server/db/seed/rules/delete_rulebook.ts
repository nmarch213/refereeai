import { db } from "~/server/db";
import {
  rulebooks,
  rules,
  rulebookSimpleSentences,
} from "~/server/db/schema/rules";
import { eq } from "drizzle-orm";

// npx tsx -r dotenv/config --env-file=.env.local src/server/db/seed/rules/delete_rulebook.ts

const bookIds = [""];

export async function deleteRulebookById(rulebookId: string) {
  console.log(`Deleting rulebook with ID: ${rulebookId}`);

  try {
    await db.transaction(async (tx) => {
      // Delete simple sentences associated with the rulebook's rules
      const deletedSentences = await tx
        .delete(rulebookSimpleSentences)
        .where(
          eq(
            rulebookSimpleSentences.ruleId,
            tx
              .select({ id: rules.id })
              .from(rules)
              .where(eq(rules.rulebookId, rulebookId))
              .limit(1),
          ),
        )
        .returning({ deletedId: rulebookSimpleSentences.id });
      console.log(`Deleted ${deletedSentences.length} simple sentences`);

      // Delete rules associated with the rulebook
      const deletedRules = await tx
        .delete(rules)
        .where(eq(rules.rulebookId, rulebookId))
        .returning({ deletedId: rules.id });
      console.log(`Deleted ${deletedRules.length} rules`);

      // Delete the rulebook itself
      const deletedRulebook = await tx
        .delete(rulebooks)
        .where(eq(rulebooks.id, rulebookId))
        .returning({ deletedId: rulebooks.id });

      if (deletedRulebook.length === 0) {
        throw new Error(`Rulebook with ID ${rulebookId} not found`);
      }

      console.log(`Deleted rulebook with ID: ${deletedRulebook[0]?.deletedId}`);
    });

    console.log("Rulebook and associated entities deleted successfully");
  } catch (error) {
    console.error("Error deleting rulebook:", error);
    throw error;
  }
}

// Function to delete multiple rulebooks
export async function deleteRulebooks(rulebookIds: string[]) {
  for (const rulebookId of rulebookIds) {
    await deleteRulebookById(rulebookId);
  }
}

async function main() {
  console.log("-------------");
  console.log("DELETING RULES");
  console.log("-------------");

  deleteRulebooks(bookIds)
    .then(() => {
      console.log("Script completed successfully.");
      process.exit(0);
    })
    .catch((e) => {
      console.error("Script failed:", e);
      process.exit(1);
    });
}

await main();
