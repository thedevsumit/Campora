const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const isSuperAdmin = require("../lib/isSuperAdmin");

const {
  getPendingClubs,
  approveClub,
  rejectClub,
} = require("../controllers/admin.controller");

const adminRouter = express.Router();
// GET pending clubs
adminRouter.get(
  "/pending-clubs",
  authMiddleware,
  isSuperAdmin,
  getPendingClubs,
);

// Approve club
adminRouter.put("/approve/:clubId", authMiddleware, isSuperAdmin, approveClub);

// Reject club
adminRouter.put("/reject/:clubId", authMiddleware, isSuperAdmin, rejectClub);

module.exports = adminRouter;
