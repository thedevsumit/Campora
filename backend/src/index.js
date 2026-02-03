const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./lib/db");
const { authRoutes } = require("./routes/auth.route");
const { clubRoutes } = require("./routes/club.route");
const userRoutes = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 

dotenv.config()

const app = express()

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173 ",
    credentials: true,
  }),
); 
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",authRoutes);

app.use("/api/users", userRoutes);


app.use("/api/clubs", clubRoutes);
app.get("/",(req,res)=>
{
    res.send({
        msg: "Server is Live!"
    })
})
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Running on port:", process.env.PORT);
  connectDB();
});
