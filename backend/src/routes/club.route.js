const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");

const {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  followClub,
  unfollowClub,
  getJoinedClubs,
  getFollowedClubs,
  getAttendedEvents,
} = require("../controllers/club.controller");

const clubRoutes = express.Router();


clubRoutes.post(
  "/",
  protectRoute,
  upload.default.single("clubIcon"),
  createClub,
);

clubRoutes.get("/", protectRoute, getAllClubs);

clubRoutes.get("/:clubId", protectRoute, getClubById);

clubRoutes.patch(
  "/:clubId",
  protectRoute,
  upload.default.single("clubIcon"),
  updateClub,
);

clubRoutes.delete("/:clubId", protectRoute, deleteClub);



clubRoutes.post("/:clubId/join", protectRoute, joinClub);

clubRoutes.post("/:clubId/leave", protectRoute, leaveClub);

clubRoutes.post("/:clubId/follow", protectRoute, followClub);

clubRoutes.post("/:clubId/unfollow", protectRoute, unfollowClub);

clubRoutes.get("/users/me/clubs/joined", protectRoute, getJoinedClubs);
clubRoutes.get("/users/me/clubs/followed", protectRoute, getFollowedClubs);
clubRoutes.get("/users/me/events/attended", protectRoute, getAttendedEvents);


module.exports = { clubRoutes };
