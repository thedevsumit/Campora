const express = require("express");
const protectRoute = require("../middleware/auth.middleware");


const {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
} = require("../controllers/club.controller");

const clubRoutes = express.Router();

clubRoutes.post("/", protectRoute,createClub);


clubRoutes.get("/", protectRoute,getAllClubs);

clubRoutes.get("/:clubId", protectRoute, getClubById);

clubRoutes.patch("/:clubId", protectRoute, updateClub);

clubRoutes.delete("/:clubId", protectRoute, deleteClub);

module.exports = { clubRoutes };
