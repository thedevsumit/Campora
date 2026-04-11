const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { isAdmin, checkPermission } = require("../middleware/rbac.middleware");
const Analytics = require("../models/analytics.model");
const Event = require("../models/event.model");
const Club = require("../models/club.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Resource = require("../models/resource.model");

const router = express.Router();

// Get dashboard data
router.get("/dashboard", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);
    const [
      totalUsers,
      totalClubs,
      totalEvents,
      totalBookings,
      recentEvents,
      recentBookings,
      clubActivity,
      resourceUtilization
    ] = await Promise.all([
      User.countDocuments(),
      Club.countDocuments({ status: "approved" }),
      Event.countDocuments(),
      Booking.countDocuments(),
      Event.find({ createdAt: { $gte: thirtyDaysAgo } })
        .populate("club", "clubName")
        .select("title registrations createdAt")
        .sort({ createdAt: -1 })
        .limit(10),
      Booking.find({ createdAt: { $gte: thirtyDaysAgo } })
        .populate("resource", "name type")
        .select("status totalCost createdAt")
        .sort({ createdAt: -1 })
        .limit(10),
      Club.find({ status: "approved" })
        .select("clubName members")
        .sort({ "members.length": -1 })
        .limit(10),
      Resource.find({ isActive: true })
        .select("name type bookings")
        .limit(10)
    ]);
    const eventStats = recentEvents.map(e => ({
      title: e.title,
      club: e.club?.clubName,
      registrations: e.registrations?.length || 0,
      date: e.createdAt
    }));
    return res.status(200).json({
      overview: {
        totalUsers,
        totalClubs,
        totalEvents,
        totalBookings
      },
      eventStats,
      recentBookings: recentBookings.map(b => ({
        resource: b.resource?.name,
        type: b.resource?.type,
        status: b.status,
        cost: b.totalCost,
        date: b.createdAt
      })),
      clubActivity: clubActivity.map(c => ({
        name: c.clubName,
        members: c.members?.length || 0
      }))
    });
  } catch (error) {
    console.error("getDashboard error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Event analytics
router.get("/events", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period);
    const startDate = new Date(new Date().getTime() - days * 86400000);
    const events = await Event.find({ createdAt: { $gte: startDate } })
      .populate("club", "clubName")
      .select("title registrations createdAt status");
    const analytics = events.map(e => ({
      title: e.title,
      club: e.club?.clubName,
      registrations: e.registrations?.length || 0,
      status: e.status,
      date: e.createdAt
    }));
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registrations?.length || 0), 0);
    return res.status(200).json({ events: analytics, totalRegistrations, eventCount: events.length });
  } catch (error) {
    console.error("getEventAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Club analytics
router.get("/clubs", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const clubs = await Club.find({ status: "approved" })
      .select("clubName members followers announcements createdAt")
      .sort({ "members.length": -1 });
    const analytics = clubs.map(c => ({
      name: c.clubName,
      members: c.members?.length || 0,
      followers: c.followers?.length || 0,
      announcements: c.announcements?.length || 0,
      createdAt: c.createdAt
    }));
    return res.status(200).json({ clubs: analytics });
  } catch (error) {
    console.error("getClubAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Resource analytics
router.get("/resources", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true }).select("name type code");
    const bookings = await Booking.find({ status: "completed" })
      .populate("resource", "name type");
    const resourceStats = resources.map(r => {
      const rBookings = bookings.filter(b => b.resource?._id.toString() === r._id.toString());
      const totalBookings = rBookings.length;
      const utilizationHours = rBookings.reduce((sum, b) => {
        if (b.actualStartTime && b.actualEndTime) {
          return sum + (new Date(b.actualEndTime) - new Date(b.actualStartTime)) / 3600000;
        }
        return sum;
      }, 0);
      return {
        name: r.name,
        type: r.type,
        code: r.code,
        totalBookings,
        utilizationHours: Math.round(utilizationHours * 10) / 10
      };
    });
    return res.status(200).json({ resources: resourceStats });
  } catch (error) {
    console.error("getResourceAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Budget analytics
router.get("/budget", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const events = await Event.find({ budget: { $exists: true, $ne: null } })
      .select("title budget status club")
      .populate("club", "clubName");
    const budgetData = events.map(e => ({
      title: e.title,
      club: e.club?.clubName,
      estimated: e.budget?.estimated || 0,
      approved: e.budget?.approved || 0,
      spent: e.budget?.spent || 0,
      status: e.status
    }));
    const totals = budgetData.reduce((acc, e) => ({
      estimated: acc.estimated + e.estimated,
      approved: acc.approved + e.approved,
      spent: acc.spent + e.spent
    }), { estimated: 0, approved: 0, spent: 0 });
    return res.status(200).json({ budgetData, totals });
  } catch (error) {
    console.error("getBudgetAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// User engagement
router.get("/users", protectRoute, checkPermission("analytics:view"), async (req, res) => {
  try {
    const [totalUsers, activeUsers, usersByDept, usersByYear] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 86400000) } }),
      User.aggregate([{ $group: { _id: "$dept", count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: "$year", count: { $sum: 1 } } }])
    ]);
    return res.status(200).json({
      totalUsers,
      activeUsers,
      byDepartment: usersByDept,
      byYear: usersByYear
    });
  } catch (error) {
    console.error("getUserAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Generate daily snapshot (called by cron)
router.post("/generate-daily", protectRoute, isAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Analytics.findOne({ date: today });
    if (existing) return res.status(400).json({ message: "Analytics already generated for today" });
    const [totalActiveUsers, totalEventsCreated, totalBookingsMade] = await Promise.all([
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 86400000) } }),
      Event.countDocuments({ createdAt: { $gte: today } }),
      Booking.countDocuments({ createdAt: { $gte: today } })
    ]);
    const analytics = await Analytics.create({
      date: today,
      totalActiveUsers,
      totalEventsCreated,
      totalBookingsMade
    });
    return res.status(201).json({ message: "Daily analytics generated", analytics });
  } catch (error) {
    console.error("generateDailyAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
