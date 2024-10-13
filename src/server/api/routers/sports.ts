import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { governingBodies, sports, rulebooks } from "~/server/db/schema/sports";
import { eq, and, desc, sql } from "drizzle-orm";

export const sportsRouter = createTRPCRouter({
  // Governing Bodies
  getAllGoverningBodies: publicProcedure.query(async () => {
    return db.select().from(governingBodies).orderBy(governingBodies.name);
  }),

  getGoverningBodyById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(governingBodies)
        .where(eq(governingBodies.id, input.id))
        .limit(1);
    }),

  createGoverningBody: publicProcedure
    .input(
      z.object({
        name: z.string(),
        abbreviation: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.insert(governingBodies).values(input).returning();
    }),

  updateGoverningBody: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        abbreviation: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return db
        .update(governingBodies)
        .set(updateData)
        .where(eq(governingBodies.id, id))
        .returning();
    }),

  // Sports
  getAllSports: publicProcedure.query(async () => {
    return db.select().from(sports).orderBy(sports.name);
  }),

  getSportById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.select().from(sports).where(eq(sports.id, input.id)).limit(1);
    }),

  getSportsByGoverningBody: publicProcedure
    .input(z.object({ governingBodyId: z.string() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(sports)
        .where(eq(sports.governingBodyId, input.governingBodyId))
        .orderBy(sports.name);
    }),

  createSport: publicProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        governingBodyId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.insert(sports).values(input).returning();
    }),

  updateSport: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        governingBodyId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return db
        .update(sports)
        .set(updateData)
        .where(eq(sports.id, id))
        .returning();
    }),

  // Rulebooks
  getRulebooksBySport: publicProcedure
    .input(
      z.object({
        sportId: z.string(),
        year: z.number().optional(),
        type: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      let query = db
        .select()
        .from(rulebooks)
        .where(eq(rulebooks.sportId, input.sportId));

      if (input.year) {
        query = query.where(eq(rulebooks.year, input.year));
      }
      if (input.type) {
        query = query.where(eq(rulebooks.type, input.type));
      }

      return query.orderBy(desc(rulebooks.year), rulebooks.type);
    }),

  getRulebookById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(rulebooks)
        .where(eq(rulebooks.id, input.id))
        .limit(1);
    }),

  createRulebook: publicProcedure
    .input(
      z.object({
        sportId: z.string(),
        year: z.number(),
        type: z.string(),
        content: z.string(),
        embedding: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      return db.insert(rulebooks).values(input).returning();
    }),

  updateRulebook: publicProcedure
    .input(
      z.object({
        id: z.string(),
        year: z.number().optional(),
        type: z.string().optional(),
        content: z.string().optional(),
        embedding: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return db
        .update(rulebooks)
        .set(updateData)
        .where(eq(rulebooks.id, id))
        .returning();
    }),

  // Advanced queries
  getSportWithRulebooks: publicProcedure
    .input(z.object({ sportId: z.string() }))
    .query(async ({ input }) => {
      const sport = await db
        .select()
        .from(sports)
        .where(eq(sports.id, input.sportId))
        .limit(1);

      const rbs = await db
        .select()
        .from(rulebooks)
        .where(eq(rulebooks.sportId, input.sportId))
        .orderBy(desc(rulebooks.year), rulebooks.type);

      return { ...sport[0], rulebooks: rbs };
    }),

  searchRulebooks: publicProcedure
    .input(
      z.object({
        sportId: z.string().optional(),
        query: z.string(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      // This is a placeholder for a more advanced search implementation
      // You might want to use full-text search or vector similarity search here
      let query = db
        .select()
        .from(rulebooks)
        .where(sql`${rulebooks.content} ilike ${`%${input.query}%`}`);

      if (input.sportId) {
        query = query.where(eq(rulebooks.sportId, input.sportId));
      }

      return query.limit(input.limit);
    }),
});
