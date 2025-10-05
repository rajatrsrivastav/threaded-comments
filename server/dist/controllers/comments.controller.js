import {} from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: { timestamp: "asc" },
            include: {
                likedBy: {
                    select: { userId: true },
                },
            },
        });
        res.status(200).json(comments);
    }
    catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};
export const postComment = async (req, res) => {
    try {
        const { author, text, parentId } = req.body ?? {};
        if (!text || typeof text !== "string") {
            return res.status(400).json({ message: "text is required" });
        }
        const safeAuthor = typeof author === "string" && author.trim() ? author.trim() : "Anonymous";
        // Only validate parentId if it's actually provided
        let safeParentId = null;
        if (parentId !== null && parentId !== undefined) {
            if (!Number.isInteger(parentId)) {
                return res
                    .status(400)
                    .json({ message: "parentId must be an integer if provided" });
            }
            safeParentId = parentId;
        }
        const created = await prisma.comment.create({
            data: {
                author: safeAuthor,
                text: text.trim(),
                likes: 0,
                parentId: safeParentId,
            },
        });
        res.status(201).json(created);
    }
    catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Failed to create comment" });
    }
};
export const likeComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(500).json({ message: "Failed to fetch comments" });
        }
        const updated = await prisma.comment.update({
            where: { id },
            data: { likes: { increment: 1 } },
        });
        res.json(updated);
    }
    catch (err) {
        console.error('likeComment error', err);
        res.status(500).json({ message: 'Failed to like comment' });
    }
};
export const toggleLike = async (req, res) => {
    try {
        const { commentId, userId } = req.body; // Read from request body
        if (!userId || !commentId) {
            return res.status(400).json({ message: "User ID and Comment ID required" });
        }
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_commentId: { userId, commentId: Number(commentId) } // Ensure commentId is number
            }
        });
        if (existingLike) {
            // Unlike: Remove like and decrement count
            await prisma.$transaction([
                prisma.like.delete({
                    where: { id: existingLike.id }
                }),
                prisma.comment.update({
                    where: { id: Number(commentId) },
                    data: { likes: { decrement: 1 } }
                })
            ]);
            return res.json({ liked: false });
        }
        // Like: Create like and increment count
        await prisma.$transaction([
            prisma.like.create({
                data: { userId, commentId: Number(commentId) }
            }),
            prisma.comment.update({
                where: { id: Number(commentId) },
                data: { likes: { increment: 1 } }
            })
        ]);
        res.json({ liked: true });
    }
    catch (err) {
        console.error('Toggle like error:', err);
        res.status(500).json({ message: 'Failed to toggle like' });
    }
};
//# sourceMappingURL=comments.controller.js.map