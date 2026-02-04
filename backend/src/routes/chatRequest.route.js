const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  sendChatRequest,
  getIncomingRequests,
} = require("../controllers/chatRequest.controller");
const { acceptRequest } = require("../controllers/chatRequest.controller");
const { rejectRequest } = require("../controllers/chatRequest.controller");
const { getConversations } = require("../controllers/privateChat.controller");

const chatRouter = express.Router();

chatRouter.post("/request/:receiverId", protectRoute, sendChatRequest);
chatRouter.get("/requests", protectRoute, getIncomingRequests);
chatRouter.post("/accept/:requestId", protectRoute, acceptRequest);
chatRouter.post("/reject/:requestId", protectRoute, rejectRequest);
chatRouter.get("/conversations", protectRoute, getConversations);

module.exports = chatRouter;
