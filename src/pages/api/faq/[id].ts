import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/configs/auth"
import roles from "@/constants/roles";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig)
    if (req.method === "GET") {
        const { id } = req.query;
        try {
            const faq = await prisma.faq.findUnique({
                where: {
                    id: parseInt(id as string),
                },
            });

            if (faq) {
                res.status(200).json(faq);
            } else {
                res.status(404).json({ error: "There are no faq entity" });
            }
        } catch (error) {
            console.error("Error fetching faq:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "PUT") {
        if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
            const { id, question, answer, questionType, documentLink } = req.body;
            try {
                const updatedFaq = await prisma.faq.update({
                    where: {
                        id,
                    },
                    data: {
                        question,
                        answer,
                        questionType,
                        documentLink,
                    },
                });

                if (updatedFaq) {
                    res.status(200).json(updatedFaq);
                } else {
                    res.status(404).json({ error: `Can't update faq with id: ${id}` });
                }
            } catch (error) {
                console.error("Error updating faq:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            res.status(405).json({ error: "You do not have permission to perform this operation" });
        }
    } else if (req.method === "DELETE") {
        if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
            const { id } = req.query;
            try {
                const deletedFaq = await prisma.faq.delete({
                    where: {
                        id: parseInt(id as string),
                    },
                });

                if (deletedFaq) {
                    res.status(200).json(deletedFaq);
                } else {
                    res.status(404).json({ error: `Can't delete faq with id: ${id}` });
                }
            } catch (error) {
                console.error("Error deleting faq:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            res.status(405).json({ error: "You do not have permission to perform this operation" });
        }
    } else {
        res.status(405).end();
    }
}
