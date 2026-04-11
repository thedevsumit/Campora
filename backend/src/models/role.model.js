const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isSystemRole: { type: Boolean, default: false },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  scope: { type: String, enum: ["system", "club"], default: "system" },
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
