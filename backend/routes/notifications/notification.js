import express from "express";
import Notification from "../../models/notifications/notifications.js";
import User from "../../models/users/users.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

// ===== GET /api/notifications/user/:id =====
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("postId", "title")
      .populate("commentId", "text")
      .populate("userId", "username");

    // Build dynamic messages
    const notificationsWithMessage = notifications.map((n) => ({
      _id: n._id,
      user: n.userId?.username || "Someone",
      post: n.postId?.title || "",
      comment: n.commentId?.text || "",
      createdAt: n.createdAt,
      viewed: n.viewed,
      // Build message dynamically
      message: `${n.userId?.username || "Someone"} commented: "${n.commentId?.text || ""}" on your post: ${n.postId?.title || ""}`,
    }));

    res.status(200).json(notificationsWithMessage);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});


// ===== PUT /api/notifications/user/:id/viewed =====
router.put("/user/:id/viewed", verifyToken, async (req, res) => {
  try {
    // Mark all unviewed notifications as viewed for this user
    await Notification.updateMany(
      { userId: req.params.id, viewed: false },
      { viewed: true }
    );

    // Reset user's notification count
    await User.findByIdAndUpdate(req.params.id, {
      lastViewedNotifications: new Date(),
      notificationCount: 0,
    });

    res.status(200).json({ message: "Notifications marked as viewed" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications status" });
  }
});

// ===== PUT /api/notifications/:id/view =====
router.put("/:id/view", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mark single notification as viewed
    notification.viewed = true;
    await notification.save();

    // Recalculate user's unviewed notification count
    const unviewedCount = await Notification.countDocuments({
      userId: req.user.id,
      viewed: false,
    });

    await User.findByIdAndUpdate(req.user.id, {
      notificationCount: unviewedCount,
    });

    res.status(200).json({ message: "Notification marked as viewed" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// ===== DELETE /api/notifications/:id =====
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own notifications" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    // Update user's notification count if deleted notification was unviewed
    if (!notification.viewed) {
      const unviewedCount = await Notification.countDocuments({
        userId: req.user.id,
        viewed: false,
      });

      await User.findByIdAndUpdate(req.user.id, {
        notificationCount: unviewedCount,
      });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

export default router;
