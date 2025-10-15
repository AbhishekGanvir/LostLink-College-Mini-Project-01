import express from "express";
import Comment from "../../models/comments/comments.js";
import Post from "../../models/posts/posts.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import Notification from "../../models/notifications/notifications.js";
import User from "../../models/users/users.js";

const router = express.Router();

// ===== ADD COMMENT TO POST =====
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    // Get user info for profile picture
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new comment
    const newComment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      studentname: req.user.studentname,
      userProfilePic: { url: user.profilePic?.url || "" },
      text: req.body.text,
    });

    const savedComment = await newComment.save();

    // Get the post being commented on
    const post = await Post.findById(req.params.id);

    // Notify post owner if someone else commented
    if (post.userId.toString() !== req.user.id) {
      await Notification.create({
        userId: post.userId,
        postId: req.params.id,
        commentId: savedComment._id,
        message: `${req.user.username} commented on your post: ${post.title}`,
      });

      // Increment notification count
      await User.findByIdAndUpdate(post.userId, {
        $inc: { notificationCount: 1 },
      });
    }

    // Increment comment count on post
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET ALL COMMENTS FOR A POST =====
router.get("/:id/comment", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE COMMENT =====
router.delete("/:id/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner or admin can delete comment
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    // Delete associated notifications
    await Notification.deleteMany({ commentId: req.params.commentId });

    // Delete the comment itself
    await Comment.findByIdAndDelete(req.params.commentId);

    // Decrement comment count in post
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentCount: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
