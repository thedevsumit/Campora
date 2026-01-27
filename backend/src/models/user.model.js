const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    dept: {
      type: String,
      required: true,
      default: "",
    },
    year: {
      type: String,
      required: true,
      default: "first year",
    },
    role:
    {
      type: String,
      default: "Member"
    }
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
module.exports = User;
