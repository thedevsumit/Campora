const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const { updateProfile } = require("../controllers/user.controller");

const {
  getJoinedClubs,
  getFollowedClubs,
  getAttendedEvents,
  getUserByEmail,
} = require("../controllers/club.controller");
const { getUserProfile } = require("../controllers/auth.controller");

router.get("/me/clubs/joined", protectRoute, getJoinedClubs);
router.get("/me/clubs/followed", protectRoute, getFollowedClubs);
router.get("/me/events/attended", protectRoute, getAttendedEvents);
router.get("/:userId/profile", protectRoute, getUserProfile);
router.get("/by-email/:email", protectRoute, getUserByEmail);

router.patch("/me", protectRoute, upload.default.single("profilePic"), updateProfile);

module.exports = router;
