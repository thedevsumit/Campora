const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  getMessages,
  sendMessage,
} = require("../controllers/privateChat.controller");

const privateRouter = express.Router();

privateRouter.get("/messages/:userId", protectRoute, getMessages);
privateRouter.post("/messages/:userId", protectRoute, sendMessage);

module.exports = privateRouter;
