const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  court: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // "YYYY-MM-DD" format
    required: true
  },
  startTime: {
    type: String, // "HH:MM" format
    required: true
  },
  endTime: {
    type: String, // "HH:MM" format
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: false
  },
  orderId: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked'
  },
  // Keep the old timeSlot field for backward compatibility
  timeSlot: {
    type: String, // e.g. "10:00-11:00"
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
