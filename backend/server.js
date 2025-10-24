import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/auth/auth.js";
import adminRoutes from "./routes/admin/admin.js";
import postRoutes from "./routes/post/post.js";
import userRoutes from "./routes/user/user.js";
import notificationsRoutes from "./routes/notifications/notification.js";
import commentRoutes from "./routes/comments/comment.js";
import uploadRoutes from "./routes/upload/upload.js";

dotenv.config();
const app = express();

//Middleware
app.use(express.json());

app.use(cors());

//API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationsRoutes);
app.use("/api/post", commentRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LostLink API is running..." });
});

//  404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB (Local)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//  START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}`);
});
