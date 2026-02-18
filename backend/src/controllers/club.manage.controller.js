const Club = require("../models/club.model");

// ✅ 1️⃣ Add Member (Admin + Moderator)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const club = req.club;

    const alreadyMember = club.members.find(
      (m) => m.user.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a member",
      });
    }

    club.members.push({
      user: userId,
      role: "member",
    });

    await club.save();

    res.status(200).json({
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 2️⃣ Remove Member (Kick)
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const club = req.club;

    const targetMember = club.members.find((m) => m.user.toString() === userId);

    if (!targetMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Prevent moderator from removing admin
    if (targetMember.role === "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({
        message: "Cannot remove admin",
      });
    }

    club.members = club.members.filter((m) => m.user.toString() !== userId);

    await club.save();

    res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 3️⃣ Update Role (Admin Only)
exports.updateRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const club = req.club;

    if (!["moderator", "member"].includes(newRole)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const member = club.members.find((m) => m.user.toString() === userId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    member.role = newRole;

    await club.save();

    res.status(200).json({
      message: "Role updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 4️⃣ Get Club Members
exports.getMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId).populate(
      "members.user",
      "fullName email",
    );

    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }

    res.status(200).json(club.members);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
