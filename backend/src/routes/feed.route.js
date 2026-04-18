const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const Club = require("../models/club.model");
const Event = require("../models/event.model");

const router = express.Router();

// Get personalized feed: events and announcements from user's joined/followed clubs
router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's joined and followed clubs
    const user = await Club.findById(userId)
      .populate("joinedClubs", "_id")
      .populate("followedClubs", "_id");

    // Fallback: also try User model
    const User = require("../models/user.model");
    const userDoc = await User.findById(userId).populate("joinedClubs followedClubs", "_id");

    const myClubIds = [
      ...(userDoc?.joinedClubs || []).map(c => c._id),
      ...(userDoc?.followedClubs || []).map(c => c._id),
    ].map(id => id.toString());

    if (myClubIds.length === 0) {
      return res.status(200).json({ feed: [], myClubs: [] });
    }

    // Get approved events from these clubs (last 30 days, sorted by date desc)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const events = await Event.find({
      $or: [
        { leadClub: { $in: myClubIds } },
        { "collaboratingClubs.club": { $in: myClubIds } },
      ],
      status: "approved",
      startDate: { $gte: thirtyDaysAgo },
    })
      .populate("leadClub", "clubName clubIcon")
      .select("title description startDate venue image category registrations")
      .sort({ startDate: -1 })
      .limit(20);

    // Get latest announcements from these clubs
    const clubs = await Club.find({ _id: { $in: myClubIds }, isActive: true })
      .select("clubName clubIcon announcements")
      .sort({ updatedAt: -1 });

    const feed = [];

    // Add events to feed
    events.forEach(event => {
      feed.push({
        _id: event._id.toString(),
        type: "event",
        title: event.title,
        description: event.description,
        date: event.startDate,
        venue: event.venue,
        image: event.image,
        category: event.category,
        club: event.leadClub,
        registrations: event.registrations?.length || 0,
        createdAt: event.createdAt,
      });
    });

    // Add announcements to feed
    clubs.forEach(club => {
      if (club.announcements && club.announcements.length > 0) {
        club.announcements.slice(0, 3).forEach(ann => {
          feed.push({
            _id: `${club._id}_${ann._id}`,
            type: "announcement",
            title: ann.title,
            message: ann.message,
            club: {
              _id: club._id,
              clubName: club.clubName,
              clubIcon: club.clubIcon,
            },
            createdAt: ann.createdAt,
          });
        });
      }
    });

    // Sort feed by createdAt descending
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get user's clubs for the dropdown
    const myClubs = await Club.find({ _id: { $in: myClubIds } })
      .select("clubName clubIcon description members followers")
      .limit(20);

    return res.status(200).json({ feed, myClubs });
  } catch (error) {
    console.error("getFeed error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
