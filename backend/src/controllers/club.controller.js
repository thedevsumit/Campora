const mongoose  = require("mongoose");
const Club = require("../models/club.model");


 const createClub = async (req, res) => {
  try {
    const { clubName, clubIcon, description } = req.body;

    if (!clubName || !description) {
      return res.status(400).json({
        message: "clubName and description are required",
      });
    }

    const exists = await Club.findOne({ clubName: clubName.trim() });
    if (exists) {
      return res.status(409).json({ message: "Club already exists" });
    }

    const club = await Club.create({
      clubName: clubName.trim(),
      clubIcon: clubIcon || "",
      description: description.trim(),
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (err) {
    console.log("❌ createClub error:", err);
    return res.status(500).json({ message: err.message });
  }

};


 const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("clubName clubIcon description createdBy createdAt");

    return res.status(200).json({ clubs });
  } catch (err) {
    console.log("getAllClubs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


 const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid clubId" });
    }

    const club = await Club.findById(clubId);

    if (!club || !club.isActive) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json({ club });
  } catch (err) {
    console.log("getClubById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


 const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { clubName, clubIcon, description } = req.body;

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
    if (clubIcon !== undefined) club.clubIcon = clubIcon;
    if (description) club.description = description.trim();

    await club.save();

    return res.status(200).json({
      message: "Club updated successfully",
      club,
    });
  } catch (err) {
    console.log("updateClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

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
    console.log("deleteClub error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {deleteClub,updateClub,getAllClubs,getClubById,createClub}