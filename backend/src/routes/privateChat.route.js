const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const {
  getMessages,
  sendMessage,
  sendImageMessage,
  blockUser,
} = require("../controllers/privateChat.controller");

const privateRouter = express.Router();

privateRouter.get("/messages/:userId", protectRoute, getMessages);
privateRouter.post("/messages/:userId", protectRoute, sendMessage);
privateRouter.post("/messages/:userId/image", protectRoute, upload.single("image"), sendImageMessage);
privateRouter.post("/block/:userId", protectRoute, blockUser);

module.exports = privateRouter;
