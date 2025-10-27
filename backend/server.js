import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Needed to fix __dirname in ES modules

// --- Fix __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

dotenv.config();
const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());




// --- API ROUTES ---
import authRoutes from "./routes/auth/auth.js";
import adminRoutes from "./routes/admin/admin.js";
import postRoutes from "./routes/post/post.js";
import userRoutes from "./routes/user/user.js";
import notificationsRoutes from "./routes/notifications/notification.js";
import commentRoutes from "./routes/comments/comment.js";
import uploadRoutes from "./routes/upload/upload.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationsRoutes);
app.use("/api/post", commentRoutes);
app.use("/api/upload", uploadRoutes);

// --- MongoDB CONNECTION ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Production frontend (SPA) ---
if (process.env.NODE_ENV === "production") {
  // Correct path: move from backend/ to root/frontend/dist
 app.use(express.static(path.join(__dirname,"/frontend/dist")))

  // SPA fallback for non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath,"frontend", "dist", "index.html"));
  });
}

// --- Start Server ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

