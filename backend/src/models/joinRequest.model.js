const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending", index: true },
  rejectionReason: { type: String, default: "" },
  respondedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

joinRequestSchema.index({ club: 1, user: 1 }, { unique: true });
joinRequestSchema.index({ club: 1, status: 1 });

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
