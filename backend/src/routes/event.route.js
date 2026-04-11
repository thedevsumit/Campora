const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { checkPermission, isAdmin } = require("../middleware/rbac.middleware");
const {
  createEvent,
  getAllEvents,
  registerForEvent,
  getEventRegistrations,
  deleteEvent,
  getClubEvents,
  getEventById,
  submitForApproval,
  approveEvent,
  rejectEvent,
  completeEvent,
  updateBudget,
  getMyEvents,
  addCollaboratingClub,
  respondToCollaboration,
  getCollaborativeEvents
} = require("../controllers/event.controller");

const router = express.Router();

/* STUDENT */
router.get("/", protectRoute, getAllEvents);
router.post("/:eventId/register", protectRoute, registerForEvent);
router.get("/my-events", protectRoute, getMyEvents);
router.get("/collaborative", protectRoute, getCollaborativeEvents);

/* ORGANIZER */
router.post("/club/:clubId", protectRoute, checkPermission("event:create"), createEvent);
router.put("/:eventId/submit", protectRoute, checkPermission("event:create"), submitForApproval);
router.put("/:eventId/budget", protectRoute, checkPermission("event:create"), updateBudget);
router.post("/:eventId/collaborate/:clubId", protectRoute, checkPermission("event:create"), addCollaboratingClub);
router.put("/:eventId/collaborate/:clubId/respond", protectRoute, checkPermission("event:create"), respondToCollaboration);

/* ADMIN */
router.put("/:eventId/approve", protectRoute, isAdmin, approveEvent);
router.put("/:eventId/reject", protectRoute, isAdmin, rejectEvent);
router.put("/:eventId/complete", protectRoute, completeEvent);

/* COMMON */
router.get("/club/:clubId", protectRoute, getClubEvents);
router.get("/:eventId/registrations", protectRoute, getEventRegistrations);
router.delete("/:eventId", protectRoute, deleteEvent);
router.get("/:eventId", protectRoute, getEventById);


module.exports = { eventRoutes: router };
