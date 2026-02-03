const mongoose = require("mongoose");
const Club = require("../models/club.model");
const User = require("../models/user.model");

/* =========================
   CREATE CLUB
========================= */
const createClub = async (req, res) => {
  try {
    const { clubName, description } = req.body;

    if (!clubName || !description) {
      return res.status(400).json({
        message: "clubName and description are required",
      });
    }

    const exists = await Club.findOne({ clubName: clubName.trim() });
    if (exists) {
      return res.status(409).json({ message: "Club already exists" });
    }

    const club = await Club.create({
      clubName: clubName.trim(),
      description: description.trim(),
      createdBy: req.user._id,
      clubIcon: req.file ? `/uploads/${req.file.filename}` : "",
    });

    return res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (err) {
    console.error("createClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL CLUBS
========================= */
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select(
        "clubName clubIcon description createdBy members followers createdAt",
      );

    return res.status(200).json({ clubs });
  } catch (err) {
    console.error("getAllClubs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CLUB BY ID
========================= */
const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId)
      .populate("createdBy", "fullName profilePic")
      .populate("members.user", "fullName profilePic")
      .populate("followers", "fullName profilePic");

    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json({ club });
  } catch (err) {
    console.error("getClubById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   UPDATE CLUB
========================= */
const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { clubName, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (clubName) club.clubName = clubName.trim();
    if (description) club.description = description.trim();
    if (req.file) club.clubIcon = `/uploads/${req.file.filename}`;

    await club.save();

    return res.status(200).json({
      message: "Club updated successfully",
      club,
    });
  } catch (err) {
    console.error("updateClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE CLUB (SOFT)
========================= */
const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    club.isActive = false;
    await club.save();

    return res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    console.error("deleteClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   JOIN CLUB
========================= */
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isMember = club.members.some(
      (m) => m.user.toString() === userId.toString(),
    );
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    club.members.push({ user: userId });
    club.followers = club.followers.filter(
      (id) => id.toString() !== userId.toString(),
    );

    await club.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedClubs: clubId },
      $pull: { followedClubs: clubId },
    });

    return res.status(200).json({ message: "Joined club successfully" });
  } catch (err) {
    console.error("joinClub error:", err);
    return res.status(500).json({ message: "Failed to join club" });
  }
};

/* =========================
   FOLLOW CLUB
========================= */
const followClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isMember = club.members.some(
      (m) => m.user.toString() === userId.toString(),
    );
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    await Club.findByIdAndUpdate(clubId, {
      $addToSet: { followers: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followedClubs: clubId },
    });

    return res.status(200).json({ message: "Club followed successfully" });
  } catch (err) {
    console.error("followClub error:", err);
    return res.status(500).json({ message: "Failed to follow club" });
  }
};

/* =========================
   LEAVE CLUB
========================= */
const leaveClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    await Club.findByIdAndUpdate(clubId, {
      $pull: { members: { user: userId } },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { joinedClubs: clubId },
    });

    return res.json({ message: "Left club successfully" });
  } catch (err) {
    console.error("leaveClub error:", err);
    return res.status(500).json({ message: "Failed to leave club" });
  }
};

/* =========================
   UNFOLLOW CLUB
========================= */
const unfollowClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    await Club.findByIdAndUpdate(clubId, {
      $pull: { followers: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followedClubs: clubId },
    });

    return res.json({ message: "Unfollowed club" });
  } catch (err) {
    console.error("unfollowClub error:", err);
    return res.status(500).json({ message: "Failed to unfollow club" });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  followClub,
  leaveClub,
  unfollowClub,
};
