import { clerkClient } from "@clerk/nextjs/server";
import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

import { calculate } from "discord-permission";
import Guild, { AllGuildsResponse } from "~/interfaces/Guild";

interface AllRolesResponse {
  data: Guild[];
}

export const discordRouter = createTRPCRouter({
  getServers: privateProcedure.query(async ({ ctx }) => {
    const userTokens = await clerkClient.users.getUserOauthAccessToken(
      ctx.userId,
      "oauth_discord"
    );

    const { token } = userTokens.shift()!!;

    const { data: guildResponse }: AllGuildsResponse = await axios.get(
      `https://discord.com/api/users/@me/guilds`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return guildResponse.filter((g) =>
      calculate("MANAGE_GUILD", g.permissions)
    );
  }),
  getRoles: privateProcedure
    // .input(z.object({ serverId: z.string() }))
    .query(async ({ input }) => {
      const { data: roleResponse } = await axios.get(
        `https://discord.com/api/guilds/1104059656906756179/roles`,
        {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
          },
        }
      );

      return roleResponse;
    }),
});
