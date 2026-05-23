import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import path from "path";

// Import routes
// import userRoutes from "./routes/user.route";

// Import middleware
import { notFound, errorHandler } from "./middlewares";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import authRoutes from "./routes/authRoutes";
import replyRoutes from "./routes/replyRoute";
import followRoutes from "./routes/followRoutes";
import searchRoutes from "./routes/searchRoutes";
import threadRoutes from "./routes/threadRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(
  "/public",
  express.static(path.join(process.cwd(), "dist", "src", "public")),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/thread", threadRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/reply", replyRoutes);
app.use("/api/v1/follows", followRoutes);

// Error handling middleware (harus di akhir)
app.use(notFound);
app.use(errorHandler);

export default app;
