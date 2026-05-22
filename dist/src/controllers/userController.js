"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedUsers = exports.getUserByUsername = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await prisma_1.default.user.findUnique({
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
        if (!user)
            return res.status(404).json({ error: "User tidak ditemukan" });
        return res.json({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            photo_profile: user.photo_profile,
            bio: user.bio,
            followers: user._count.following,
            following: user._count.followers,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getUserByUsername = getUserByUsername;
// Suggestion user
const getSuggestedUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId;
        // Ambil semua ID yang sudah difollow
        const following = await prisma_1.default.following.findMany({
            where: { follower_id: loggedInUserId },
            select: { following_id: true }
        });
        const followingIds = following.map(f => f.following_id);
        // Exclude diri sendiri dan yang sudah difollow
        const suggestedUsers = await prisma_1.default.user.findMany({
            where: {
                AND: [
                    { id: { not: loggedInUserId } }, // bukan diri sendiri
                    { id: { notIn: followingIds.length > 0 ? followingIds : [-1] } } // belum difollow
                ]
            },
            select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                _count: {
                    select: { followers: true }
                }
            },
            take: 5,
            orderBy: {
                followers: { _count: 'desc' } // tampilkan yang paling banyak follower
            }
        });
        const data = suggestedUsers.map(u => ({
            id: u.id,
            username: u.username,
            name: u.full_name,
            avatar: u.photo_profile,
            followers: u._count.followers,
        }));
        return res.json({ status: 'success', data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getSuggestedUsers = getSuggestedUsers;
