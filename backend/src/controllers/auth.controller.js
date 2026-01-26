const bcrpyt = require("bcryptjs");
const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const sendOtpMail = require("../lib/sendMail");
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

    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "OTP sending failed", error: err.message });
  }
};
const signup = async (req, res) => {
  const { fullName, password, email, profilePic, dept, year, otp } = req.body;

  try {
    if (!fullName || !password || !email || !dept || !year || !otp) {
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

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      return res.status(400).json({
        msg: "OTP not found or expired",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({
        msg: "OTP expired, resend OTP",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        msg: "Invalid OTP",
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

    generateToken(newUser._id, res);
    await newUser.save();

    await Otp.deleteMany({ email });

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      dept: newUser.dept,
      year: newUser.year,
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
    generateToken(user._id, res);
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      _id: user._id,
      year: user.year,
      dept: user.dept,
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
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "None",
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

module.exports = { signup, login, logout, sendOtp, checkAuth };
