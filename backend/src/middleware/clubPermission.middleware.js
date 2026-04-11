const checkClubPermission = (action, resource) => {
  return async (req, res, next) => {
    try {
      const { clubId } = req.params;
      const userId = req.user._id;

      const Club = require("../models/club.model");
      const club = await Club.findById(clubId);

      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      const member = club.members.find(
        m => m.user.toString() === userId.toString()
      );

      if (!member) {
        return res.status(403).json({ message: "Not a club member" });
      }

      const permissions = {
        member: [`${resource}:view`, "chat:access"],
        moderator: [`${resource}:view`, `${resource}:moderate`, "chat:access", "member:view"],
        admin: [`${resource}:*`, "chat:access", "member:manage", "announcement:create"],
      };

      const rolePerms = permissions[member.role] || [];
      const hasPermission = rolePerms.includes(`${resource}:${action}`) ||
        rolePerms.includes(`${resource}:*`);

      if (!hasPermission) {
        return res.status(403).json({ message: "Club permission denied" });
      }

      req.clubMember = member;
      next();
    } catch (error) {
      console.error("checkClubPermission error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = { checkClubPermission };
