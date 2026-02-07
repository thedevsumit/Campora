// routes/clubChat.route.js
const express = require("express");
const router = express.Router();
const {
  getClubMessages,
  sendClubMessage,
} = require("../controllers/clubChat.controller");
const protect = require("../middleware/auth.middleware");

router.get("/:clubId/messages", protect, getClubMessages);
router.post("/:clubId/messages", protect, sendClubMessage);

module.exports = router;
