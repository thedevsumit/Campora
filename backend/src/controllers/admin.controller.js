const Club = require("../models/club.model");
const sendNotification = require("../lib/sendNotification");

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
    // club.members.push({
    //   user: club.createdBy,
    //   role: "admin",
    // });

    await club.save();

    // Notify club creator
    await sendNotification({
      app: req.app,
      recipient: club.createdBy,
      sender: req.user._id,
      type: "club_approved",
      title: "Your club has been approved!",
      message: `Great news! Your club "${club.clubName}" has been approved and is now live. You can start adding events, members, and announcements.`,
      relatedClub: club._id,
      actionUrl: `/clubs/${club._id}`,
      actionLabel: "View Club",
    });

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

    const creatorId = club.createdBy;
    const clubName = club.clubName;

    club.status = "rejected";
    await club.save();

    // Notify club creator
    await sendNotification({
      app: req.app,
      recipient: creatorId,
      sender: req.user._id,
      type: "club_rejected",
      title: "Club request rejected",
      message: `Your club "${clubName}" was not approved. Please review the guidelines and try creating a new club with a unique name and description.`,
      actionUrl: "/create-club",
      actionLabel: "Try Again",
    });

    res.status(200).json({ message: "Club rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
