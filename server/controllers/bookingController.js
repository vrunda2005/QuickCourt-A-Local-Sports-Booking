const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.log('⚠ Razorpay credentials not found, using mock system');
    razorpay = null;
  }
} catch (error) {
  console.log('⚠ Razorpay initialization failed, using mock system:', error.message);
  razorpay = null;
}

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        error: 'Amount, currency, and receipt are required',
      });
    }

    if (!razorpay) {
      console.log('🔧 Creating mock order for testing');
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.json({
        success: true,
        orderId: mockOrderId,
        message: 'Mock order created successfully (for testing)',
        isMock: true,
      });
      return;
    }

    const options = {
      amount,
      currency: currency || 'INR',
      receipt,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    res.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully',
      isMock: false,
    });
  } catch (err) {
    console.error('❌ Error creating order:', err.message);

    if (
      err.message.includes('Invalid key') ||
      err.message.includes('authentication') ||
      err.message.includes('401')
    ) {
      console.log('🔧 Falling back to mock payment system');
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.json({
        success: true,
        orderId: mockOrderId,
        message: 'Mock order created (Razorpay credentials invalid)',
        isMock: true,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create payment order: ' + err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (razorpay_order_id && razorpay_order_id.startsWith('mock_order_')) {
      console.log('🔧 Mock payment verification successful');
      res.json({
        success: true,
        message: 'Mock payment verified successfully',
        isMock: true,
      });
      return;
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification parameters are missing',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('✅ Payment signature verified successfully');
      res.json({
        success: true,
        message: 'Payment verified successfully',
        isMock: false,
      });
    } else {
      console.log('❌ Invalid payment signature');
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }
  } catch (err) {
    console.error('❌ Error verifying payment:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment: ' + err.message,
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    console.log('User:', req.user);
    console.log('Booking payload:', req.body);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const { facility, court, date, startTime, endTime, totalAmount, paymentId, orderId } = req.body;

    if (!facility || !court || !date || !startTime || !endTime || !totalAmount) {
      console.log('Missing fields:', { facility, court, date, startTime, endTime, totalAmount });
      return res.status(400).json({
        success: false,
        error: 'All required fields are missing',
      });
    }

    const facilityExists = await Facility.findById(facility);
    console.log('Facility exists:', !!facilityExists);
    if (!facilityExists) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found',
      });
    }

    const existingBooking = await Booking.findOne({
      facility,
      court,
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $ne: 'cancelled' },
    });
    console.log('Existing booking:', existingBooking);

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked',
      });
    }

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
      status: 'booked',
    });

    console.log('Booking created:', booking);
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Court booked successfully',
    });
  } catch (err) {
    console.error('❌ Error creating booking:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking: ' + err.message,
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
    console.error('❌ Error fetching bookings:', err.message);
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
        error: 'Booking not found',
      });
    }

    console.log('✅ Booking cancelled successfully:', booking._id);
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (err) {
    console.error('❌ Error cancelling booking:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.listPublicVenues = async (_req, res) => {
  try {
    const facilities = await Facility.find().select('name location description imageUrl');
    res.json({ success: true, data: facilities });
  } catch (err) {
    console.error('❌ Error fetching venues:', err.message);
    res.status(500).json({ error: err.message });
  }
};
