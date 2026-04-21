const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./lib/db");
const { authRoutes } = require("./routes/auth.route");
const clubRoutes = require("./routes/club.route");
const userRoutes = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const { initializePassport } = require("./lib/passport");

const chatRouter = require("./routes/chatRequest.route");
const privateRouter = require("./routes/privateChat.route");

const { eventRoutes } = require("./routes/event.route");
const roleRouter = require("./routes/role.route");
const profileRouter = require("./routes/profile.route");
const resourceRouter = require("./routes/resource.route");
const bookingRouter = require("./routes/booking.route");
const notificationRouter = require("./routes/notification.route");
const analyticsRouter = require("./routes/analytics.route");
const chatRoomRouter = require("./routes/chatRoom.route");

const http = require("http");
const { Server } = require("socket.io");
const adminRouter = require("./routes/admin.route");
const clubManageRoutes = require("./routes/club.manage.routes");
const { scheduleMidnightRender } = require("./lib/scheduler");

dotenv.config();

// Check online status for given user IDs


const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProd
  ? (process.env.FRONTEND_URL_PRODUCTION || "https://campora-8kb0.onrender.com")
  : "http://localhost:5173";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: isProd
      ? FRONTEND_URL
      : ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

initializePassport(passport);
app.use(passport.initialize());
app.post("/api/users/online-status", (req, res) => {
  const { userIds } = req.body;
  if (!Array.isArray(userIds))
    return res.status(400).json({ message: "userIds array required" });
  const result = userIds.map((id) => ({
    userId: id,
    isOnline: onlineUsers.has(id) && onlineUsers.get(id).size > 0,
  }));
  res.json({ result });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/chats", privateRouter);
app.use("/api/clubs", clubRoutes);
app.use("/api/clubs", require("./routes/clubChat.route"));
app.use("/api/events", eventRoutes);
app.use("/api/roles", roleRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/chatrooms", chatRoomRouter);
app.use("/api/admin", adminRouter);
app.use("/api/clubs", clubManageRoutes);
app.use("/api/feed", require("./routes/feed.route"));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal server error" });
});

app.get("/", (req, res) => { res.send({ msg: "Server is Live!" }); });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: isProd ? FRONTEND_URL : ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    io.emit("userStatus", { userId, status: "online" });
  });

  socket.on("joinClub", (clubId) => { socket.join("club_" + clubId); });
  socket.on("leaveClub", (clubId) => { socket.leave("club_" + clubId); });
  socket.on("joinNotifications", (userId) => { socket.join("notifications_" + userId); });

  socket.on("disconnect", () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit("userStatus", { userId, status: "offline" });
      }
    }
  });
});

app.set("io", io);

server.listen(process.env.PORT, "0.0.0.0", () => {
  connectDB();
  scheduleMidnightRender(null);
});
