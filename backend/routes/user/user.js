import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/users/users.js";
import Post from "../../models/posts/posts.js";
import Comment from "../../models/comments/comments.js";
import upload from "../../middleware/uploadimages.js"
import { deleteFromCloudinary,uploadToCloudinary } from "../../utils/cloudinary.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();


//  GET STATS (All users)
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalPosts = await Post.countDocuments({ userId });
    const resolvedPosts = await Post.countDocuments({
      userId,
      status: "RESOLVED",
    });
    const unresolvedPosts = await Post.countDocuments({
      userId,
      status: "UNRESOLVED",
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

// UPDATE USER (Edit Profile)
router.put(
  "/edit/:id",
  verifyToken,
  upload.single("profilePic"), // same middleware as post/profile upload
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Only allow self or admin
      if (req.user.id !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized to update this user" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { studentname, email, password, college_year, department } = req.body;

      if (studentname) user.studentname = studentname;
      if (email) user.email = email;
      if (college_year) user.college_year = college_year;
      if (department) user.department = department;

      // Password update
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      // Profile picture update
      if (req.file) {
        // Delete old picture
        if (user.profilePic?.publicId) {
          await deleteFromCloudinary(user.profilePic.publicId);
        }

        // Upload new picture
        const uploaded = await uploadToCloudinary(req.file, "profile-pics");
        user.profilePic = {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        };
      }

      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
