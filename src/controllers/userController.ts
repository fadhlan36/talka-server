import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getUserByUsername = async (req: AuthRequest, res: Response) => {
    try {
        const username = req.params.username as string; // ← cast di sini

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        });

        if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

        return res.json({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            photo_profile: user.photo_profile,
            bio: user.bio,
            followers: user._count.following,
            following: user._count.followers,
        });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};