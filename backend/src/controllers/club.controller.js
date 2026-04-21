const mongoose = require("mongoose");
const path = require("path");
const Club = require("../models/club.model");
const User = require("../models/user.model");
const JoinRequest = require("../models/joinRequest.model");
const sendNotification = require("../lib/sendNotification");
const { uploadToCloudinary } = require("../middleware/multer.middleware");

/* =========================
   CREATE CLUB
========================= */
const createClub = async (req, res) => {
  try {
    const { clubName, description } = req.body;

    if (!clubName || !description) {
      return res.status(400).json({
        message: "clubName and description are required",
      });
    }

    const exists = await Club.findOne({ clubName: clubName.trim() });
    if (exists) {
      return res.status(409).json({ message: "Club already exists" });
    }

    let clubIconUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      clubIconUrl = result.secure_url;
    }

    const club = await Club.create({
      clubName: clubName.trim(),
      description: description.trim(),
      createdBy: req.user._id,
      clubIcon: clubIconUrl,
      members: [{ user: req.user._id, role: "admin" }],
    });

    return res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (err) {
    console.error("createClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL CLUBS
========================= */
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ status: "approved", isActive: true })
      .sort({ createdAt: -1 })
      .select(
        "clubName clubIcon description createdBy members followers createdAt",
      );

    return res.status(200).json({ clubs });
  } catch (err) {
    console.error("getAllClubs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CLUB BY ID
========================= */
const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId)
      .populate("createdBy", "fullName profilePic")
      .populate("members.user", "fullName profilePic")
      .populate("followers", "fullName profilePic");

    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json({ club });
  } catch (err) {
    console.error("getClubById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   UPDATE CLUB
========================= */
const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { clubName, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (clubName) club.clubName = clubName.trim();
    if (description) club.description = description.trim();
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      club.clubIcon = result.secure_url;
    }

    await club.save();

    return res.status(200).json({
      message: "Club updated successfully",
      club,
    });
  } catch (err) {
    console.error("updateClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE CLUB (SOFT)
========================= */
const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    club.isActive = false;
    await club.save();

    return res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    console.error("deleteClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   JOIN CLUB (request to join)
========================= */
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isMember = club.members.some(
      (m) => m.user.toString() === userId.toString(),
    );
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Check for existing pending request
    const existing = await JoinRequest.findOne({ club: clubId, user: userId, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "Request already pending" });
    }

    await JoinRequest.create({ club: clubId, user: userId });

    // Notify club admins & owner
    const admins = club.members.filter((m) => ["admin", "moderator"].includes(m.role) || club.createdBy.toString() === m.user.toString());
    for (const admin of admins) {
      await sendNotification({
        app: req.app,
        recipient: admin.user._id,
        sender: userId,
        type: "join_request",
        title: "New Join Request",
        message: `${req.user.fullName} wants to join ${club.clubName}`,
        relatedClub: clubId,
        actionUrl: `/clubs/${clubId}/admin`,
        actionLabel: "Review",
      });
    }

    return res.status(200).json({ message: "Join request sent" });
  } catch (err) {
    console.error("joinClub error:", err);
    return res.status(500).json({ message: "Failed to send join request" });
  }
};

/* =========================
   GET JOIN REQUESTS (admin)
========================= */
const getJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ club: req.club._id })
      .populate("user", "fullName email profilePic")
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    console.error("getJoinRequests:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* =========================
   ACCEPT JOIN REQUEST
========================= */
const acceptJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await JoinRequest.findById(requestId);
    if (!request || request.club.toString() !== req.club._id.toString()) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    const club = await Club.findById(req.club._id);
    const alreadyMember = club.members.some((m) => m.user.toString() === request.user.toString());
    if (!alreadyMember) {
      club.members.push({ user: request.user, role: "member" });
      await club.save();
    }

    await sendNotification({
      app: req.app,
      recipient: request.user,
      sender: req.user._id,
      type: "join_accepted",
      title: "Join Request Accepted!",
      message: `Your request to join ${club.clubName} has been accepted. You're now a member!`,
      relatedClub: club._id,
      actionUrl: `/clubs/${club._id}`,
      actionLabel: "Open Club",
    });

    res.json({ message: "Request accepted" });
  } catch (err) {
    console.error("acceptJoinRequest:", err);
    res.status(500).json({ message: "Failed to accept request" });
  }
};

/* =========================
   REJECT JOIN REQUEST
========================= */
const rejectJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await JoinRequest.findById(requestId);
    if (!request || request.club.toString() !== req.club._id.toString()) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    request.rejectionReason = reason || "";
    request.respondedAt = new Date();
    await request.save();

    const club = await Club.findById(req.club._id);

    await sendNotification({
      app: req.app,
      recipient: request.user,
      sender: req.user._id,
      type: "join_rejected",
      title: "Join Request Declined",
      message: reason
        ? `Your request to join ${club.clubName} was declined: ${reason}`
        : `Your request to join ${club.clubName} was declined.`,
      relatedClub: club._id,
      actionUrl: `/clubs`,
      actionLabel: "Browse Clubs",
    });

    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error("rejectJoinRequest:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

const getUserByEmail = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};


/* =========================
   FOLLOW CLUB
========================= */
const followClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isMember = club.members.some(
      (m) => m.user.toString() === userId.toString(),
    );
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    await Club.findByIdAndUpdate(clubId, {
      $addToSet: { followers: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followedClubs: clubId },
    });

    return res.status(200).json({ message: "Club followed successfully" });
  } catch (err) {
    console.error("followClub error:", err);
    return res.status(500).json({ message: "Failed to follow club" });
  }
};

/* =========================
   LEAVE CLUB
========================= */
const leaveClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    await Club.findByIdAndUpdate(clubId, {
      $pull: { members: { user: userId } },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { joinedClubs: clubId },
    });

    return res.json({ message: "Left club successfully" });
  } catch (err) {
    console.error("leaveClub error:", err);
    return res.status(500).json({ message: "Failed to leave club" });
  }
};

/* =========================
   UNFOLLOW CLUB
========================= */
const unfollowClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    await Club.findByIdAndUpdate(clubId, {
      $pull: { followers: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followedClubs: clubId },
    });

    return res.json({ message: "Unfollowed club" });
  } catch (err) {
    console.error("unfollowClub error:", err);
    return res.status(500).json({ message: "Failed to unfollow club" });
  }
};

/* =========================
   GET JOINED CLUBS (PROFILE)
========================= */
const getJoinedClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "joinedClubs",
        match: { isActive: true },
        select: "clubName clubIcon description createdBy members followers",
      });

    return res.status(200).json({
      clubs: user.joinedClubs || [],
    });
  } catch (err) {
    console.error("getJoinedClubs error:", err);
    return res.status(500).json({ message: "Failed to fetch joined clubs" });
  }
};

/* =========================
   GET FOLLOWED CLUBS (PROFILE)
========================= */
const getFollowedClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "followedClubs",
        match: { isActive: true },
        select: "clubName clubIcon description createdBy members followers",
      });

    return res.status(200).json({
      clubs: user.followedClubs || [],
    });
  } catch (err) {
    console.error("getFollowedClubs error:", err);
    return res.status(500).json({ message: "Failed to fetch followed clubs" });
  }
};

/* =========================
   GET ATTENDED EVENTS (PROFILE)
========================= */
const getAttendedEvents = async (req, res) => {
  try {
    // Later you will populate from Event model
    return res.status(200).json({
      events: [],
    });
  } catch (err) {
    console.error("getAttendedEvents error:", err);
    return res.status(500).json({ message: "Failed to fetch events" });
  }
};

const getAdminClubData = async (req, res) => {
  try {
    const now = new Date();

    
    const club = await Club.findById(req.params.clubId)
    .populate("members.user", "fullName profilePic email")
    .populate("followers", "fullName profilePic");
    
    club.announcements = club.announcements.filter(
      (a) => !a.expiresAt || a.expiresAt > now
    );
    return res.json({ club });
  } catch (err) {
    console.error("getAdminClubData:", err);
    res.status(500).json({ message: "Failed to fetch admin data" });
  }
};

const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Default role is moderator when adding directly
    const memberRole = role || "moderator";

    // ✅ atomic add (no duplicates possible)
    const updatedClub = await Club.findOneAndUpdate(
      {
        _id: req.params.clubId,
        "members.user": { $ne: user._id }, // only if not already member
      },
      {
        $push: { members: { user: user._id, role: memberRole, joinedAt: new Date() } },
      },
      { new: true }
    );

    // ❗ If null → already member
    if (!updatedClub) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Also update the user's joinedClubs array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { joinedClubs: updatedClub._id },
    });

    return res.json({ message: "Member added", club: updatedClub });
  } catch (err) {
    console.error("addMember:", err);
    res.status(500).json({ message: "Failed to add member" });
  }
};


const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Prevent removing the club owner
    if (req.club.createdBy.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove the club owner" });
    }

    req.club.members = req.club.members.filter(
      (m) => m.user.toString() !== memberId
    );

    await req.club.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    console.error("removeMember:", err);
    res.status(500).json({ message: "Failed to remove member" });
  }
};

const changeMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    if (!["moderator", "member", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const member = req.club.members.find(
      (m) => m.user.toString() === memberId
    );

    if (!member) return res.status(404).json({ message: "Member not found" });

    member.role = role;
    await req.club.save();

    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("changeMemberRole:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

const getCreatedClubs = async (req, res) => {
  try {
    const clubs = await Club.find({
      createdBy: req.user._id,
      isActive: true,
    }).select("clubName clubIcon description members followers createdAt");

    return res.status(200).json({ clubs });
  } catch (err) {
    console.error("getCreatedClubs error:", err);
    return res.status(500).json({ message: "Failed to fetch created clubs" });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, image, audience, duration } = req.body;

    if (!title || !message)
      return res.status(400).json({ message: "Title & message required" });

    // duration in minutes
    const expiresAt = duration
      ? new Date(Date.now() + duration * 60 * 1000)
      : null;

    // Handle image upload
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    } else if (image && image.startsWith("data:")) {
      // Handle base64 images
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const { uploadBufferToCloudinary } = require("../middleware/multer.middleware");
      const result = await uploadBufferToCloudinary(buffer);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const club = await Club.findByIdAndUpdate(
      req.club._id,
      {
        $push: {
          announcements: {
            $each: [{ title, message, image: imageUrl, audience, expiresAt }],
            $position: 0,
          },
        },
      },
      { new: true }
    );

    res.json({ club });
  } catch (err) {
    console.error("createAnnouncement:", err);
    res.status(500).json({ message: "Failed to create announcement" });
  }
};


const getAnnouncements = async (req, res) => {
  try {
    res.json({ announcements: req.club.announcements });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    await Club.findByIdAndUpdate(req.club._id, {
      $pull: { announcements: { _id: announcementId } },
    });

    res.json({ message: "Announcement deleted" });
  } catch (err) {
    console.error("deleteAnnouncement:", err);
    res.status(500).json({ message: "Failed to delete announcement" });
  }
};


module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  followClub,
  leaveClub,
  unfollowClub,
    // PROFILE
  getJoinedClubs,
  getFollowedClubs,
  getAttendedEvents,

  getAdminClubData,
  addMember,
  removeMember,
  changeMemberRole,
  getCreatedClubs,
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getUserByEmail
};
