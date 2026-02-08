const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
console.log("CLUB ROUTES REGISTERED");


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
  getAdminClubData,
  addMember,
  removeMember,
  changeMemberRole,
  getCreatedClubs,
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/club.controller");

const isClubCreator = require("../middleware/isClubCreator");

const clubRoutes = express.Router();


clubRoutes.post(
  "/",
  protectRoute,
  upload.default.single("clubIcon"),
  createClub,
);

clubRoutes.get("/", protectRoute, getAllClubs);

/* ===== ADMIN ROUTES ===== */

clubRoutes.get("/admin/:clubId", protectRoute, isClubCreator, getAdminClubData);

clubRoutes.post("/admin/:clubId/members", protectRoute, isClubCreator, addMember);

clubRoutes.delete("/admin/:clubId/members/:memberId", protectRoute, isClubCreator, removeMember);

clubRoutes.patch("/admin/:clubId/members/:memberId", protectRoute, isClubCreator, changeMemberRole);


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

clubRoutes.get("/users/me/clubs/created", protectRoute, getCreatedClubs);

clubRoutes.post(
  "/:clubId/admin/announcements",
  protectRoute,
  isClubCreator,
  createAnnouncement
);

clubRoutes.delete(
  "/:clubId/admin/announcements/:announcementId",
  protectRoute,
  isClubCreator,
  deleteAnnouncement
);


clubRoutes.get(
  "/:clubId/announcements",
  protectRoute,
  getAnnouncements
);




module.exports =  clubRoutes ;
