const Club = require("../models/club.model");

const isClubCreator = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user is the club creator (owner)
    const isCreator = club.createdBy.toString() === req.user._id.toString();

    // Check if user is a member with admin or moderator role
    const member = club.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isAdminOrModerator = member && ["admin", "moderator"].includes(member.role);

    if (!isCreator && !isAdminOrModerator) {
      return res.status(403).json({ message: "Only club admin or moderator can access" });
    }

    req.club = club; // useful later
    next();
  } catch (err) {
    console.error("isClubCreator error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isClubCreator;
