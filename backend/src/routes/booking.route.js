const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { checkPermission, isAdmin } = require("../middleware/rbac.middleware");
const { checkBookingConflicts } = require("../middleware/bookingConflict.middleware");
const Booking = require("../models/booking.model");
const Resource = require("../models/resource.model");
const Notification = require("../models/notification.model");
const PrivateMessage = require("../models/privateMessage.model");
const ChatRequest = require("../models/chatRequest.model");
const sendNotification = require("../lib/sendNotification");
const User = require("../models/user.model");

// Helper: get consistent chatId between two user IDs
const getChatId = (a, b) => [a.toString(), b.toString()].sort().join("_");

// Helper: auto-accept chat between two users (used for booking → direct DM flow)
const ensureAcceptedChat = async (userA, userB) => {
  const existing = await ChatRequest.findOne({
    $or: [
      { sender: userA, receiver: userB, status: "accepted" },
      { sender: userB, receiver: userA, status: "accepted" },
    ],
  });
  if (existing) return existing;
  return await ChatRequest.create({ sender: userA, receiver: userB, status: "accepted" });
};

const router = express.Router();

// Create booking
router.post("/", protectRoute, checkPermission("booking:create:own"), checkBookingConflicts, async (req, res) => {
  try {
    const { resource, slots, purpose, setupRequirements, club, event } = req.body;
    const resourceDoc = await Resource.findById(resource);
    if (!resourceDoc) return res.status(404).json({ message: "Resource not found" });

    // RULE 1: Resource creator CANNOT book their own resource
    const creatorId = resourceDoc.createdBy
      ? (resourceDoc.createdBy._id || resourceDoc.createdBy).toString()
      : null;
    if (creatorId && creatorId === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot book a resource that you have created"
      });
    }

    // RULE 2: Check if user already has a pending/approved booking for this resource
    const existingBooking = await Booking.findOne({
      bookedBy: req.user._id,
      resource,
      status: { $in: ["pending", "approved"] }
    });
    if (existingBooking) {
      return res.status(409).json({
        message: "You already have a pending or approved booking for this resource"
      });
    }

    const isUserAdmin = req.user.role === "superAdmin" || req.user.userRole === "admin";
    const isCommunityResource = !!creatorId;

    // RULE 3: Community resources → ALWAYS auto-approve (no pending)
    //         Admin resources → follow requiresApproval flag
    let status;
    if (isCommunityResource) {
      status = "approved"; // Auto-approved immediately
    } else {
      status = resourceDoc.requiresApproval && !isUserAdmin ? "pending" : "approved";
    }

    const booking = await Booking.create({
      resource,
      bookedBy: req.user._id,
      slots,
      purpose,
      setupRequirements,
      club,
      event,
      status
    });

    if (status === "approved") {
      // Notify the booking user of confirmation
      await sendNotification({
        app: req.app,
        recipient: req.user._id,
        sender: req.user._id,
        type: "booking_approved",
        title: "Booking Confirmed! 🎉",
        message: `Your booking for ${resourceDoc.name} has been confirmed.`,
        relatedBooking: booking._id,
        actionUrl: "/resources",
        actionLabel: "View Booking",
      });

      // If community resource, also notify the resource creator and send a direct DM
      if (isCommunityResource) {
        // Auto-accept chat and send first message directly (no chat request permission needed)
        await ensureAcceptedChat(req.user._id, creatorId);

        const chatId = getChatId(req.user._id, creatorId);
        const dmContent = `Hi! I just booked your resource "${resourceDoc.name}"${booking.slots[0]?.date ? ` for ${booking.slots[0].date}` : ""}. Thanks!`;

        let dm = await PrivateMessage.create({
          chatId,
          sender: req.user._id,
          receiver: creatorId,
          content: dmContent,
        });
        dm = await dm.populate("sender", "fullName profilePic");

        // Emit via socket so creator sees it in real-time
        const io = req.app.get("io");
        if (io) io.to(creatorId.toString()).emit("receiveMessage", dm);

        // Notify the resource creator
        await sendNotification({
          app: req.app,
          recipient: creatorId,
          sender: req.user._id,
          type: "booking_approved",
          title: "Your Resource Was Booked!",
          message: `${req.user.fullName} booked your resource "${resourceDoc.name}".`,
          relatedBooking: booking._id,
          actionUrl: "/notifications",
          actionLabel: "View Details",
        });
      }

      return res.status(201).json({
        message: isCommunityResource
          ? "Booking confirmed! The resource owner has been notified."
          : "Booking confirmed!",
        booking
      });
    } else {
      // Notify all admins about the pending booking request
      const admins = await User.find({
        $or: [{ role: "superAdmin" }, { userRole: "admin" }]
      }).select("_id");

      for (const admin of admins) {
        if (admin._id.toString() === req.user._id.toString()) continue;
        await sendNotification({
          app: req.app,
          recipient: admin._id,
          sender: req.user._id,
          type: "booking_request",
          title: "New Booking Request",
          message: `${req.user.fullName} requested to book ${resourceDoc.name}. Please review and approve or reject.`,
          relatedBooking: booking._id,
          actionUrl: "/resources",
          actionLabel: "Review Booking",
        });
      }

      return res.status(201).json({
        message: "Booking request submitted for admin approval",
        booking
      });
    }
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get user's bookings
router.get("/", protectRoute, async (req, res) => {
  try {
    const bookings = await Booking.find({ bookedBy: req.user._id })
      .populate("resource", "name type code location")
      .populate("club", "clubName")
      .populate("event", "title")
      .sort({ createdAt: -1 });
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get booking by ID
router.get("/:bookingId", protectRoute, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("resource")
      .populate("bookedBy", "fullName email")
      .populate("approvedBy", "fullName")
      .populate("club", "clubName")
      .populate("event", "title");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.bookedBy._id.toString() !== req.user._id.toString() &&
        req.user.role !== "superAdmin" && req.user.userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({ booking });
  } catch (error) {
    console.error("getBookingById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Approve booking — admins or resource creators can approve
router.put("/:bookingId/approve", protectRoute, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate("resource");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isUserAdmin = req.user.userRole === "admin" || req.user.role === "superAdmin";
    const isResourceCreator = booking.resource?.createdBy &&
      (booking.resource.createdBy._id || booking.resource.createdBy).toString() === req.user._id.toString();

    // Only admins or resource creators can approve
    if (!isUserAdmin && !isResourceCreator) {
      return res.status(403).json({ message: "Only admins or the resource creator can approve bookings" });
    }

    // Prevent self-approval
    if (booking.bookedBy.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot approve your own booking request" });
    }

    booking.status = "approved";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    await booking.save();

    // When admin approves, send a direct DM to the requester
    if (isUserAdmin) {
      // bookedBy is an ObjectId — use it directly
      const requesterId = booking.bookedBy;
      await ensureAcceptedChat(req.user._id, requesterId);

      const chatId = getChatId(req.user._id, requesterId.toString());
      const dmContent = `Hi! Your booking request for "${booking.resource?.name}" has been approved. Feel free to reach out if you have any questions!`;

      let dm = await PrivateMessage.create({
        chatId,
        sender: req.user._id,
        receiver: requesterId,
        content: dmContent,
      });
      dm = await dm.populate("sender", "fullName profilePic");

      const io = req.app.get("io");
      if (io) io.to(requesterId.toString()).emit("receiveMessage", dm);
    }

    await sendNotification({
      app: req.app,
      recipient: booking.bookedBy,
      sender: req.user._id,
      type: "booking_approved",
      title: "Booking Approved",
      message: `Your booking request for ${booking.resource?.name || "the resource"} has been approved.`,
      relatedBooking: booking._id,
      actionUrl: "/resources",
      actionLabel: "View Booking",
    });

    return res.status(200).json({ message: "Booking approved", booking });
  } catch (error) {
    console.error("approveBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Reject booking — admins or resource creators can reject
router.put("/:bookingId/reject", protectRoute, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.bookingId).populate("resource");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isUserAdmin = req.user.userRole === "admin" || req.user.role === "superAdmin";
    const isResourceCreator = booking.resource?.createdBy &&
      (booking.resource.createdBy._id || booking.resource.createdBy).toString() === req.user._id.toString();

    if (!isUserAdmin && !isResourceCreator) {
      return res.status(403).json({ message: "Only admins or the resource creator can reject bookings" });
    }

    booking.status = "rejected";
    booking.rejectionReason = rejectionReason;
    await booking.save();

    await sendNotification({
      app: req.app,
      recipient: booking.bookedBy,
      sender: req.user._id,
      type: "booking_rejected",
      title: "Booking Rejected",
      message: `Your booking request for ${booking.resource?.name || "the resource"} was rejected. Reason: ${rejectionReason || "Not specified"}`,
      relatedBooking: booking._id,
      actionUrl: "/resources",
      actionLabel: "View Booking",
    });

    return res.status(200).json({ message: "Booking rejected", booking });
  } catch (error) {
    console.error("rejectBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Cancel booking
router.delete("/:bookingId", protectRoute, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.bookedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "superAdmin" && req.user.userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    booking.status = "cancelled";
    await booking.save();
    return res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Complete booking
router.put("/:bookingId/complete", protectRoute, async (req, res) => {
  try {
    const { usageNotes, conditionNotes, actualStartTime, actualEndTime } = req.body;
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "completed";
    booking.usageNotes = usageNotes;
    booking.conditionNotes = conditionNotes;
    booking.actualStartTime = actualStartTime;
    booking.actualEndTime = actualEndTime;
    await booking.save();
    return res.status(200).json({ message: "Booking completed", booking });
  } catch (error) {
    console.error("completeBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Check conflicts
router.post("/check-conflicts", protectRoute, checkBookingConflicts, async (req, res) => {
  try {
    return res.status(200).json({ message: "No conflicts", conflicts: false });
  } catch (error) {
    console.error("checkConflicts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get booking history
router.get("/history", protectRoute, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const bookings = await Booking.find({ bookedBy: req.user._id })
      .populate("resource", "name type code location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Booking.countDocuments({ bookedBy: req.user._id });
    return res.status(200).json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getBookingHistory error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all bookings (admin)
router.get("/all", protectRoute, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const bookings = await Booking.find(filter)
      .populate("resource", "name type code")
      .populate("bookedBy", "fullName email")
      .populate("club", "clubName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Booking.countDocuments(filter);
    return res.status(200).json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getAllBookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all pending bookings for admin dashboard
router.get("/pending", protectRoute, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" })
      .populate("resource", "name type code location")
      .populate("bookedBy", "fullName email")
      .populate("club", "clubName")
      .sort({ createdAt: -1 });
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("getPendingBookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
