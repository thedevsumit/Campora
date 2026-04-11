const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { checkPermission, isAdmin } = require("../middleware/rbac.middleware");
const { checkBookingConflicts } = require("../middleware/bookingConflict.middleware");
const Booking = require("../models/booking.model");
const Resource = require("../models/resource.model");
const Notification = require("../models/notification.model");

const router = express.Router();

// Create booking
router.post("/", protectRoute, checkPermission("booking:create"), checkBookingConflicts, async (req, res) => {
  try {
    const { resource, slots, purpose, setupRequirements, club, event } = req.body;
    const resourceDoc = await Resource.findById(resource);
    if (!resourceDoc) return res.status(404).json({ message: "Resource not found" });
    let totalCost = 0;
    slots.forEach(slot => {
      const start = parseInt(slot.startTime.replace(":", ""));
      const end = parseInt(slot.endTime.replace(":", ""));
      const hours = (end - start) / 100;
      totalCost += hours * resourceDoc.hourlyRate;
    });
    const booking = await Booking.create({
      resource,
      bookedBy: req.user._id,
      slots,
      purpose,
      setupRequirements,
      club,
      event,
      totalCost,
      status: resourceDoc.requiresApproval ? "pending" : "approved"
    });
    if (resourceDoc.requiresApproval) {
      await Notification.create({
        recipient: req.user._id,
        type: "booking_approved",
        title: "Booking Submitted",
        message: `Your booking request for ${resourceDoc.name} has been submitted and is pending approval.`,
        relatedBooking: booking._id
      });
    }
    return res.status(201).json({ message: "Booking created", booking });
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

// Approve booking
router.put("/:bookingId/approve", protectRoute, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "approved";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    await booking.save();
    await Notification.create({
      recipient: booking.bookedBy,
      type: "booking_approved",
      title: "Booking Approved",
      message: `Your booking request has been approved.`,
      relatedBooking: booking._id
    });
    return res.status(200).json({ message: "Booking approved", booking });
  } catch (error) {
    console.error("approveBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Reject booking
router.put("/:bookingId/reject", protectRoute, isAdmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "rejected";
    booking.rejectionReason = rejectionReason;
    await booking.save();
    await Notification.create({
      recipient: booking.bookedBy,
      type: "booking_rejected",
      title: "Booking Rejected",
      message: `Your booking request was rejected. Reason: ${rejectionReason || "Not specified"}`,
      relatedBooking: booking._id
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

module.exports = router;
