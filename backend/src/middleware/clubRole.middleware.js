const Club = require("../models/club.model");

const checkClubRole = (allowedRoles) => {
  return async (req, res, next) => {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);

    if (!club) return res.status(404).json({ message: "Club not found" });

    const member = club.members.find(
      (m) => m.user.toString() === userId.toString(),
    );

    if (!member || !allowedRoles.includes(member.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    req.club = club;
    next();
  };
};

module.exports = checkClubRole;
