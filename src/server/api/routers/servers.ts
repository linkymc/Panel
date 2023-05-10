import { generateApiKey } from "generate-api-key";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ serverId: z.string() }))
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
        },
      });

      return server;
    }),
});
