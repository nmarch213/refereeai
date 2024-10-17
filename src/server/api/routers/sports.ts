import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { rulebooks } from "~/server/db/schema/rules";
import { governingBodies, sports } from "~/server/db/schema/sports";

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

  getRulebookById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(rulebooks)
        .where(eq(rulebooks.id, input.id))
        .limit(1);
    }),
});
