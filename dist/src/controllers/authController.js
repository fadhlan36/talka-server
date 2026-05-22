"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfile = exports.googleLogin = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                full_name,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: "User Created", id: user.id });
    }
    catch {
        res.status(400).json({ error: "Username or Email already exists" });
    }
};
exports.register = register;
// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                password: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        });
        console.log(password, user?.password);
        if (!user || !user.password || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                photo_profile: user.photo_profile,
                // 🔥 FIX UTAMA (SWAP)
                followers: user._count.following,
                following: user._count.followers,
                bio: user.bio
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
// ================= GOOGLE LOGIN =================
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            return res.status(400).json({ error: "Invalid Google Token" });
        const { email, name, picture } = payload;
        let user = await prisma_1.default.user.findUnique({
            where: { email: email },
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
        // kalau belum ada → buat
        if (!user) {
            const baseUsername = email?.split('@')[0].toLowerCase();
            user = await prisma_1.default.user.create({
                data: {
                    email: email,
                    full_name: name,
                    username: `${baseUsername}${Math.floor(Math.random() * 1000)}`,
                    photo_profile: picture,
                },
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
        }
        const talkaToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({
            token: talkaToken,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                photo_profile: user.photo_profile,
                // 🔥 FIX UTAMA (SWAP)
                followers: user._count.following,
                following: user._count.followers,
                bio: user.bio
            }
        });
    }
    catch {
        res.status(500).json({ error: "Google Authentication Failed" });
    }
};
exports.googleLogin = googleLogin;
// ================= EDIT PROFILE =================
const editProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { full_name, bio, username } = req.body;
        const photo_profile = req.file ? req.file.filename : undefined;
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                full_name,
                bio,
                username,
                ...(photo_profile && { photo_profile }),
            },
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
        return res.json({
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                full_name: updatedUser.full_name,
                photo_profile: updatedUser.photo_profile,
                // 🔥 FIX UTAMA (SWAP)
                followers: updatedUser._count.following,
                following: updatedUser._count.followers,
                bio: updatedUser.bio,
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.editProfile = editProfile;
