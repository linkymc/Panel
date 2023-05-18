import { createTRPCRouter } from "~/server/api/trpc";
import { sessionRouter } from "~/server/api/routers/sessions";
import { serverRouter } from "./routers/servers";
import { discordRouter } from "./routers/discord";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  session: sessionRouter,
  servers: serverRouter,
  discord: discordRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
