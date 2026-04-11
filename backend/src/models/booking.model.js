const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  slots: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled", "completed"],
    default: "pending"
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  purpose: { type: String, required: true },
  setupRequirements: { type: String },
  totalCost: { type: Number, default: 0 },
  actualStartTime: { type: Date },
  actualEndTime: { type: Date },
  usageNotes: { type: String },
  conditionNotes: { type: String },
  conflictingBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
