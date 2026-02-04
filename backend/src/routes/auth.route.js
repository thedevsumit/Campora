const express = require("express");
const { signup, login, logout, sendOtp,checkAuth, getUserProfile } = require("../controllers/auth.controller");
const protectRoute = require("../middleware/auth.middleware");
const authRoutes = express.Router();

authRoutes.post("/sendOtp",sendOtp);
authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.post("/logout",logout);
// authRoutes.put("/profile",protectRoute,profile)
authRoutes.get("/check",protectRoute,checkAuth)


module.exports = {authRoutes}    