const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const BookingController = require('../controllers/bookingController');

const router = express.Router();

// Create Razorpay order - only Users
router.post(
  '/create-order',
  requireAuth(),
  attachUser,
  requireRole(['User']),
  BookingController.createRazorpayOrder
);

// Create booking - only Users
router.post('/', requireAuth(), attachUser, requireRole(['User']), BookingController.createBooking);

// Cancel booking - only Users
router.delete('/:id', requireAuth(), attachUser, requireRole(['User']), BookingController.cancelBooking);

// Get current user's bookings (any signed-in role)
router.get('/me', requireAuth(), attachUser, BookingController.getMyBookings);

module.exports = router;
