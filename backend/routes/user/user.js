import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/users/users.js";
import Post from "../../models/posts/posts.js";
import Comment from "../../models/comments/comments.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

//  GET STATS (All users)
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalPosts = await Post.countDocuments({ userId });
    const resolvedPosts = await Post.countDocuments({
      userId,
      status: "resolved",
    });
    const unresolvedPosts = await Post.countDocuments({
      userId,
      status: "unresolved",
    });
    const totalComments = await Comment.countDocuments({ userId });

    res.status(200).json({
      totalPosts,
      resolvedPosts,
      unresolvedPosts,
      totalComments,
    });
  } catch (err) {
    console.error("User stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE USER (Admin or Self)
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent admin from deleting their own account
    if (req.user.isAdmin && req.user.id === req.params.id) {
      return res
        .status(403)
        .json({ message: "Admin cannot delete their own account" });
    }

    // Prevent normal users from deleting others
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }

    // Delete profile picture if exists
    if (user.profilePic?.publicId) {
      await deleteFromCloudinary(user.profilePic.publicId);
    }

    // 1️⃣ Remove user’s comments from posts
    const postsWithUserComments = await Post.find({
      "comments.commenterId": user._id,
    });

    for (const post of postsWithUserComments) {
      const userCommentCount = post.comments.filter(
        (comment) => comment.commenterId.toString() === user._id.toString()
      ).length;

      await Post.findByIdAndUpdate(post._id, {
        $pull: { comments: { commenterId: user._id } },
        $inc: { commentCount: -userCommentCount },
      });
    }

    // 2️⃣ Delete user’s posts and images
    const userPosts = await Post.find({ userId: user._id });
    for (const post of userPosts) {
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }
      await Comment.deleteMany({ postId: post._id });
    }

    // 3️⃣ Remove user-related data
    await Post.deleteMany({ userId: user._id });
    await Comment.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Account and all associated content deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});
// Get User By ID*
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
