import { Server } from "@prisma/client";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

const NodeCache = require("node-cache");
const authCache = new NodeCache({
  stdTTL: 60,
});

const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  try {
    const session = await prisma.sessions.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Invalid session ID",
      });
    }

    return res.json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
};

const updateSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
  serverData: Server
) => {
  const id = req.query.id as string;

  try {
    const session = await prisma.sessions.findFirst({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Invalid session ID",
      });
    }

    if (session.status !== "pending") {
      return res.status(410).json({
        success: false,
        error: `This session was already ${session.status}`,
      });
    }

    const { status } = req.body;

    if (!status || !["approved", "denied"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid body.",
      });
    }

    if (serverData.linkedRole && status === "approved") {
      const addRole = `https://discord.com/api/guilds/${serverData.id}/members/${session.discordId}/roles/${serverData.linkedRole}`;
      const headers = {
        "X-Audit-Log-Reason": `Verified their Minecraft account.`,
        Authorization: `Bot ${process.env.TOKEN}`,
      };
      await axios.put(addRole, null, { headers });
    }

    await prisma.sessions.update({
      where: { id: session.id },
      data: { status },
    });

    return res.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
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
    return getSession(req, res);
  }

  if (req.method === "PATCH") {
    return updateSession(req, res, server);
  }

  return res.status(405).json({
    success: false,
    error: `This endpoint does not support the ${req.method} method.`,
  });
};
