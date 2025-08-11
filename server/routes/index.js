const express = require('express');
const adminRoutes = require('./adminRoutes');
const facilityRoutes = require('./facilityRoutes');
const bookingRoutes = require('./bookingRoutes');
const userRoutes = require('./userRoutes');
const courtRoutes = require('./courtRoutes');
const itemRoutes = require('./itemRoutes');


const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/facilities', facilityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);
router.use('/courts', courtRoutes);
router.use('/items', itemRoutes);


module.exports = router;
