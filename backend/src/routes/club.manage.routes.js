const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const checkClubRole = require("../middleware/clubRole.middleware");

const {
  addMember,
  removeMember,
  updateRole,
  getMembers,
} = require("../controllers/club.manage.controller");

// ✅ Add Member
router.put(
  "/:clubId/add-member",
  authMiddleware,
  checkClubRole(["admin", "moderator"]),
  addMember,
);

// ✅ Remove Member
router.put(
  "/:clubId/remove-member",
  authMiddleware,
  checkClubRole(["admin", "moderator"]),
  removeMember,
);

// ✅ Update Role (Admin Only)
router.put(
  "/:clubId/update-role",
  authMiddleware,
  checkClubRole(["admin"]),
  updateRole,
);

// ✅ Get Members
router.get("/:clubId/members", authMiddleware, getMembers);

module.exports = router;
