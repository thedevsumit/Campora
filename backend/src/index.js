const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./lib/db");
const { authRoutes } = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 

dotenv.config()

const app = express()

app.use(cookieParser());
app.use(
  cors({
    // origin: "https://gochatlly.onrender.com",
    origin: "http://localhost:5174",
    credentials: true,
  }),
); 
app.use(express.json());
app.use("/api/auth",authRoutes)
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
