import express from "express";
import bcrypt from "bcryptjs";

import User from "../../models/users/users.js";
import Post from "../../models/posts/posts.js";
import Comment from "../../models/comments/comments.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.js";
import { verifyToken, verifyTokenAndAdmin } from "../../middleware/verifyToken.js";

const router = express.Router();


const ensureAdmin = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin || user.verificationStatus !== "verified") {
    res.status(403).json({ message: "Access denied! Admins only." });
    return null;
  }
  return user;
};


 // Get all users
   
router.get("/users", verifyToken, async (req, res) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: err.message });
  }
});


   // Get system stats
   
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const stats = {
      users: await User.countDocuments(),
      totalPosts: await Post.countDocuments(),
      resolvedPosts: await Post.countDocuments({ status: "resolved" }),
      unresolvedPosts: await Post.countDocuments({ status: "unresolved" }),
      totalComments: await Comment.countDocuments(),
    };
    res.status(200).json(stats);
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});


   // Delete a specific user (with their content)
   
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Prevent admin from deleting themselves
    if (admin._id.toString() === req.params.id) {
      return res.status(403).json({ message: "Admins cannot delete their own account" });
    }

    // Delete user's profile picture
    if (targetUser.profilePic?.publicId) {
      await deleteFromCloudinary(targetUser.profilePic.publicId);
    }

    // Delete user's posts, comments, and related images
    const userPosts = await Post.find({ userId: targetUser._id });
    for (const post of userPosts) {
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }
      await Comment.deleteMany({ postId: post._id });
    }

    await Post.deleteMany({ userId: targetUser._id });
    await Comment.deleteMany({ userId: targetUser._id });
    await User.findByIdAndDelete(targetUser._id);

    res.status(200).json({ message: "User and all related data deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Delete all posts & comments (Admin cleanup) 
router.delete("/cleanup", verifyToken, async (req, res) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const posts = await Post.find();
    for (const post of posts) {
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    await Comment.deleteMany();
    await Post.deleteMany();

    res.status(200).json({ message: "All posts and comments deleted successfully" });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ error: err.message });
  }
});
  

export default router;
