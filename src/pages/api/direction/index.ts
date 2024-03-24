import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/configs/auth"
import roles from "@/constants/roles";
import Joi from 'joi';


const prisma = new PrismaClient();

const directionSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    professor: Joi.string().required(),
    color: Joi.string().required(),
    subDirections: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        examplelink: Joi.string().uri().optional(),
        additionalInfo: Joi.string().optional(),
        downloadFile: Joi.boolean().optional(),
        textField: Joi.boolean().optional(),
    })).required(),
});

interface SubDirection {
    id?: number;
    name: string;
    description?: string;
    examplelink?: string;
    additionalInfo?: string;
    downloadFile?: string;
    textField?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig)
        if (req.method === "POST") {
            if (session?.roles.includes(roles.ROLE_SUPPORT_ADMIN)) {
                try {
                    const { error, value } = directionSchema.validate(req.body, { abortEarly: false });
                    if (error) {
                        return res.status(400).json({ error: error.details.map(detail => detail.message) });
                    }
                    const { name, description, professor, color, subDirections } = value;

                    const newDirection = await prisma.directions.create({
                        data: {
                            name,
                            description,
                            professor,
                            color,
                            subDirections: {
                                create: subDirections.map((subDir: SubDirection) => ({
                                    ...subDir,
                                })),
                            },
                        },
                        include: {
                            subDirections: true,
                        },
                    });

                    res.status(201).json(newDirection);
                } catch (error) {
                    res.status(500).json({ error: error });
                }
            } else {
                return res.status(405).json({ error: "You do not have permission to perform this operation" })
            }
        } else if (req.method === "GET") {
            const filter = req.query.filter;

            let prismaPayload: any = {
                include: { subDirections: true },
            };

            if (filter === "asc") {
                prismaPayload = {
                    include: { subDirections: true },
                    orderBy: {
                        name: "asc",
                    },
                };
            } else if (filter === "desc") {
                prismaPayload = {
                    include: { subDirections: true },
                    orderBy: {
                        name: "desc",
                    },
                };
            } else if (filter === "date") {
                prismaPayload = {
                    include: { subDirections: true },
                    orderBy: {
                        createdAt: "asc",
                    },
                };
            }

            const allDirections = await prisma.directions.findMany(prismaPayload);

            if (allDirections) {
                res.status(201).json(allDirections);
            } else {
                res.status(500).json({ error: "There is no directions" });
            }
        } else {
            res.status(405).end(); // Method Not Allowed
        }
}
