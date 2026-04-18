const ChatRequest = require("../models/chatRequest.model");
const sendNotification = require("../lib/sendNotification");

// ================= SEND CHAT REQUEST =================
const sendChatRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot DM yourself" });
    }

    const existing = await ChatRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await ChatRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    // 🔔 SOCKET: notify receiver about new request
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("newChatRequest", {
      _id: request._id,
      sender: {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
      },
      status: "pending",
    });

    // 🔔 IN-APP NOTIFICATION
    await sendNotification({
      app: req.app,
      recipient: receiverId,
      sender: senderId,
      type: "dm_request",
      title: "New message request",
      message: `${req.user.fullName} wants to send you a direct message. Accept their request to start chatting.`,
      actionUrl: "/chat/requests",
      actionLabel: "View Request",
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error("❌ sendChatRequest error:", err);
    res.status(500).json({ message: "Failed to send chat request" });
  }
};

// ================= GET INCOMING REQUESTS =================
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profilePic");

    res.json({ requests });
  } catch (err) {
    console.error("❌ getIncomingRequests error:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// ================= ACCEPT REQUEST =================
const acceptRequest = async (req, res) => {
  try {
    const request = await ChatRequest.findById(req.params.requestId);

    if (!request || request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = "accepted";
    await request.save();

    // 🔔 SOCKET: notify sender that request was accepted
    const io = req.app.get("io");
    io.to(request.sender.toString()).emit("chatRequestAccepted", {
      by: req.user._id,
      fullName: req.user.fullName,
    });

    // 🔔 IN-APP NOTIFICATION
    await sendNotification({
      app: req.app,
      recipient: request.sender,
      sender: req.user._id,
      type: "chat_request_accepted",
      title: "Chat request accepted",
      message: `${req.user.fullName} accepted your message request. You can now chat with them!`,
      actionUrl: `/chat/${req.user._id}`,
      actionLabel: "Start Chat",
    });

    res.json({ message: "Chat request accepted" });
  } catch (err) {
    console.error("❌ acceptRequest error:", err);
    res.status(500).json({ message: "Failed to accept request" });
  }
};

// ================= REJECT REQUEST =================
const rejectRequest = async (req, res) => {
  try {
    const request = await ChatRequest.findById(req.params.requestId);

    if (!request || request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const senderId = request.sender;
    const rejecterName = req.user.fullName;

    request.status = "rejected";
    await request.save();

    // 🔔 SOCKET: notify sender about rejection
    const io = req.app.get("io");
    io.to(senderId.toString()).emit("chatRequestRejected", {
      by: req.user._id,
    });

    // 🔔 IN-APP NOTIFICATION
    await sendNotification({
      app: req.app,
      recipient: senderId,
      sender: req.user._id,
      type: "chat_request_rejected",
      title: "Chat request declined",
      message: `${rejecterName} declined your message request.`,
      actionUrl: "/chat/requests",
      actionLabel: "View Requests",
    });

    res.json({ message: "Chat request rejected" });
  } catch (err) {
    console.error("❌ rejectRequest error:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

module.exports = {
  sendChatRequest,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
};
