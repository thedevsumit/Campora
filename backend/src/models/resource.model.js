const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["room", "hall", "lab", "equipment", "vehicle", "other"],
    required: true
  },
  code: { type: String, required: true, unique: true },
  location: { type: String },
  campus: { type: String },
  capacity: { type: Number },
  specifications: { type: Map, of: String },
  availableDays: [{ type: Number }],
  availableStartTime: { type: String, default: "08:00" },
  availableEndTime: { type: String, default: "20:00" },
  requiresApproval: { type: Boolean, default: true },
  maxBookingHours: { type: Number, default: 4 },
  advanceBookingDays: { type: Number, default: 7 },
  cooldownHours: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  isActive: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceNotes: { type: String },
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  managedByDepartment: { type: String },
  images: [{ type: String }],
  amenities: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
