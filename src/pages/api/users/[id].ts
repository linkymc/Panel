import { Server } from "@prisma/client";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

const NodeCache = require("node-cache");
const authCache = new NodeCache({
  stdTTL: 60,
});

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;
  const auth = req.headers.authorization;
  const serverData: Server = authCache.get(auth);

  let userSession;

  const searchField = id.includes("-") ? "uuid" : "discordId";

  userSession = await prisma.sessions.findFirst({
    where: {
      [searchField]: id,
      status: {
        equals: "approved",
      },
    },
  });

  if (!userSession) {
    return res.status(404).json({
      success: false,
      error: "User has not successfully linked.",
    });
  }

  let isInGuild = false;

  try {
    await axios.get(
      `https://discord.com/api/v10/guilds/${serverData.id}/members/${userSession.discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.TOKEN}`,
        },
      }
    );
    isInGuild = true;
  } catch (err) {}

  res.json({
    success: true,
    isInGuild,
    ...userSession,
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
    });
  }

  if (!auth.includes("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Invalid authorization token (1)",
    });
  }

  const apiKey = auth.replace("Bearer ", "");

  let server: Server | null = authCache.get(auth) || null;

  if (!server) {
    server = await prisma.server.findFirst({
      where: {
        apiKey,
      },
    });

    if (server === null) {
      return res.status(401).json({
        success: false,
        error: "Invalid authorization token (2)",
      });
    }

    authCache.set(auth, server);
  }

  if (req.method === "GET") {
    return getUser(req, res);
  }

  return res.status(405).json({
    success: false,
    error: `This endpoint does not support the ${req.method} method.`,
  });
};
