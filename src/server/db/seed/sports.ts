import { db } from "../index";
import { governingBodies, sports } from "../schema/sports";

// npx tsx -r dotenv/config --env-file=.env.local src/server/db/seed/sports.ts

async function seedSports() {
  const nfhs = await db
    .insert(governingBodies)
    .values({
      name: "The National Federation of State High School Associations",
      abbreviation: "NFHS",
    })
    .returning({ id: governingBodies.id })
    .then((res) => res[0]);

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

  await db.insert(sports).values(
    sportsList.map((sportName) => ({
      name: sportName,
      slug: sportName.toLowerCase().replace(/\s+/g, "-"),
      governingBodyId: nfhs.id,
    })),
  );

  console.log("Sports and governing body seeded successfully");
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
