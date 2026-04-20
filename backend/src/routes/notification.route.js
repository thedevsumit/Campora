const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const Notification = require("../models/notification.model");

const router = express.Router();

// Get user's notifications
router.get("/", protectRoute, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const filter = { recipient: req.user._id };
    if (unreadOnly === "true") filter.isRead = false;
    const notifications = await Notification.find(filter)
      .populate("sender", "fullName profilePic")
      .populate("relatedClub", "clubName")
      .populate("relatedEvent", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Notification.countDocuments(filter);
    return res.status(200).json({ notifications, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get unread count
router.get("/unread-count", protectRoute, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Mark as read
router.put("/:notifId/read", protectRoute, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notifId, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Mark all as read
router.put("/read-all", protectRoute, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Clear all notifications - MUST come before /:notifId route
router.delete("/clear-all", protectRoute, async (req, res) => {
  try {
    const result = await Notification.deleteMany({ recipient: req.user._id });
    console.log(`Cleared ${result.deletedCount} notifications for user ${req.user._id}`);
    return res.status(200).json({
      message: "All notifications cleared",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("clearAllNotifications error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete single notification - MUST come after /clear-all
router.delete("/:notifId", protectRoute, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.notifId, recipient: req.user._id });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("deleteNotification error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Send notification (internal use)
router.post("/send", async (req, res) => {
  try {
    const { recipient, sender, type, title, message, relatedClub, relatedEvent, relatedBooking, actionUrl, actionLabel } = req.body;
    const notification = await Notification.create({
      recipient, sender, type, title, message, relatedClub, relatedEvent, relatedBooking, actionUrl, actionLabel
    });
    const io = req.app.get("io");
    if (io) {
      io.to(recipient.toString()).emit("receiveNotification", notification);
    }
    return res.status(201).json({ message: "Notification sent", notification });
  } catch (error) {
    console.error("sendNotification error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
