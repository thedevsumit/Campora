const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: [
      "event_approval", "event_rejection", "event_reminder",
      "booking_approved", "booking_rejected", "booking_reminder",
      "club_approved", "club_rejected", "club_invite",
      "dm_request", "dm_received",
      "chat_request_accepted", "chat_request_rejected",
      "announcement", "role_change", "system"
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedClub: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  relatedChat: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
  actionUrl: { type: String },
  actionLabel: { type: String },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
  inApp: { type: Boolean, default: true },
  emailSent: { type: Boolean, default: false },
  expiresAt: { type: Date },
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
