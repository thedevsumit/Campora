// controllers/clubChat.controller.js
const ClubMessage = require("../models/clubMessage.model");
const isClubMember = require("../lib/isClubMember");
const mongoose = require("mongoose");

/* ================= GET CLUB MESSAGES ================= */
const getClubMessages = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const allowed = await isClubMember(clubId, userId);
    if (!allowed) {
      return res.status(403).json({ message: "Not a club member" });
    }

    const messages = await ClubMessage.find({ club: clubId })
      .populate("sender", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error("❌ getClubMessages:", err);
    res.status(500).json({ message: "Failed to fetch club messages" });
  }
};

/* ================= SEND CLUB MESSAGE ================= */
const sendClubMessage = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message is empty" });
    }

    const allowed = await isClubMember(clubId, userId);
    if (!allowed) {
      return res.status(403).json({ message: "Not a club member" });
    }

    let message = await ClubMessage.create({
      club: clubId,
      sender: userId,
      content: content.trim(),
    });

    // 🔥 populate sender for frontend
    message = await message.populate("sender", "fullName profilePic");

    // 🔥 socket emit to club room
    const io = req.app.get("io");
    io.to(`club_${clubId}`).emit("receiveClubMessage", message);

    res.status(201).json({ message });
  } catch (err) {
    console.error("❌ sendClubMessage:", err);
    res.status(500).json({ message: "Failed to send club message" });
  }
};

module.exports = {
  getClubMessages,
  sendClubMessage,
};
