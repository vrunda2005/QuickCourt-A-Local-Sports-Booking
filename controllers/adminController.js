const User = require('../models/User');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFacilities = await Facility.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({
      success: true,
      data: { totalUsers, totalFacilities, totalBookings }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['User', 'FacilityOwner', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
