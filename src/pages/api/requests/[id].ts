import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/configs/auth"
import Joi from 'joi';
import roles from "@/constants/roles";

const patchRequestValidationSchema = Joi.object({
    id: Joi.number().integer().required(),
    status: Joi.string().valid('Submitted', 'Processing', 'Clarify', 'Clarified', 'Processed', 'Canceled').required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig)
    if (session) {
        if (req.method === "GET") {
            const id = Number(req.query.id);

            if (!id) {
                res.status(400).json({ error: "No requestId provided" });
            }
            if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
                const requests = await prisma.request.findUnique({
                    where: { id },
                    include: { direction: true, subDirection: true },
                });

                if (requests) {
                    res.status(201).json(requests);
                } else {
                    res.status(500).json({ error: "There is no request" });
                }
            } else if (session?.roles.includes(roles.ROLE_STUDENT)) {
                const requests = await prisma.request.findUnique({
                    where: { id },
                    include: { direction: true, subDirection: true },
                });

                if (requests?.userId === session.user.userId) {
                    res.status(201).json(requests);
                } else {
                    res.status(500).json({ error: "There is no request" });
                }
            } else if (session?.roles.includes(roles.ROLE_TEACHER)) {
                const requests = await prisma.request.findUnique({
                    where: { id },
                    include: { direction: true, subDirection: true },
                });

                if (requests?.direction.professor === session.user.email) {
                    res.status(201).json(requests);
                } else {
                    res.status(500).json({ error: "There is no request" });
                }
            }
        } else if (req.method === "PATCH") {
            const { error, value } = patchRequestValidationSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id, status } = value;

            if (Array.isArray(id)) {
                res.status(400).json({ error: "Multiple IDs are not supported" });
                return;
            }

            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid ID format" });
                return;
            }
            try {
                if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
                    const updatedRequest = await prisma.request.update({
                        where: { id },
                        data: { status },
                    });

                    if (updatedRequest) {
                        res.status(201).json(updatedRequest);
                    } else {
                        res.status(500).json({ error: "There is no request" });
                    }
                } else if (session?.roles.includes(roles.ROLE_STUDENT)) {
                    const requests = await prisma.request.findUnique({
                        where: { id },
                        include: { direction: true, subDirection: true },
                    });

                    if (requests?.userId === session.user.userId) {
                        const updatedRequest = await prisma.request.update({
                            where: { id },
                            data: { status },
                        });

                        if (updatedRequest) {
                            res.status(201).json(updatedRequest);
                        } else {
                            res.status(500).json({ error: "There is no request" });
                        }
                    } else {
                        res.status(405).json({ error: "You do not have permission to perform this operation" });
                    }
                } else if (session?.roles.includes(roles.ROLE_TEACHER)) {
                    const requests = await prisma.request.findUnique({
                        where: { id },
                        include: { direction: true, subDirection: true },
                    });

                    if (requests?.direction.professor === session.user.email) {
                        const updatedRequest = await prisma.request.update({
                            where: { id },
                            data: { status },
                        });

                        if (updatedRequest) {
                            res.status(201).json(updatedRequest);
                        } else {
                            res.status(500).json({ error: "There is no request" });
                        }
                    } else {
                        res.status(405).json({ error: "You do not have permission to perform this operation" });
                    }
                }

            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error });
            }
        } else {
            res.status(405).end();
        }
    } else {
        res.status(405).json({error: "User is not authorized"})
    }
}
