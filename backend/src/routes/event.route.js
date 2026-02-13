const express = require("express");
const protectRoute = require("../middleware/auth.middleware");

const {
  createEvent,
  getAllEvents,
  registerForEvent,
  getEventRegistrations,
  deleteEvent,
  getClubEvents,
  getEventById,
} = require("../controllers/event.controller");

const router = express.Router();

/* STUDENT */
router.get("/", protectRoute, getAllEvents);
router.post("/:eventId/register", protectRoute, registerForEvent);

/* ADMIN */
router.post("/club/:clubId", protectRoute, createEvent);
router.get("/club/:clubId", protectRoute, getClubEvents);
router.get("/:eventId/registrations", protectRoute, getEventRegistrations);
router.delete("/:eventId", protectRoute, deleteEvent);
router.get("/:eventId", protectRoute, getEventById);


module.exports = { eventRoutes: router };
