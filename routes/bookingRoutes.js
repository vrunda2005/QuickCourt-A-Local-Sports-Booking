const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const BookingController = require('../controllers/bookingController');

const router = express.Router();

// Create Razorpay order: only User role
router.post('/create-order', requireAuth(), attachUser, requireRole(['User']), BookingController.createRazorpayOrder);

// Create and cancel bookings: only User role
router.post('/', requireAuth(), attachUser, requireRole(['User']), BookingController.createBooking);
router.delete('/:id', requireAuth(), attachUser, requireRole(['User']), BookingController.cancelBooking);

// Read own bookings: allow any signed-in role
router.get('/me', requireAuth(), attachUser, BookingController.getMyBookings);

module.exports = router;
