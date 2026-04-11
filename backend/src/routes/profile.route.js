const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const UserProfile = require("../models/userProfile.model");
const User = require("../models/user.model");

const router = express.Router();

// Get own profile
router.get("/me", protectRoute, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await UserProfile.create({ user: req.user._id });
    }
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("getMyProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update own profile
router.put("/me", protectRoute, async (req, res) => {
  try {
    const { department, year, studentId, phone, profileVisibility, showEmail, showPhone, showDepartment, linkedIn, twitter } = req.body;
    let profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await UserProfile.create({ user: req.user._id });
    }
    Object.assign(profile, {
      department, year, studentId, phone, profileVisibility,
      showEmail, showPhone, showDepartment, linkedIn, twitter
    });
    await profile.save();
    return res.status(200).json({ message: "Profile updated", profile });
  } catch (error) {
    console.error("updateMyProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update visibility settings
router.put("/me/visibility", protectRoute, async (req, res) => {
  try {
    const { profileVisibility, showEmail, showPhone, showDepartment } = req.body;
    let profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await UserProfile.create({ user: req.user._id });
    }
    Object.assign(profile, { profileVisibility, showEmail, showPhone, showDepartment });
    await profile.save();
    return res.status(200).json({ message: "Visibility updated", profile });
  } catch (error) {
    console.error("updateVisibility error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get user profile (respecting visibility)
router.get("/:userId", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const profile = await UserProfile.findOne({ user: req.params.userId });
    if (profile && profile.profileVisibility === "internal") {
      if (req.user.role !== "superAdmin" && req.user.userRole !== "admin") {
        return res.status(403).json({ message: "Profile is private" });
      }
    }
    const publicProfile = {
      fullName: user.fullName,
      profilePic: user.profilePic,
      dept: profile?.showDepartment !== false ? user.dept : undefined,
      email: profile?.showEmail !== false ? user.email : undefined,
      phone: profile?.showPhone ? profile.phone : undefined,
      department: profile?.department,
      year: profile?.year,
      linkedIn: profile?.linkedIn,
      twitter: profile?.twitter,
      headRoles: profile?.headRoles || [],
      joinedClubs: user.joinedClubs,
    };
    return res.status(200).json({ profile: publicProfile });
  } catch (error) {
    console.error("getUserProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update head roles
router.put("/me/head-roles", protectRoute, async (req, res) => {
  try {
    const { headRoles } = req.body;
    let profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await UserProfile.create({ user: req.user._id });
    }
    profile.headRoles = headRoles;
    await profile.save();
    return res.status(200).json({ message: "Head roles updated", profile });
  } catch (error) {
    console.error("updateHeadRoles error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Search profiles
router.get("/search/query", protectRoute, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      fullName: { $regex: q, $options: "i" }
    }).select("-password").limit(20);
    return res.status(200).json({ users });
  } catch (error) {
    console.error("searchProfiles error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
