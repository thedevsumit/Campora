const mongoose = require("mongoose");

const privateMessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PrivateMessage", privateMessageSchema);
