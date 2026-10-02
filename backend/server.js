import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./src/config/index.js";
import {
  connectDB,
  isDatabaseConnected,
  getDatabaseState,
} from "./src/config/database.js";
import { seedAll } from "./src/db/seedData.js";

// Route imports
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import quizRoutes from "./src/routes/quizRoutes.js";
import dailyChallengeRoutes from "./src/routes/dailyChallengeRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";
import badgeRoutes from "./src/routes/badgeRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import learningPathRoutes from "./src/routes/learningPathRoutes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./src/middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, postman, mobile apps)
      if (!origin) return callback(null, true);
      const allowed = [
        config.clientOrigin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];
      if (allowed.includes(origin) || config.clientOrigin === "*") {
        return callback(null, true);
      }
      return callback(null, true); // Allow locally
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Welcome & Health check
app.get("/", (req, res) => {
  res.json({
    name: "EduPlay: UnityLearn API Server",
    status: "online",
    version: "1.0.0",
    documentation: "/api/health",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      courses: "/api/courses",
      quiz: "/api/quiz",
      dailyChallenge: "/api/daily-challenge",
      leaderboard: "/api/leaderboard",
      badges: "/api/badges",
      analytics: "/api/analytics",
      notifications: "/api/notifications",
      games: "/api/games",
      learningPaths: "/api/learning-paths",
    },
  });
});

app.get("/api/health", (req, res) => {
  const isConnected = isDatabaseConnected();
  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    server: "running",
    database: getDatabaseState(),
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    environment: config.nodeEnv,
    port: config.port,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/daily-challenge", dailyChallengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/learning-paths", learningPathRoutes);

// Fallbacks
app.use(notFoundHandler);
app.use(errorHandler);

// Connect DB first, seed initial data, then start server
async function startServer() {
  try {
    console.log("🔄 Connecting to MongoDB database...");
    await connectDB();

    console.log("🌱 Seeding / verifying initial database records...");
    await seedAll();
    console.log("✅ Database verified and ready.");

    app.listen(config.port, () => {
      console.log(`\n==================================================`);
      console.log(
        `🚀 EduPlay API Backend running at: http://localhost:${config.port}`,
      );
      console.log(`📡 Ready for frontend requests from ${config.clientOrigin}`);
      console.log(
        `🩺 Health check: http://localhost:${config.port}/api/health`,
      );
      console.log(`==================================================\n`);
    });
  } catch (err) {
    console.error("❌ FATAL: Backend startup failed:", err.message);
    process.exit(1);
  }
}

startServer();
