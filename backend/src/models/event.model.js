const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "General" },

  date: { type: Date },
  time: { type: String },
  venue: { type: String },

  isMultiDay: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },

  maxParticipants: { type: Number, default: 50 },
  minParticipants: { type: Number, default: 0 },

  collaboratingClubs: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    status: { type: String, enum: ["invited", "accepted", "declined"], default: "invited" },
    contribution: { type: String },
  }],
  leadClub: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },

  status: {
    type: String,
    enum: ["draft", "pending_approval", "approved", "rejected", "completed", "cancelled"],
    default: "draft"
  },
  rejectionReason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },

  budget: {
    estimated: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    lineItems: [{
      item: { type: String },
      estimatedCost: { type: Number },
      approvedCost: { type: Number },
      actualCost: { type: Number },
      status: { type: String, enum: ["pending", "approved", "rejected"] }
    }]
  },

  registrations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    year: String,
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["registered", "waitlisted", "cancelled"], default: "registered" },
    attended: { type: Boolean, default: false },
    feedback: { type: String }
  }],

  eventType: {
    type: String,
    enum: ["single_club", "inter_club", "college_wide", "open"],
    default: "single_club"
  },

  bookedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],

  isActive: { type: Boolean, default: true },

  tags: [{ type: String }],
  coverImage: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
