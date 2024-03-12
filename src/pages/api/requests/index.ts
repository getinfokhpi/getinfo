import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { name, surname, email, studentGroup, userId, text, status, directionId, subDirectionId, documentLink } = req.body;

            const newRequest = await prisma.request.create({
                data: {
                    name,
                    surname,
                    email,
                    studentGroup,
                    userId,
                    text,
                    status,
                    documentLink,
                    directionId,
                    subDirectionId,
                    messages: text || documentLink ? {
                        create: {
                            userId,
                            userName: name,
                            userSurname: surname,
                            text,
                            documentLinks: documentLink ? [documentLink] : [],
                        },
                    } : undefined,
                },
                include: {
                    messages: true,
                },
            });

            res.status(201).json(newRequest);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the request." });
        }
    } else if (req.method === "GET") {
        const id = Number(req.query.id);

        if (!id) {
            const allRequests = await prisma.request.findMany({
                include: {
                    direction: true,
                    subDirection: true,
                    messages: true,
                },
            });

            if (allRequests) {
                res.status(201).json(allRequests);
            } else {
                res.status(500).json({ error: "There is no request" });
            }
        } else {
            const requests = await prisma.request.findUnique({
                where: {
                    id: id,
                },
            });

            if (requests) {
                res.status(201).json(requests);
            } else {
                res.status(500).json({ error: "There is no request" });
            }
        }
    } else if (req.method === "DELETE") {
        const id = Number(req.query.id);

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }

        const request = await prisma.request.delete({
            where: {
                id: id,
            },
        });

        if (request) {
            res.status(201).json({ message: "Succesfuly deleted" });
        } else {
            res.status(500).json({ message: "There is no directions" });
        }
    } else if (req.method === "PATCH") {
        const { id, status } = req.body;

        if (Array.isArray(id)) {
            res.status(400).json({ error: "Multiple IDs are not supported" });
            return;
        }

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }
        try {
            const updatedRequest = await prisma.request.update({
                where: { id },
                data: { status },
            });

            if (updatedRequest) {
                res.status(201).json(updatedRequest);
            } else {
                res.status(500).json({ error: "There is no directions" });
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(405).end();
    }
}
