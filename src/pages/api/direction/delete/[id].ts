import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        const id = Number(req.query.id);

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }

        try {
            await prisma.message.deleteMany({
                where: {
                    requestId: {
                        in: await prisma.request
                            .findMany({
                                where: { directionId: id },
                                select: { id: true },
                            })
                            .then((requests) => requests.map((request) => request.id)),
                    },
                },
            });
            await prisma.request.deleteMany({
                where: {
                    directionId: id,
                },
            });
            await prisma.subDirections.deleteMany({
                where: {
                    directionId: id,
                },
            });
            await prisma.directions.delete({
                where: {
                    id: id,
                },
            });

            res.status(200).json({ message: "Successfully deleted" });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ message: "Failed to delete category" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
