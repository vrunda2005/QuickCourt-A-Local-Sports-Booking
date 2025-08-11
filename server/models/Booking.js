const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // could use Date type, but string allows "YYYY-MM-DD" easily
    required: true
  },
  timeSlot: {
    type: String, // e.g. "10:00-11:00"
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
