import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/configs/auth"
import Joi from "joi"

const messageSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    userSurname: Joi.string().required(),
    text: Joi.string().required(),
    documentLinks: Joi.array().items(Joi.string().uri()).optional(),
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig)
    if (session) {
        if (req.method === "POST") {
            const { error, value } = messageSchema.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({ errors: error.details.map(detail => detail.message) });
            }

            try {
                const newMessage = await prisma.message.create({
                    data: value,
                });

                res.status(201).json(newMessage);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: error});
            }
        } else {
            res.status(405).end();
        }
    } else {
        res.status(405).json({error: "User is not authorized"});
    }
}
