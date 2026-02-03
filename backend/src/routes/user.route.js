const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const { updateProfile } = require("../controllers/user.controller");


const {
  getJoinedClubs,
  getFollowedClubs,
  getAttendedEvents,
} = require("../controllers/club.controller");

// PROFILE ROUTES
router.get("/me/clubs/joined", protectRoute, getJoinedClubs);
router.get("/me/clubs/followed", protectRoute, getFollowedClubs);
router.get("/me/events/attended", protectRoute, getAttendedEvents);
router.patch(
  "/me",
  protectRoute,
  upload.default.single("profilePic"),
  updateProfile
);


module.exports = router;
