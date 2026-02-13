const Event = require("../models/event.model");
const Club = require("../models/club.model");

/* ================= CREATE EVENT (ADMIN) ================= */
const createEvent = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // only creator allowed
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const event = await Event.create({
      ...req.body,
      club: clubId,
    });

    res.status(201).json({ event });
  } catch (err) {
    console.error("createEvent:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

/* ================= GET EVENTS FOR STUDENTS ================= */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate("club", "clubName clubIcon")
      .sort({ date: 1 });

    res.json({ events });
  } catch (err) {
    console.error("getAllEvents:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* ================= REGISTER FOR EVENT ================= */
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event full" });
    }

    const already = event.registrations.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (already) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registrations.push({
      user: req.user._id,
      ...req.body,
    });

    await event.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("registerForEvent:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= ADMIN: VIEW REGISTRATIONS ================= */
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("registrations.user", "fullName email profilePic")
      .populate("club", "createdBy");

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ registrations: event.registrations });
  } catch (err) {
    console.error("getEventRegistrations:", err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

/* ================= DELETE EVENT ================= */
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate("club", "createdBy");
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    event.isActive = false;
    await event.save();

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("deleteEvent:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

const getClubEvents = async (req, res) => {
  try {
    const { clubId } = req.params;

    const events = await Event.find({ club: clubId })
      .populate("club", "clubName clubIcon")
      .sort({ createdAt: -1 });

    res.json({ events });
  } catch (err) {
    console.error("getClubEvents:", err);
    res.status(500).json({ message: "Failed to fetch club events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("club", "clubName clubIcon");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event });
  } catch (err) {
    console.error("getEventById:", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};



module.exports = {
  createEvent,
  getAllEvents,
  registerForEvent,
  getEventRegistrations,
  deleteEvent,
  getClubEvents,
  getEventById,
};
