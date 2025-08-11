const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    if (!amount || !currency || !receipt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount, currency, and receipt are required' 
      });
    }

    // In a real implementation, you would integrate with Razorpay API here
    // For now, we'll create a mock order ID
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order details in session or temporary storage
    // This would typically be stored in a database or Redis for production
    
    res.json({ 
      success: true, 
      orderId: mockOrderId,
      message: 'Order created successfully'
    });
    
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment order' 
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { facility, court, date, startTime, endTime, totalAmount, paymentId, orderId } = req.body;
    
    if (!facility || !court || !date || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        error: 'All required fields are missing' 
      });
    }

    // Check if the facility exists
    const facilityExists = await Facility.findById(facility);
    if (!facilityExists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Facility not found' 
      });
    }

    // Check if the time slot is already booked
    const existingBooking = await Booking.findOne({
      facility,
      court,
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        error: 'This time slot is already booked' 
      });
    }

    // Create the booking
    const booking = await Booking.create({
      facility,
      court,
      user: req.user._id,
      date,
      startTime,
      endTime,
      totalAmount,
      paymentId,
      orderId,
      status: 'booked'
    });

    res.status(201).json({ 
      success: true, 
      data: booking,
      message: 'Court booked successfully' 
    });
    
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create booking' 
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('facility')
      .populate('court')
      .sort({ date: -1, startTime: -1 });
      
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      data: booking 
    });
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