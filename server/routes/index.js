const express = require('express');
const userRoutes = require('./userRoutes');
const facilityRoutes = require('./facilityRoutes');
const courtRoutes = require('./courtRoutes');
const bookingRoutes = require('./bookingRoutes');
const itemRoutes = require('./itemRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/courts', courtRoutes);
router.use('/bookings', bookingRoutes);
router.use('/items', itemRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
