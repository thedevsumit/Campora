const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { checkPermission, isAdmin } = require("../middleware/rbac.middleware");
const Resource = require("../models/resource.model");
const Booking = require("../models/booking.model");
const { getScheduledResources, renderScheduledResources } = require("../lib/scheduler");

const router = express.Router();

// List all resources
router.get("/", protectRoute, checkPermission("resource:view"), async (req, res) => {
  try {
    const { type, location, available } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (available === "true") filter.maintenanceMode = false;
    const resources = await Resource.find(filter)
      .populate("managedBy", "clubName")
      .populate("createdBy", "fullName email");
    return res.status(200).json({ resources });
  } catch (error) {
    console.error("getResources error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Create resource - any user can create materials, only admins can create facilities
router.post("/", protectRoute, async (req, res) => {
  try {
    const { type } = req.body;
    const facilityTypes = ["room", "hall", "lab", "equipment", "vehicle"];

    // Only admins can create facility types (rooms, halls, labs, equipment, vehicles)
    if (facilityTypes.includes(type)) {
      if (req.user.userRole !== "admin" && req.user.role !== "superAdmin") {
        return res.status(403).json({ message: "Only admins can create facility resources" });
      }
    }

    // Add creator info for materials
    if (!facilityTypes.includes(type)) {
      req.body.createdBy = req.user._id;
    }

    const resource = await Resource.create(req.body);
    await resource.populate("createdBy", "fullName email");
    return res.status(201).json({ message: "Resource created", resource });
  } catch (error) {
    console.error("createResource error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get resource by ID
router.get("/:resourceId", protectRoute, checkPermission("resource:view"), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId)
      .populate("managedBy", "clubName")
      .populate("createdBy", "fullName email");
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

// Delete resource - creator can delete their own, admins can delete any
router.delete("/:resourceId", protectRoute, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const isUserAdmin = req.user.role === "superAdmin" || req.user.userRole === "admin";
    const isCreator = resource.createdBy && resource.createdBy.toString() === req.user._id.toString();

    if (!isUserAdmin && !isCreator) {
      return res.status(403).json({ message: "Only the creator or admins can delete this resource" });
    }

    await Resource.findByIdAndUpdate(req.params.resourceId, { isActive: false }, { new: true });
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

// Get scheduled resources (the 5 admin resources that auto-render at midnight)
router.get("/scheduled/all", protectRoute, checkPermission("resource:view"), async (req, res) => {
  try {
    const resources = await getScheduledResources();
    return res.status(200).json({ resources });
  } catch (error) {
    console.error("getScheduledResources error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Manually trigger render of scheduled resources (admin only)
router.post("/scheduled/render", protectRoute, isAdmin, async (req, res) => {
  try {
    const io = req.app.get("io");
    const resources = await renderScheduledResources(io);
    return res.status(200).json({ message: "Scheduled resources rendered", resources });
  } catch (error) {
    console.error("renderScheduledResources error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
