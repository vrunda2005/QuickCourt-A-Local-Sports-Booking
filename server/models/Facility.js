const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  sports: [String],
  pricePerHour: { type: Number, required: true },
  amenities: [String],
  photos: [String],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Facility", facilitySchema);
