import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes';
import threadRoutes from './routes/threadRoutes';
import replyRoutes from './routes/replyRoute';
import followRoutes from './routes/followRoutes';
import userRoutes from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    '/public',
    express.static(
        path.join(
            process.cwd(),
            'dist',
            'src',
            'public'
        )
    )
);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/thread', threadRoutes);
app.use('/api/v1/reply', replyRoutes);
app.use('/api/v1/follows', followRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/search', searchRoutes);

const PORT = process.env.PORT || 5000;

export default app;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );
});