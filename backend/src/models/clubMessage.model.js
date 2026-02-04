const mongoose = require("mongoose");

const clubMessageSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("ClubMessage", clubMessageSchema);
