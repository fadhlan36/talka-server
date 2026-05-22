"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReply = exports.getReplies = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../config/redis"));
// Inisialisasi Antrean (Queue) untuk Reply
// const replyQueue = new Queue('reply-queue', {
//     connection: {
//         host: process.env.REDIS_HOST || '127.0.0.1',
//         port: Number(process.env.REDIS_PORT) || 6379
//     }
// });
const replyQueue = new bullmq_1.Queue("reply-queue", {
    connection: redis_1.default
});
// GET ALL REPLIES (Tetap langsung ke DB karena ini operasi Read)
const getReplies = async (req, res) => {
    try {
        const { thread_id } = req.query;
        if (!thread_id)
            return res.status(400).json({ error: "thread_id dibutuhkan" });
        const replies = await prisma_1.default.reply.findMany({
            where: { thread_id: Number(thread_id) },
            include: {
                user: {
                    select: { username: true, full_name: true, photo_profile: true }
                }
            },
            orderBy: { created_at: 'asc' }
        });
        const result = replies.map((r) => ({
            id: r.id,
            content: r.content,
            image: r.image,
            username: r.user.username,
            name: r.user.full_name,
            avatar: r.user.photo_profile,
            created_at: r.created_at
        }));
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: "Gagal memuat balasan" });
    }
};
exports.getReplies = getReplies;
// CREATE REPLY (Sekarang menggunakan Queue & Worker)
const createReply = async (req, res) => {
    try {
        const { content, thread_id } = req.body;
        const userId = req.user?.userId;
        if (!content || !thread_id) {
            return res.status(400).json({ error: "Konten dan thread_id wajib diisi" });
        }
        // Kirim data ke Antrean (Redis)
        // Data ini akan ditangkap oleh replyWorker.ts
        const newReply = await prisma_1.default.reply.create({
            data: {
                content,
                thread_id: thread_id,
                user_id: userId,
                created_by: userId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        full_name: true,
                        photo_profile: true,
                    },
                },
            },
        });
        // Berikan respon cepat ke Frontend (Status 202 = Accepted)
        return res.status(202).json({
            message: "Balasan sedang diproses dalam antrean",
            status: "processing"
        });
    }
    catch (error) {
        console.error("Queue Error:", error);
        return res.status(500).json({ error: "Gagal memproses antrean balasan" });
    }
};
exports.createReply = createReply;
