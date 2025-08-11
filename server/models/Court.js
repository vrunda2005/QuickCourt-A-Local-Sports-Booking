const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sportType: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  operatingHours: {
    type: String, // e.g. "08:00-22:00"
    required: true
  },
  amenities: [String],
  images: [String],
}, { timestamps: true });

module.exports = mongoose.model('Court', courtSchema);
