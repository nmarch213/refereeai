import { db } from "../index";
import { governingBodies, sports } from "../schema/sports";
import { eq, and } from "drizzle-orm";

// npx tsx -r dotenv/config --env-file=.env.local src/server/db/seed/sports.ts

async function seedSports() {
  // Check if NFHS already exists
  let nfhs = await db.query.governingBodies.findFirst({
    where: eq(governingBodies.abbreviation, "NFHS"),
  });

  let isNewGoverningBody = false;

  if (!nfhs) {
    // Insert NFHS if it doesn't exist
    nfhs = await db
      .insert(governingBodies)
      .values({
        name: "The National Federation of State High School Associations",
        abbreviation: "NFHS",
      })
      .returning()
      .then((res) => res[0]);

    console.log("NFHS governing body added");
    isNewGoverningBody = true;
  } else {
    console.log("NFHS governing body already exists");
  }

  const sportsList = [
    "BASEBALL",
    "BASKETBALL",
    "FIELD HOCKEY",
    "FOOTBALL",
    "GIRLS GYMNASTICS",
    "BOYS LACROSSE",
    "GIRLS LACROSSE",
    "SOCCER",
    "SOFTBALL",
    "SPIRIT",
    "SWIMMING",
    "TRACK AND FIELD",
    "VOLLEYBALL",
    "WRESTLING",
    "WATER POLO",
    "ICE HOCKEY",
    "POLICY DEBATE",
  ];

  if (!nfhs) {
    throw new Error("NFHS governing body not found");
  }

  for (const sportName of sportsList) {
    const slug = sportName.toLowerCase().replace(/\s+/g, "-");

    if (isNewGoverningBody) {
      // If it's a new governing body, always create a new sport
      await db.insert(sports).values({
        name: sportName,
        slug: slug,
        governingBodyId: nfhs.id,
      });
      console.log(`Added new sport for new governing body: ${sportName}`);
    } else {
      // Check if sport already exists with the correct governing body
      const existingSport = await db.query.sports.findFirst({
        where: and(eq(sports.slug, slug), eq(sports.governingBodyId, nfhs.id)),
      });

      if (!existingSport) {
        // Check if sport exists but with a different governing body
        const sportWithDifferentGoverningBody = await db.query.sports.findFirst(
          {
            where: eq(sports.slug, slug),
          },
        );

        if (sportWithDifferentGoverningBody) {
          // Update the existing sport with the correct governing body
          await db
            .update(sports)
            .set({ governingBodyId: nfhs.id })
            .where(eq(sports.id, sportWithDifferentGoverningBody.id));
          console.log(`Updated governing body for sport: ${sportName}`);
        } else {
          // Insert new sport
          await db.insert(sports).values({
            name: sportName,
            slug: slug,
            governingBodyId: nfhs.id,
          });
          console.log(`Added sport: ${sportName}`);
        }
      } else {
        console.log(
          `Sport already exists with correct governing body: ${sportName}`,
        );
      }
    }
  }

  console.log("Sports and governing body seeding completed");
}

async function main() {
  try {
    await seedSports();
    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main().catch(console.error);
