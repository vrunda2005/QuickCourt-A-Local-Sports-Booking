const Facility = require("../models/Facility");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Report = require("../models/Report"); // new
const mongoose = require("mongoose");


// ===== Dashboard Stats =====
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFacilities = await Facility.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingFacilities = await Facility.countDocuments({ status: "pending" });

    res.json({ totalUsers, totalFacilities, totalBookings, pendingFacilities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingsActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data.map(d => ({ date: d._id, bookings: d.bookings })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data.map(d => ({ date: d._id, users: d.users })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApprovalTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const data = await Facility.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, status: "$status" },
          count: { $sum: 1 }
        }
      }
    ]);

    const trend = {};
    data.forEach(d => {
      if (!trend[d._id.date]) {
        trend[d._id.date] = { date: d._id.date, approved: 0, rejected: 0 };
      }
      if (d._id.status === "approved") trend[d._id.date].approved = d.count;
      if (d._id.status === "rejected") trend[d._id.date].rejected = d.count;
    });

    res.json(Object.values(trend));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveSports = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const data = await Facility.aggregate([
      { $group: { _id: "$sport", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: limit }
    ]);

    res.json(data.map(d => ({ name: d._id, value: d.value })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEarningsSimulation = async (req, res) => {
  try {
    // Example: sum booking price by month
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          earnings: { $sum: "$price" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data.map(d => ({ month: d._id, earnings: d.earnings })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== Reports =====
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("userId").populate("facilityId");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, { status: "resolved" });
    res.json({ message: "Report resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== Admin Profile =====
exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== User Booking History =====
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id }).populate("courtId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
