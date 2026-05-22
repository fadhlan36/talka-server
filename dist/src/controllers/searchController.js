"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({
                status: 'error',
                message: 'Keyword tidak boleh kosong.'
            });
        }
        const users = await prisma_1.default.user.findMany({
            where: {
                OR: [
                    { username: { contains: keyword, mode: 'insensitive' } },
                    { full_name: { contains: keyword, mode: 'insensitive' } },
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
            take: 20,
        });
        const data = users.map(u => ({
            id: u.id,
            username: u.username,
            name: u.full_name,
            avatar: u.photo_profile,
            followers: u._count.followers,
        }));
        return res.json({
            status: 'success',
            data: { users: data }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user data. Please try again later.'
        });
    }
};
exports.searchUsers = searchUsers;
