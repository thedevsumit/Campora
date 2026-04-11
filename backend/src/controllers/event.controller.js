const Event = require("../models/event.model");
const Club = require("../models/club.model");
const Notification = require("../models/notification.model");

/* ================= CREATE EVENT (ORGANIZER) ================= */
const createEvent = async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const member = club.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || !["admin", "moderator"].includes(member.role)) {
      return res.status(403).json({ message: "Not allowed - must be club admin or moderator" });
    }

    const event = await Event.create({
      ...req.body,
      club: clubId,
      leadClub: clubId,
    });

    const populated = await Event.findById(event._id).populate("club", "clubName clubIcon");
    res.status(201).json({ event: populated });
  } catch (err) {
    console.error("createEvent:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

/* ================= GET EVENTS FOR STUDENTS ================= */
const getAllEvents = async (req, res) => {
  try {
    const { status, category, clubId } = req.query;
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (clubId) filter.club = clubId;

    const events = await Event.find(filter)
      .populate("club", "clubName clubIcon")
      .populate("collaboratingClubs.club", "clubName clubIcon")
      .sort({ startDate: 1 });

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

    if (event.status !== "approved") {
      return res.status(400).json({ message: "Event is not open for registration" });
    }

    if (event.registrations.length >= event.maxParticipants) {
      event.registrations.push({
        user: req.user._id,
        ...req.body,
        status: "waitlisted"
      });
    } else {
      event.registrations.push({
        user: req.user._id,
        ...req.body,
        status: "registered"
      });
    }

    await event.save();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("registerForEvent:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= GET MY EVENTS ================= */
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ "registrations.user": req.user._id })
      .populate("club", "clubName clubIcon")
      .sort({ startDate: 1 });
    res.json({ events });
  } catch (err) {
    console.error("getMyEvents:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* ================= SUBMIT FOR APPROVAL ================= */
const submitForApproval = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "pending_approval";
    await event.save();

    const superAdmins = await require("../models/user.model").find({ role: "superAdmin" });
    for (const admin of superAdmins) {
      await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        type: "event_approval",
        title: "Event Pending Approval",
        message: `Event "${event.title}" is awaiting approval`,
        relatedEvent: event._id,
        actionUrl: `/events/${event._id}`,
        actionLabel: "Review Event"
      });
    }

    res.json({ message: "Event submitted for approval", event });
  } catch (err) {
    console.error("submitForApproval:", err);
    res.status(500).json({ message: "Failed to submit event" });
  }
};

/* ================= APPROVE EVENT (ADMIN) ================= */
const approveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "approved";
    event.approvedBy = req.user._id;
    event.approvedAt = new Date();
    await event.save();

    const club = await Club.findById(event.club);
    if (club) {
      for (const member of club.members) {
        await Notification.create({
          recipient: member.user,
          type: "event_approval",
          title: "Event Approved",
          message: `Event "${event.title}" has been approved`,
          relatedEvent: event._id
        });
      }
    }

    res.json({ message: "Event approved", event });
  } catch (err) {
    console.error("approveEvent:", err);
    res.status(500).json({ message: "Failed to approve event" });
  }
};

/* ================= REJECT EVENT (ADMIN) ================= */
const rejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rejectionReason } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "rejected";
    event.rejectionReason = rejectionReason;
    await event.save();

    const club = await Club.findById(event.club);
    if (club) {
      for (const member of club.members.filter(m => ["admin", "moderator"].includes(m.role))) {
        await Notification.create({
          recipient: member.user,
          type: "event_rejection",
          title: "Event Rejected",
          message: `Event "${event.title}" was rejected. Reason: ${rejectionReason || "Not specified"}`,
          relatedEvent: event._id
        });
      }
    }

    res.json({ message: "Event rejected", event });
  } catch (err) {
    console.error("rejectEvent:", err);
    res.status(500).json({ message: "Failed to reject event" });
  }
};

/* ================= COMPLETE EVENT ================= */
const completeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "completed";
    await event.save();
    res.json({ message: "Event marked as completed", event });
  } catch (err) {
    console.error("completeEvent:", err);
    res.status(500).json({ message: "Failed to complete event" });
  }
};

/* ================= UPDATE BUDGET ================= */
const updateBudget = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { budget } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.budget = { ...event.budget, ...budget };
    await event.save();
    res.json({ message: "Budget updated", event });
  } catch (err) {
    console.error("updateBudget:", err);
    res.status(500).json({ message: "Failed to update budget" });
  }
};

/* ================= ADD COLLABORATING CLUB ================= */
const addCollaboratingClub = async (req, res) => {
  try {
    const { eventId, clubId } = req.params;
    const { contribution } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const alreadyInvited = event.collaboratingClubs.some(c => c.club.toString() === clubId);
    if (alreadyInvited) return res.status(400).json({ message: "Club already invited" });

    event.collaboratingClubs.push({ club: clubId, contribution, status: "invited" });
    await event.save();

    const club = await Club.findById(clubId);
    if (club) {
      for (const member of club.members.filter(m => ["admin", "moderator"].includes(m.role))) {
        await Notification.create({
          recipient: member.user,
          type: "club_invite",
          title: "Collaboration Invite",
          message: `Your club has been invited to collaborate on "${event.title}"`,
          relatedEvent: event._id
        });
      }
    }

    res.json({ message: "Club invited to collaborate", event });
  } catch (err) {
    console.error("addCollaboratingClub:", err);
    res.status(500).json({ message: "Failed to add collaborating club" });
  }
};

/* ================= RESPOND TO COLLABORATION ================= */
const respondToCollaboration = async (req, res) => {
  try {
    const { eventId, clubId } = req.params;
    const { status } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const collaboration = event.collaboratingClubs.find(c => c.club.toString() === clubId);
    if (!collaboration) return res.status(404).json({ message: "Collaboration not found" });

    collaboration.status = status;
    if (status === "accepted") collaboration.agreedAt = new Date();
    await event.save();

    res.json({ message: `Collaboration ${status}`, event });
  } catch (err) {
    console.error("respondToCollaboration:", err);
    res.status(500).json({ message: "Failed to respond to collaboration" });
  }
};

/* ================= GET COLLABORATIVE EVENTS ================= */
const getCollaborativeEvents = async (req, res) => {
  try {
    const events = await Event.find({
      "collaboratingClubs.club": req.user.joinedClubs,
      isActive: true
    })
      .populate("club", "clubName clubIcon")
      .populate("collaboratingClubs.club", "clubName clubIcon")
      .sort({ startDate: 1 });
    res.json({ events });
  } catch (err) {
    console.error("getCollaborativeEvents:", err);
    res.status(500).json({ message: "Failed to fetch collaborative events" });
  }
};

/* ================= ADMIN: VIEW REGISTRATIONS ================= */
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId)
      .populate("registrations.user", "fullName email profilePic")
      .populate("club", "createdBy members");

    if (!event) return res.status(404).json({ message: "Event not found" });

    const isCreator = event.club.createdBy.toString() === req.user._id.toString();
    const isAdmin = event.club.members?.some(m => m.user.toString() === req.user._id.toString() && ["admin", "moderator"].includes(m.role));
    const isSuperAdmin = req.user.role === "superAdmin";

    if (!isCreator && !isAdmin && !isSuperAdmin) {
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
    const event = await Event.findById(eventId).populate("club", "createdBy members");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isCreator = event.club.createdBy.toString() === req.user._id.toString();
    const isAdmin = event.club.members?.some(m => m.user.toString() === req.user._id.toString() && m.role === "admin");
    const isSuperAdmin = req.user.role === "superAdmin";

    if (!isCreator && !isAdmin && !isSuperAdmin) {
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
      .populate("club", "clubName clubIcon")
      .populate("collaboratingClubs.club", "clubName clubIcon")
      .populate("registrations.user", "fullName email profilePic")
      .populate("leadClub", "clubName clubIcon");

    if (!event) return res.status(404).json({ message: "Event not found" });
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
  submitForApproval,
  approveEvent,
  rejectEvent,
  completeEvent,
  updateBudget,
  getMyEvents,
  addCollaboratingClub,
  respondToCollaboration,
  getCollaborativeEvents
};
