const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./lib/db");
const { authRoutes } = require("./routes/auth.route");
const  clubRoutes  = require("./routes/club.route");
const userRoutes = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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



dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */
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
app.use("/api/admin",adminRouter)
app.use("/api/clubs", clubManageRoutes);

app.get("/", (req, res) => {
  res.send({ msg: "Server is Live!" });
});

/* ================= SOCKET.IO SETUP ================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });
  socket.on("joinClub", (clubId) => {
    socket.join(`club_${clubId}`);
  });
  socket.on("leaveClub", (clubId) => {
    socket.leave(`club_${clubId}`);
  });
  socket.on("joinNotifications", (userId) => {
    socket.join(`notifications_${userId}`);
  });
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* Allow routes to access io */
app.set("io", io);

/* ================= START SERVER ================= */
server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port:", process.env.PORT);
  connectDB();
});
