const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const ChatRoom = require("../models/chatRoom.model");
const ChatMessage = require("../models/chatMessage.model");
const Notification = require("../models/notification.model");

const router = express.Router();

// Create chatroom
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, type, contextType, contextId, contextModel, members, description, avatar } = req.body;
    const chatRoom = await ChatRoom.create({
      name,
      type,
      contextType,
      contextId,
      contextModel,
      description,
      avatar,
      members: [
        { user: req.user._id, role: "admin" },
        ...(members?.map(m => ({ user: m, role: "member" })) || [])
      ]
    });
    return res.status(201).json({ message: "Chat room created", chatRoom });
  } catch (error) {
    console.error("createChatRoom error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get user's chatrooms
router.get("/", protectRoute, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { "members.user": req.user._id, isArchived: false };
    if (type) filter.type = type;
    const rooms = await ChatRoom.find(filter)
      .populate("members.user", "fullName profilePic")
      .populate("lastMessage.sender", "fullName")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("getChatRooms error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get chatroom by ID
router.get("/:roomId", protectRoute, async (req, res) => {
  try {
    const room = await ChatRoom.findOne({
      _id: req.params.roomId,
      "members.user": req.user._id
    })
      .populate("members.user", "fullName profilePic")
      .populate("club", "clubName");
    if (!room) return res.status(404).json({ message: "Chat room not found" });
    return res.status(200).json({ room });
  } catch (error) {
    console.error("getChatRoomById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update chatroom
router.put("/:roomId", protectRoute, async (req, res) => {
  try {
    const { name, description, avatar, allowMemberInvite, requireApproval } = req.body;
    const room = await ChatRoom.findOneAndUpdate(
      { _id: req.params.roomId, "members.user": req.user._id, "members.role": "admin" },
      { name, description, avatar, allowMemberInvite, requireApproval },
      { new: true }
    ).populate("members.user", "fullName profilePic");
    if (!room) return res.status(404).json({ message: "Chat room not found or not authorized" });
    return res.status(200).json({ message: "Chat room updated", room });
  } catch (error) {
    console.error("updateChatRoom error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Archive chatroom
router.delete("/:roomId", protectRoute, async (req, res) => {
  try {
    const room = await ChatRoom.findOneAndUpdate(
      { _id: req.params.roomId, "members.user": req.user._id, "members.role": "admin" },
      { isArchived: true },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Chat room not found or not authorized" });
    return res.status(200).json({ message: "Chat room archived" });
  } catch (error) {
    console.error("archiveChatRoom error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add member
router.post("/:roomId/members", protectRoute, async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await ChatRoom.findOne({ _id: req.params.roomId, "members.user": req.user._id });
    if (!room) return res.status(404).json({ message: "Chat room not found" });
    const existingMember = room.members.find(m => m.user.toString() === userId);
    if (existingMember) return res.status(400).json({ message: "User already a member" });
    room.members.push({ user: userId, role: "member" });
    await room.save();
    const updated = await ChatRoom.findById(req.params.roomId).populate("members.user", "fullName profilePic");
    return res.status(200).json({ message: "Member added", room: updated });
  } catch (error) {
    console.error("addMember error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Remove member
router.delete("/:roomId/members/:userId", protectRoute, async (req, res) => {
  try {
    const room = await ChatRoom.findOneAndUpdate(
      { _id: req.params.roomId, "members.user": req.user._id, "members.role": { $in: ["admin", "moderator"] } },
      { $pull: { members: { user: req.params.userId } } },
      { new: true }
    ).populate("members.user", "fullName profilePic");
    if (!room) return res.status(404).json({ message: "Chat room not found or not authorized" });
    return res.status(200).json({ message: "Member removed", room });
  } catch (error) {
    console.error("removeMember error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Change member role
router.put("/:roomId/members/:userId/role", protectRoute, async (req, res) => {
  try {
    const { role } = req.body;
    const room = await ChatRoom.findOne({ _id: req.params.roomId, "members.user": req.user._id, "members.role": "admin" });
    if (!room) return res.status(404).json({ message: "Chat room not found or not authorized" });
    const member = room.members.find(m => m.user.toString() === req.params.userId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    member.role = role;
    await room.save();
    const updated = await ChatRoom.findById(req.params.roomId).populate("members.user", "fullName profilePic");
    return res.status(200).json({ message: "Role updated", room: updated });
  } catch (error) {
    console.error("changeMemberRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get messages (paginated)
router.get("/:roomId/messages", protectRoute, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const room = await ChatRoom.findOne({ _id: req.params.roomId, "members.user": req.user._id });
    if (!room) return res.status(404).json({ message: "Chat room not found" });
    const messages = await ChatMessage.find({ room: req.params.roomId, isDeleted: false })
      .populate("sender", "fullName profilePic")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await ChatMessage.countDocuments({ room: req.params.roomId, isDeleted: false });
    return res.status(200).json({ messages: messages.reverse(), total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/:roomId/messages", protectRoute, async (req, res) => {
  try {
    const { content, messageType, fileUrl, fileName, replyTo } = req.body;
    const room = await ChatRoom.findOne({ _id: req.params.roomId, "members.user": req.user._id });
    if (!room) return res.status(404).json({ message: "Chat room not found" });
    const message = await ChatMessage.create({
      room: req.params.roomId,
      sender: req.user._id,
      content,
      messageType: messageType || "text",
      fileUrl,
      fileName,
      replyTo
    });
    const populated = await ChatMessage.findById(message._id).populate("sender", "fullName profilePic");
    room.lastMessage = { content: content.substring(0, 100), sender: req.user._id, sentAt: new Date() };
    await room.save();
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.roomId).emit("receiveMessage", populated);
    }
    return res.status(201).json({ message: populated });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Edit message
router.put("/:roomId/messages/:msgId", protectRoute, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await ChatMessage.findOneAndUpdate(
      { _id: req.params.msgId, sender: req.user._id },
      { content, isEdited: true, editedAt: new Date() },
      { new: true }
    ).populate("sender", "fullName profilePic");
    if (!message) return res.status(404).json({ message: "Message not found or not authorized" });
    return res.status(200).json({ message });
  } catch (error) {
    console.error("editMessage error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete message
router.delete("/:roomId/messages/:msgId", protectRoute, async (req, res) => {
  try {
    const message = await ChatMessage.findOneAndUpdate(
      { _id: req.params.msgId, sender: req.user._id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found or not authorized" });
    return res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("deleteMessage error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add reaction
router.post("/:roomId/messages/:msgId/reactions", protectRoute, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await ChatMessage.findById(req.params.msgId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    const existingReaction = message.reactions.find(r => r.user.toString() === req.user._id.toString());
    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      message.reactions.push({ user: req.user._id, emoji });
    }
    await message.save();
    const updated = await ChatMessage.findById(message._id).populate("sender", "fullName profilePic");
    return res.status(200).json({ message: updated });
  } catch (error) {
    console.error("addReaction error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Mark as read
router.put("/:roomId/read", protectRoute, async (req, res) => {
  try {
    const room = await ChatRoom.findOne({ _id: req.params.roomId, "members.user": req.user._id });
    if (!room) return res.status(404).json({ message: "Chat room not found" });
    const member = room.members.find(m => m.user.toString() === req.user._id.toString());
    if (member) {
      member.lastReadAt = new Date();
      room.unreadCount.set(req.user._id.toString(), 0);
      await room.save();
    }
    return res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
