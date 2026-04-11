const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { checkPermission, isAdmin } = require("../middleware/rbac.middleware");
const Resource = require("../models/resource.model");
const Booking = require("../models/booking.model");

const router = express.Router();

// List all resources
router.get("/", protectRoute, checkPermission("resource:view"), async (req, res) => {
  try {
    const { type, location, available } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (available === "true") filter.maintenanceMode = false;
    const resources = await Resource.find(filter).populate("managedBy", "clubName");
    return res.status(200).json({ resources });
  } catch (error) {
    console.error("getResources error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Create resource
router.post("/", protectRoute, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    return res.status(201).json({ message: "Resource created", resource });
  } catch (error) {
    console.error("createResource error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get resource by ID
router.get("/:resourceId", protectRoute, checkPermission("resource:view"), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId).populate("managedBy", "clubName");
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    return res.status(200).json({ resource });
  } catch (error) {
    console.error("getResourceById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update resource
router.put("/:resourceId", protectRoute, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.resourceId, req.body, { new: true });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    return res.status(200).json({ message: "Resource updated", resource });
  } catch (error) {
    console.error("updateResource error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete resource (soft)
router.delete("/:resourceId", protectRoute, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.resourceId, { isActive: false }, { new: true });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    return res.status(200).json({ message: "Resource deleted" });
  } catch (error) {
    console.error("deleteResource error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Check availability
router.get("/:resourceId/availability", protectRoute, async (req, res) => {
  try {
    const { date } = req.query;
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    const bookings = await Booking.find({
      resource: req.params.resourceId,
      status: { $in: ["approved", "pending"] },
      "slots.date": { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) }
    }).select("slots status");
    return res.status(200).json({ resource, bookings });
  } catch (error) {
    console.error("checkAvailability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for resource
router.get("/:resourceId/bookings", protectRoute, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ resource: req.params.resourceId })
      .populate("bookedBy", "fullName email")
      .populate("club", "clubName")
      .populate("event", "title");
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("getResourceBookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
