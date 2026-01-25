const express = require("express");
const { signup, login, logout, sendOtp } = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.post("/sendOtp",sendOtp);
authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.post("/logout",logout);

module.exports = {authRoutes}    