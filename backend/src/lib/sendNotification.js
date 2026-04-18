const Notification = require("../models/notification.model");

/**
 * Create an in-app notification and emit via socket.io
 * Deduplicates within a 10-second window to prevent double notifications.
 */
const sendNotification = async ({
  app,
  recipient,
  sender,
  type,
  title,
  message,
  relatedClub,
  relatedEvent,
  relatedBooking,
  actionUrl,
  actionLabel,
}) => {
  try {
    // Deduplicate: don't create a duplicate notification for same sender+recipient+type+message within 10s
    const recentDuplicate = await Notification.findOne({
      recipient,
      sender,
      type,
      message,
      createdAt: { $gte: new Date(Date.now() - 10000) },
    });

    if (recentDuplicate) {
      return recentDuplicate;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedClub,
      relatedEvent,
      relatedBooking,
      actionUrl,
      actionLabel,
    });

    // Populate for socket emit
    await notification.populate("sender", "fullName profilePic");

    const io = app.get("io");
    if (io) {
      io.to(recipient.toString()).emit("receiveNotification", notification);
    }

    return notification;
  } catch (err) {
    console.error("sendNotification error:", err);
    // Don't throw — notification failure shouldn't break the main action
  }
};

module.exports = sendNotification;