import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import Joi from "joi";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/configs/auth";
import roles from "@/constants/roles";

const faqSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    questionType: Joi.string().required(),
    documentLink: Joi.string().uri().allow('', null),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig);

    if (req.method === "POST") {
        if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
            try {
                const { error, value } = faqSchema.validate(req.body, { abortEarly: false });

                if (error) {
                    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
                }

                const createdFaq = await prisma.faq.create({
                    data: value,
                });

                res.status(201).json(createdFaq);
            } catch (error) {
                console.error("Error creating faq:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            res.status(405).json({ error: "You do not have permission to perform this operation" });
        }
    } else if (req.method === "GET") {
        try {
            const allFaq = await prisma.faq.findMany({
                orderBy: {
                    questionType: "asc",
                },
            });

            if (allFaq) {
                res.status(200).json(allFaq);
            } else {
                res.status(404).json({ error: "There are no faq entries" });
            }
        } catch (error) {
            console.error("Error fetching faq:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end();
    }
}
