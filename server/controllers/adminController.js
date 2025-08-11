const User = require('../models/User');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalFacilities, pendingFacilities, totalBookings] = await Promise.all([
      User.countDocuments(),
      Facility.countDocuments({ status: 'approved' }),
      Facility.countDocuments({ status: 'pending' }),
      Booking.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFacilities,
        pendingFacilities,
        totalBookings
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get pending facilities
exports.getPendingFacilities = async (req, res) => {
  try {
    const pendingFacilities = await Facility.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pendingFacilities
    });
  } catch (error) {
    console.error('Error getting pending facilities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending facilities'
    });
  }
};

// Approve facility
exports.approveFacility = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facility = await Facility.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    ).populate('owner', 'name email');

    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: facility,
      message: 'Facility approved successfully'
    });
  } catch (error) {
    console.error('Error approving facility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve facility'
    });
  }
};

// Reject facility
exports.rejectFacility = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facility = await Facility.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    ).populate('owner', 'name email');

    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: facility,
      message: 'Facility rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting facility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject facility'
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['User', 'FacilityOwner', 'Admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
};

// Get overview report
exports.getOverviewReport = async (req, res) => {
  try {
    const [totalUsers, totalFacilities, totalBookings] = await Promise.all([
      User.countDocuments(),
      Facility.countDocuments({ status: 'approved' }),
      Booking.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFacilities,
        totalBookings,
        reportDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting overview report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview report'
    });
  }
};

// Get bookings report
exports.getBookingsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('facility', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error getting bookings report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings report'
    });
  }
};
