const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  department: { type: String },
  year: { type: String, enum: ["1st", "2nd", "3rd", "4th", "Graduate"] },
  studentId: { type: String },
  phone: { type: String },
  profileVisibility: { type: String, enum: ["public", "internal"], default: "public" },
  showEmail: { type: Boolean, default: true },
  showPhone: { type: Boolean, default: false },
  showDepartment: { type: Boolean, default: true },
  headRoles: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    role: { type: String },
    since: { type: Date, default: Date.now },
  }],
  linkedIn: { type: String },
  twitter: { type: String },
  eventsAttended: { type: Number, default: 0 },
  clubsJoined: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
