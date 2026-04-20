const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["room", "hall", "lab", "equipment", "vehicle", "book", "other"],
    required: true
  },
  code: { type: String, required: true, unique: true },
  location: { type: String },
  capacity: { type: Number },
  specifications: { type: Map, of: String },
  availableDays: [{ type: Number }],
  availableStartTime: { type: String, default: "08:00" },
  availableEndTime: { type: String, default: "20:00" },
  availableFrom: { type: Date, default: null },
  availableTo: { type: Date, default: null },
  requiresApproval: { type: Boolean, default: true },
  maxBookingHours: { type: Number, default: 4 },
  advanceBookingDays: { type: Number, default: 7 },
  cooldownHours: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isScheduledResource: { type: Boolean, default: false },
  scheduledSlot: { type: Number, default: null },
  lastRenderedAt: { type: Date, default: null },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceNotes: { type: String },
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  managedByDepartment: { type: String },
  images: [{ type: String }],
  amenities: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: String },
  publisher: { type: String },
  isbn: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
