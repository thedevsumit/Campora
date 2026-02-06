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

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174", // ⚠️ removed extra space
    credentials: true,
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

app.get("/", (req, res) => {
  res.send({ msg: "Server is Live!" });
});

/* ================= SOCKET.IO SETUP ================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
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
