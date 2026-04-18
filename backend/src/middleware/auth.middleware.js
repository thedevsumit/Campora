const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protectRoute = async (req, res, next) => {
    try {
        // Support both cookie and URL query param (for OAuth redirect flow)
        const cookie = req.cookies.token
        const queryToken = req.query.token
        const token = cookie || queryToken

        if (!token) {
            return res.status(401).json({
                msg: "Unauthorized -> No token found"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                msg: "Unauthorized -> Invalid token"
            })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({
                msg: "User not found"
            })

        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            msg: "Interal server error"
        })
    }
}
module.exports = protectRoute