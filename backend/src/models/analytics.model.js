const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  eventStats: [{
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    registrations: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    cancellationCount: { type: Number, default: 0 },
  }],
  clubStats: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    activeMembers: { type: Number, default: 0 },
    newMembers: { type: Number, default: 0 },
    eventsConducted: { type: Number, default: 0 },
  }],
  resourceStats: [{
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    totalBookings: { type: Number, default: 0 },
    approvedBookings: { type: Number, default: 0 },
    rejectedBookings: { type: Number, default: 0 },
    utilizationHours: { type: Number, default: 0 },
  }],
  totalActiveUsers: { type: Number, default: 0 },
  totalEventsCreated: { type: Number, default: 0 },
  totalBookingsMade: { type: Number, default: 0 },
  totalBudgetAllocated: { type: Number, default: 0 },
  totalBudgetUtilized: { type: Number, default: 0 },
}, { timestamps: true });

analyticsSchema.index({ date: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
