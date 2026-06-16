const bcrpyt = require("bcryptjs");
const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });

    await Otp.create({ email, otp, expiresAt });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "OTP sending failed", error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });

    await Otp.create({ email, otp, expiresAt });

    await sendOtpMail(email, otp, "reset");

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to send OTP", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired, please request a new one" });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const salt = await bcrpyt.genSalt(10);
    const hashPass = await bcrpyt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashPass });

    await Otp.deleteMany({ email });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to reset password", error: err.message });
  }
};
const signup = async (req, res) => {
  const { fullName, password, email, profilePic, dept, year } = req.body;

  try {
    if (!fullName || !password || !email || !dept || !year) {
      return res.status(400).json({
        msg: "All fields are not filled",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User already exists with this email",
      });
    }

    const salt = await bcrpyt.genSalt(10);
    const hashPass = await bcrpyt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      profilePic,
      password: hashPass,
      dept,
      year,
    });

    const token = generateToken(newUser._id, res);
    await newUser.save();

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      dept: newUser.dept,
      year: newUser.year,
      role: newUser.role,
      userRole: newUser.userRole,
      token,
    });
  } catch (error) {
    console.log("error in signing up : ", error);
    return res.status(500).json({
      msg: "Internal server Error",
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        msg: "Fill all the fields first",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User dont exists with this email",
      });
    }
    const isPassCorrect = await bcrpyt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }
    const token = generateToken(user._id, res);
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      _id: user._id,
      year: user.year,
      dept: user.dept,
      role: user.role,
      userRole: user.userRole,
      token,
    });
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({
      msg: "Interal server error",
    });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      msg: "Successfully logged out",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};


const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      msg: "Interal server error",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("fullName email dept about profilePic joinedClubs followedClubs")
      .populate("joinedClubs", "clubName clubIcon description")
      .populate("followedClubs", "clubName clubIcon description");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBrowseUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user._id;

    const filter = { _id: { $ne: currentUserId } };

    if (search && search.trim()) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("fullName email profilePic dept year")
      .limit(20);

    return res.status(200).json({ users });
  } catch (err) {
    console.error("getBrowseUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, logout, sendOtp, checkAuth, getUserProfile, getBrowseUsers, forgotPassword, resetPassword };
