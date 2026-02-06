const Club = require("../models/club.model");

const isClubCreator = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can access admin panel" });
    }

    req.club = club; // useful later
    next();
  } catch (err) {
    console.error("isClubCreator error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isClubCreator;
