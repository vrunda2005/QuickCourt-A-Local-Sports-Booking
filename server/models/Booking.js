const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: "Court" }, // optional, if you store courts separately
  date: { type: Date, required: true },
  slot: { type: String, required: true }, // e.g., "10:00-11:00"
  price: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
