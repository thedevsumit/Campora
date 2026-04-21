const User = require("../models/user.model");
const { uploadToCloudinary } = require("../middleware/multer.middleware");

/* =========================
   UPDATE PROFILE
========================= */
const updateProfile = async (req, res) => {
  try {
    const { fullName, dept, about } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (dept) updateData.dept = dept.trim();
    if (about) updateData.about = about.trim();

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      updateData.profilePic = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  updateProfile,
};