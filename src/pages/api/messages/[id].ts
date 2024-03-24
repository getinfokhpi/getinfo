import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/configs/auth"
import roles from "@/constants/roles";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig)
    if (session) {
        if (req.method === "GET") {
            const id = Number(req.query.id);

            if (!id) {
                res.status(400).json({ error: "No requestId provided" });
            }

            if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
                const messages = await prisma.message.findMany({
                    where: {
                        requestId: id,
                    },
                });

                if (messages) {
                    res.status(201).json(messages);
                } else {
                    res.status(500).json({ error: "There is no message" });
                }
            } else if (session?.roles.includes(roles.ROLE_STUDENT)) {
                const messages = await prisma.message.findMany({
                    where: {
                        requestId: id,
                        userId: session.user.userId,
                    },
                });

                if (messages) {
                    res.status(201).json(messages);
                } else {
                    res.status(500).json({ error: "There is no message" });
                }
            } else if (session?.roles.includes(roles.ROLE_TEACHER)) {
                const messages = await prisma.message.findMany({
                    where: {
                        requestId: id,
                        request: {
                            direction: {
                                professor: session.user.email,
                            }
                        }
                    },
                });

                if (messages) {
                    res.status(201).json(messages);
                } else {
                    res.status(500).json({ error: "There is no message" });
                }
            } else {
                res.status(405).json({error: "User doesn't have a role"});
            }
        } else {
            res.status(500).json({ error: "There is no message" });
        }
    } else {
        res.status(405).json({error: "User is not authorized"});
    }
}
