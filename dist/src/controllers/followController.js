"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = exports.getFollows = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getFollows = async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId;
        const type = req.query.type;
        const targetUserId = req.query.userId
            ? Number(req.query.userId)
            : loggedInUserId;
        if (!loggedInUserId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        if (!targetUserId) {
            return res.status(400).json({ status: 'error', message: 'userId tidak valid' });
        }
        // 🔥 ambil daftar following user login (untuk cek is_following)
        const myFollowing = await prisma_1.default.following.findMany({
            where: { follower_id: loggedInUserId },
            select: { following_id: true }
        });
        const myFollowingIds = myFollowing.map(f => f.following_id);
        // ===================== FOLLOWERS =====================
        if (type === 'followers') {
            const followers = await prisma_1.default.following.findMany({
                where: {
                    following_id: targetUserId
                },
                include: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true,
                        }
                    }
                }
            });
            const data = followers.map(f => ({
                id: f.follower.id,
                username: f.follower.username,
                name: f.follower.full_name,
                avatar: f.follower.photo_profile,
                is_following: myFollowingIds.includes(f.follower.id),
            }));
            return res.json({
                status: 'success',
                data: { followers: data }
            });
        }
        // ===================== FOLLOWING =====================
        else if (type === 'following') {
            const following = await prisma_1.default.following.findMany({
                where: {
                    follower_id: targetUserId
                },
                include: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true,
                        }
                    }
                }
            });
            const data = following.map(f => ({
                id: f.following.id,
                username: f.following.username,
                name: f.following.full_name,
                avatar: f.following.photo_profile,
                is_following: myFollowingIds.includes(f.following.id),
            }));
            return res.json({
                status: 'success',
                data: { following: data }
            });
        }
        else {
            return res.status(400).json({
                status: 'error',
                message: 'Query param type harus "followers" atau "following"'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
exports.getFollows = getFollows;
// ===================== FOLLOW =====================
const followUser = async (req, res) => {
    try {
        const followerId = req.user?.userId;
        const { followed_user_id } = req.body;
        if (!followerId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        if (!followed_user_id) {
            return res.status(400).json({ status: 'error', message: 'followed_user_id is required' });
        }
        if (followerId === followed_user_id) {
            return res.status(400).json({ status: 'error', message: 'Tidak bisa follow diri sendiri.' });
        }
        const existing = await prisma_1.default.following.findFirst({
            where: {
                follower_id: followerId,
                following_id: followed_user_id
            }
        });
        if (existing) {
            return res.status(400).json({ status: 'error', message: 'Kamu sudah follow user ini.' });
        }
        await prisma_1.default.following.create({
            data: {
                follower_id: followerId,
                following_id: followed_user_id
            }
        });
        return res.json({
            status: 'success',
            message: 'You have successfully followed the user.',
            data: {
                user_id: followed_user_id,
                is_following: true
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
exports.followUser = followUser;
// ===================== UNFOLLOW =====================
const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user?.userId;
        const { followed_id } = req.body;
        if (!followerId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        if (!followed_id) {
            return res.status(400).json({ status: 'error', message: 'followed_id is required' });
        }
        await prisma_1.default.following.deleteMany({
            where: {
                follower_id: followerId,
                following_id: followed_id
            }
        });
        return res.json({
            status: 'success',
            message: 'You have successfully unfollowed the user.',
            data: {
                user_id: followed_id,
                is_following: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
exports.unfollowUser = unfollowUser;
