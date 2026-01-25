const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./lib/db");
const { authRoutes } = require("./routes/auth.route");

dotenv.config()

const app = express()
app.use(express.json());
app.use("/api/auth",authRoutes)
app.get("/",(req,res)=>
{
    res.send({
        msg: "Server is Live!"
    })
})
app.listen(process.env.PORT,()=>
{
    console.log("Running on the port number : " , process.env.PORT)
    connectDB();
})