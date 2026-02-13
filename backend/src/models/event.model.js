const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },

    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },

    maxParticipants: { type: Number, default: 50 },

    registrations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
        phone: String,
        year: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
