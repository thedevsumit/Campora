const PrivateMessage = require("../models/privateMessage.model");
const ChatRequest = require("../models/chatRequest.model");
const BlockedUser = require("../models/blockedUser.model");
const mongoose = require("mongoose");
const sendNotification = require("../lib/sendNotification");
const { uploadToCloudinary } = require("../middleware/multer.middleware");

// 🔑 utility: consistent chatId
const getChatId = (a, b) => [a.toString(), b.toString()].sort().join("_");

// ✅ verify chat permission
const isChatAccepted = async (userA, userB) => {
  const request = await ChatRequest.findOne({
    $or: [
      { sender: userA, receiver: userB, status: "accepted" },
      { sender: userB, receiver: userA, status: "accepted" },
    ],
  });

  return !!request;
};

// 🆕 Ensure an accepted chat exists between two users (auto-creates if not)
// Used for booking-confirmed → direct-DM flow where no chat request permission is needed
const ensureAcceptedChat = async (userA, userB) => {
  const existing = await ChatRequest.findOne({
    $or: [
      { sender: userA, receiver: userB, status: "accepted" },
      { sender: userB, receiver: userA, status: "accepted" },
    ],
  });
  if (existing) return existing;

  return await ChatRequest.create({
    sender: userA,
    receiver: userB,
    status: "accepted",
  });
};

// 🔒 Check if user is blocked
const isBlocked = async (userA, userB) => {
  const block = await BlockedUser.findOne({
    $or: [
      { blocker: userA, blocked: userB },
      { blocker: userB, blocked: userA },
    ],
  });
  return !!block;
};

// ================== GET MESSAGES ==================
const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const allowed = await isChatAccepted(senderId, receiverId);
    if (!allowed) {
      return res.status(403).json({
        message: "Chat request not accepted",
      });
    }

    const chatId = getChatId(senderId, receiverId);

    // 🔥 POPULATE sender & receiver
    const messages = await PrivateMessage.find({ chatId })
      .populate("sender", "fullName profilePic")
      .populate("receiver", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error("❌ getMessages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// ================== SEND MESSAGE ==================
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message is empty" });
    }

    const allowed = await isChatAccepted(senderId, receiverId);
    if (!allowed) {
      return res.status(403).json({
        message: "Chat request not accepted",
      });
    }

    const chatId = getChatId(senderId, receiverId);

    // ✅ CREATE MESSAGE
    let message = await PrivateMessage.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    // 🔥 POPULATE BEFORE EMIT
    message = await message.populate("sender", "fullName profilePic");

    // 🔥 SOCKET.IO EMIT
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("receiveMessage", message);

    // 🔔 IN-APP NOTIFICATION
    const preview = content.length > 50 ? content.substring(0, 50) + "..." : content;
    await sendNotification({
      app: req.app,
      recipient: receiverId,
      sender: senderId,
      type: "dm_received",
      title: `New message from ${req.user.fullName}`,
      message: preview,
      actionUrl: `/chat/${senderId.toString()}`,
      actionLabel: "Reply",
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error("❌ sendMessage error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// ================== GET CONVERSATIONS ==================
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get blocked users
    const blockedUsers = await BlockedUser.find({
      $or: [{ blocker: userId }, { blocked: userId }],
    });
    const blockedIds = blockedUsers.map(b =>
      b.blocker.toString() === userId.toString() ? b.blocked.toString() : b.blocker.toString()
    );

    const requests = await ChatRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "fullName profilePic");

    const userMap = new Map();

    requests.forEach((r) => {
      const otherUser =
        r.sender._id.toString() === userId.toString() ? r.receiver : r.sender;

      // Skip blocked users
      if (!blockedIds.includes(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), otherUser);
      }
    });

    res.json({ users: Array.from(userMap.values()) });
  } catch (err) {
    console.error("❌ getConversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

// ================== SEND IMAGE MESSAGE ==================
const sendImageMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const { content } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Check if blocked
    const blocked = await isBlocked(senderId, receiverId);
    if (blocked) {
      return res.status(403).json({ message: "You cannot message this user" });
    }

    const allowed = await isChatAccepted(senderId, receiverId);
    if (!allowed) {
      return res.status(403).json({ message: "Chat request not accepted" });
    }

    const chatId = getChatId(senderId, receiverId);

    const result = await uploadToCloudinary(req.file.path);

    // ✅ CREATE MESSAGE
    let message = await PrivateMessage.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      content: content || "📷 Image",
      imageUrl: result.secure_url,
      isImage: true,
    });

    // 🔥 POPULATE BEFORE EMIT
    message = await message.populate("sender", "fullName profilePic");

    // 🔥 SOCKET.IO EMIT
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("receiveMessage", message);

    // 🔔 IN-APP NOTIFICATION
    await sendNotification({
      app: req.app,
      recipient: receiverId,
      sender: senderId,
      type: "dm_received",
      title: `New image from ${req.user.fullName}`,
      message: "Sent you a photo",
      actionUrl: `/chat/${senderId.toString()}`,
      actionLabel: "View",
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error("❌ sendImageMessage error:", err);
    res.status(500).json({ message: "Failed to send image" });
  }
};

// ================== BLOCK USER ==================
const blockUser = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blockedId = req.params.userId;

    if (blockerId.toString() === blockedId) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }

    // Check if already blocked
    const existing = await BlockedUser.findOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (existing) {
      return res.status(400).json({ message: "User already blocked" });
    }

    await BlockedUser.create({
      blocker: blockerId,
      blocked: blockedId,
    });

    res.status(200).json({ message: "User blocked successfully" });
  } catch (err) {
    console.error("❌ blockUser error:", err);
    res.status(500).json({ message: "Failed to block user" });
  }
};

// ================== UNBLOCK USER ==================
const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blockedId = req.params.userId;

    const result = await BlockedUser.deleteOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User was not blocked" });
    }

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error("❌ unblockUser error:", err);
    res.status(500).json({ message: "Failed to unblock user" });
  }
};

// ================== GET BLOCKED USERS ==================
const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await BlockedUser.find({ blocker: req.user._id })
      .populate("blocked", "fullName profilePic email");

    res.status(200).json({ blockedUsers });
  } catch (err) {
    console.error("❌ getBlockedUsers error:", err);
    res.status(500).json({ message: "Failed to fetch blocked users" });
  }
};

module.exports = { getMessages, sendMessage, getConversations, ensureAcceptedChat, sendImageMessage, blockUser, unblockUser, getBlockedUsers };
