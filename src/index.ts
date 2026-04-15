import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import threadRoutes from './routes/threadRoutes';
import replyRoutes from './routes/replyRoute';
import followRoutes from './routes/followRoutes'

dotenv.config();
const app = express();
const httpServer = createServer(app);

// 1. Inisialisasi Socket.io dan Export agar bisa dipakai Worker
export const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" }
});

// 2. IMPORT WORKER SETELAH IO DI-EXPORT
// Ini penting agar worker tidak mendapatkan object 'io' yang undefined
import './workers/threadWorker';
import './workers/replyWorker'; //

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.set('io', io);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/thread', threadRoutes);
app.use('/api/v1/reply', replyRoutes);
app.use("/api/v1/follows", followRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));