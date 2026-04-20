const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { signup, login, logout, sendOtp, checkAuth, getBrowseUsers, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const protectRoute = require("../middleware/auth.middleware");
const { otpLimiter, authLimiter } = require("../middleware/rateLimit.middleware");
const authRoutes = express.Router();

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProd
  ? (process.env.FRONTEND_URL_PRODUCTION || "https://campora-8kb0.onrender.com")
  : "http://localhost:5173";

const signAndSendToken = (user, res) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    userRole: user.userRole,
    fullName: user.fullName,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const dest = `${FRONTEND_URL}/home`;
  res.send(`<html><body><script>window.opener && window.opener.location ? window.opener.location.href = '${dest}?token=${token}' : window.location.href = '${dest}?token=${token}';window.close();</script></body></html>`);
};

authRoutes.get("/google", passport.authenticate("google", { session: false }));

authRoutes.get("/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,
    }, (err, user) => {
      if (err || !user) {
        console.error("Google OAuth Error:", err);
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
      const token = signToken(user); 

      return res.redirect(
        `${FRONTEND_URL}/oauth-success?token=${token}`
      );
    })(req, res, next);
  }
);


authRoutes.post("/sendOtp", otpLimiter, sendOtp);
authRoutes.post("/signup", authLimiter, signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/forgot-password", otpLimiter, forgotPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);
authRoutes.get("/check", protectRoute, checkAuth);
authRoutes.get("/browse-users", protectRoute, getBrowseUsers);

module.exports = { authRoutes };
