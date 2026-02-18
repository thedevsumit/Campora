const Club = require("../models/club.model");

// 🔹 Get all pending clubs
exports.getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ status: "pending" }).populate(
      "createdBy",
      "fullName email dept year",
    );

    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Approve club
exports.approveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) return res.status(404).json({ message: "Club not found" });

    if (club.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    club.status = "approved";
    club.approvedBy = req.user._id;
    club.approvedAt = new Date();

    // Add creator as club admin
    club.members.push({
      user: club.createdBy,
      role: "admin",
    });

    await club.save();

    res.status(200).json({ message: "Club approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Reject club
exports.rejectClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) return res.status(404).json({ message: "Club not found" });

    if (club.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    club.status = "rejected";
    await club.save();

    res.status(200).json({ message: "Club rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
