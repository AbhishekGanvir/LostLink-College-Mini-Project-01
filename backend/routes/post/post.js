import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";

import Post from "../../models/posts/posts.js";
import User from "../../models/users/users.js";
import Comment from "../../models/comments/comments.js";
import Notification from "../../models/notifications/notifications.js";
import { verifyToken, verifyTokenAndAdmin } from "../../middleware/verifyToken.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";

const router = express.Router();

// Multer memory storage 
const upload = multer({ storage: multer.memoryStorage() }).array("images", 3); // Max 3 images

// CREATE POST 
router.post("/", verifyToken, (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error uploading files" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const uploadedImages = [];
      if (req.files) {
        for (const file of req.files) {
          const result = await uploadToCloudinary(file, "posts");
          uploadedImages.push({ url: result.secure_url, publicId: result.public_id });
        }
      }

      const tags = req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [];

      const newPost = new Post({
        userId: req.user.id,
        studentname: req.user.studentname,
        userProfilePic: { url: user.profilePic?.url || "" },
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        college_year: req.body.college_year,
        department: req.body.department,
        itemType: req.body.itemType,
        images: uploadedImages,
        tags,
        status: "UNRESOLVED",
      });

      const savedPost = await newPost.save();

      // Update user counts
      await User.findByIdAndUpdate(req.user.id, { $inc: { postCount: 1, unresolvedCount: 1 } });

      res.status(201).json(savedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePic verificationStatus isAdmin")
      .lean();

    // Ensure userId is always an object with _id as string
    posts = posts.map((post) => ({
      ...post,
      userId: post.userId
        ? {
            _id: post.userId._id.toString(),
            username: post.userId.username,
            profilePic: post.userId.profilePic,
            verificationStatus: post.userId.verificationStatus,
            isAdmin: post.userId.isAdmin, 
          }
        : { _id: post.userId?.toString() || null },
    }));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
;



// GET USER POSTS (public)
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
  .sort({ createdAt: -1 })
  .populate("userId", "username profilePic verificationStatus")
  .lean();

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET SINGLE POST 
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.views += 1;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE POST
router.put("/:id", verifyToken, upload, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own posts" });
    }

    // ---------- 1️⃣ Parse and handle existing images ----------
    let updatedImages = [];

    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        // Ensure valid format
        updatedImages = existingImages
          .filter((img) => img && img.url && img.publicId)
          .map((img) => ({ url: img.url, publicId: img.publicId }));

        // Delete images removed by the user
        for (const image of post.images) {
          if (!updatedImages.find((img) => img.publicId === image.publicId)) {
            await deleteFromCloudinary(image.publicId);
          }
        }
      } catch (err) {
        console.warn("Error parsing existingImages:", err);
      }
    }

    // ---------- 2️⃣ Upload new images to Cloudinary ----------
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file, "posts");
        updatedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // ---------- 3️⃣ Prepare safe update data ----------
    const updateData = { ...req.body };

    // Tags
    if (updateData.tags) {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch {
        updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
      }
    }

    // Enforce uppercase enums
    if (updateData.itemType)
      updateData.itemType = updateData.itemType.toUpperCase();
    if (updateData.status)
      updateData.status = updateData.status.toUpperCase();

    // Ensure valid status
    if (!["RESOLVED", "UNRESOLVED"].includes(updateData.status)) {
      updateData.status = "UNRESOLVED";
    }

    // Clean extra fields
    delete updateData.existingImages;

    // Apply new images
    updateData.images = updatedImages;

    // ---------- 4️⃣ Save update ----------
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("userId", "username profilePic");

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE POST 
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    const update = { $inc: { postCount: -1, [post.status === "RESOLVED" ? "resolvedCount" : "unresolvedCount"]: -1 } };
    await User.findByIdAndUpdate(post.userId, update);

    for (const image of post.images) await deleteFromCloudinary(image.publicId);
    await Comment.deleteMany({ postId: req.params.id });
    await Notification.deleteMany({ postId: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
