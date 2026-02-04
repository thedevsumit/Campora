const PrivateMessage = require("../models/privateMessage.model");
const ChatRequest = require("../models/chatRequest.model");
const mongoose = require("mongoose");

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

    const messages = await PrivateMessage.find({ chatId }).sort({
      createdAt: 1,
    });

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

    // ✅ SAVE MESSAGE
    const message = await PrivateMessage.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    // 🔥 SOCKET.IO EMIT (NEW)
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("receiveMessage", message);

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

    const requests = await ChatRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "fullName profilePic");

    // Deduplicate users (extra safety)
    const userMap = new Map();

    requests.forEach((r) => {
      const otherUser =
        r.sender._id.toString() === userId.toString() ? r.receiver : r.sender;

      userMap.set(otherUser._id.toString(), otherUser);
    });

    res.json({ users: Array.from(userMap.values()) });
  } catch (err) {
    console.error("❌ getConversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
