const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

exports.createBooking = async (req, res) => {
  try {
    const { facilityId, date, timeSlot } = req.body;
    if (!facilityId || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) return res.status(404).json({ error: 'Facility not found' });

    const bookingExists = await Booking.findOne({ facility: facilityId, date, timeSlot });
    if (bookingExists) return res.status(400).json({ error: 'Time slot already booked' });

    const booking = await Booking.create({
      facility: facilityId,
      user: req.user._id,
      date,
      timeSlot
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('facility');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listPublicVenues = async (_req, res) => {
  try {
    const facilities = await Facility.find().select('name location description imageUrl');
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};