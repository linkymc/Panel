import { TRPCError } from "@trpc/server";
import { generateApiKey } from "generate-api-key";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const serverRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ serverId: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = generateApiKey({
        method: "string",
        prefix: "linky",
        pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
      }).toString();

      const server = await ctx.prisma.server.create({
        data: {
          apiKey,
          id: input.serverId,
          name: input.name,
          managers: JSON.stringify([ctx.userId]),
        },
      });

      return server;
    }),
  fetch: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.server.findMany({
      where: {
        managers: {
          contains: ctx.userId,
        },
      },
    });
  }),
  getSpecific: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.prisma.server.findFirst({
        where: {
          managers: {
            contains: ctx.userId,
          },
          id: input.id,
        },
      });

      if (!found) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: `Unable to access that server 😭`,
        });
      }

      return found
    }),
});
