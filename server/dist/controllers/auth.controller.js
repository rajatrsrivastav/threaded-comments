import {} from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Handle Google OAuth - receive user data from frontend
export const googleAuth = async (req, res) => {
    try {
        const { id, email, displayName, photoURL } = req.body;
        // Validate required fields
        if (!id || !email || !displayName) {
            return res.status(400).json({
                message: 'Missing required fields: id, email, displayName'
            });
        }
        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { id }
        });
        if (user) {
            // Update existing user
            user = await prisma.user.update({
                where: { id },
                data: {
                    email,
                    displayName,
                    photoURL
                }
            });
        }
        else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    id,
                    email,
                    displayName,
                    photoURL
                }
            });
        }
        // Return user data to frontend
        res.status(200).json({
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        });
    }
    catch (err) {
        console.error('Google auth error:', err);
        res.status(500).json({ message: 'Authentication failed' });
    }
};
//# sourceMappingURL=auth.controller.js.map