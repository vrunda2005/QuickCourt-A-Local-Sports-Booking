// server/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["user", "facility"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "targetType" },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
