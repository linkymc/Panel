import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.sessions.findFirst({
        where: {
          id: input.id,
        },
      });

      if (session === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: `No session with an ID of ${input.id} was found.`,
        });
      }

      return session;
    }),
});
