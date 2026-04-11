const mongoose = require("mongoose");

const clubCollaborationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  clubs: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    role: { type: String, enum: ["lead", "partner"], default: "partner" },
    status: { type: String, enum: ["invited", "accepted", "declined"], default: "invited" },
    responsibilities: { type: String },
    budgetContribution: { type: Number, default: 0 },
    agreedAt: { type: Date },
  }],
  sharedResources: [{
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    contributedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  }],
  agreementText: { type: String },
  agreedByAll: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("ClubCollaboration", clubCollaborationSchema);
