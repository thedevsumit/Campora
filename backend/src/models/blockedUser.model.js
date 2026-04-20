const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate blocks
blockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

const BlockedUser = mongoose.model("BlockedUser", blockedUserSchema);

module.exports = BlockedUser;
