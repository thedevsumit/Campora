const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ["text", "image", "file", "system"], default: "text" },
  fileUrl: { type: String },
  fileName: { type: String },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emoji: { type: String },
  }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date }
  }],
}, { timestamps: true });

chatMessageSchema.index({ room: 1, createdAt: -1 });
chatMessageSchema.index({ room: 1, sender: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
