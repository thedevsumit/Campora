const rateLimit = require("express-rate-limit");

// Strict limit for OTP operations (3 requests per 15 minutes)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
});

// Moderate limit for auth operations (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many attempts. Please try again after 15 minutes.",
    retryAfter: Math.ceil(15 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit for resource creation (10 requests per hour)
const createResourceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    message: "Too many resources created. Please try again after an hour.",
    retryAfter: Math.ceil(60 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for events (5 events per hour)
const eventCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: "Too many events created. Please try again after an hour.",
    retryAfter: Math.ceil(60 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for announcements (5 announcements per hour)
const announcementCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: "Too many announcements created. Please try again after an hour.",
    retryAfter: Math.ceil(60 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  otpLimiter,
  authLimiter,
  createResourceLimiter,
  eventCreateLimiter,
  announcementCreateLimiter,
};
