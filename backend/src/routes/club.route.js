const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");


const {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
} = require("../controllers/club.controller");


const clubRoutes = express.Router();

clubRoutes.post(
  "/",
  protectRoute,
  upload.default.single("clubIcon"), // 👈 REQUIRED
  createClub
);



clubRoutes.get("/", protectRoute,getAllClubs);

clubRoutes.get("/:clubId", protectRoute, getClubById);

clubRoutes.patch(
  "/:clubId",
  protectRoute,
  upload.default.single("clubIcon"), // 🔥 MUST match frontend
  updateClub
);

clubRoutes.delete("/:clubId", protectRoute, deleteClub);

module.exports = { clubRoutes };
