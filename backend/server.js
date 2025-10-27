import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Needed to fix __dirname in ES modules



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



// --- Start Server ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

