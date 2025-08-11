const Facility = require("../models/Facility");
const User = require("../models/User");
const Booking = require("../models/Booking");

// Get all pending facilities
exports.getPendingFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ status: "pending" });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve facility
exports.approveFacility = async (req, res) => {
  try {
    await Facility.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Facility approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject facility
exports.rejectFacility = async (req, res) => {
  try {
    await Facility.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Facility rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: true });
    res.json({ message: "User banned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: false });
    res.json({ message: "User unbanned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Optional) Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId").populate("courtId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
