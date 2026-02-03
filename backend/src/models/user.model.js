const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    about: { type: String, required: false, default: "This user hasn’t added a about yet. Clubs are better when people know who you are!" },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    dept: { type: String, required: true },
    year: { type: String, required: true },

    joinedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],

    followedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
