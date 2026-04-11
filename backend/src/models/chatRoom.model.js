const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: { type: String },
  type: {
    type: String,
    enum: ["direct", "group", "event", "project", "club"],
    required: true
  },
  contextType: { type: String, enum: ["event", "project", "resource", null] },
  contextId: { type: mongoose.Schema.Types.ObjectId, refPath: "contextModel" },
  contextModel: { type: String },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["member", "admin", "moderator"], default: "member" },
    joinedAt: { type: Date, default: Date.now },
    isPinned: { type: Boolean, default: false },
    lastReadAt: { type: Date },
  }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  isArchived: { type: Boolean, default: false },
  allowMemberInvite: { type: Boolean, default: true },
  requireApproval: { type: Boolean, default: false },
  description: { type: String },
  avatar: { type: String },
  lastMessage: {
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sentAt: { type: Date },
  },
  unreadCount: { type: Map, of: Number, default: {} },
}, { timestamps: true });

chatRoomSchema.index({ "members.user": 1 });
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ type: 1, contextType: 1, contextId: 1 });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
