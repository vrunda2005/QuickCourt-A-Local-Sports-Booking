const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const AdminController = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth());
router.use(attachUser);
router.use(requireRole(['Admin']));

// Admin dashboard statistics
router.get('/stats', AdminController.getDashboardStats);

// Facility management
router.get('/facilities/pending', AdminController.getPendingFacilities);
router.put('/facilities/:id/approve', AdminController.approveFacility);
router.put('/facilities/:id/reject', AdminController.rejectFacility);

// User management
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);

// Reports
router.get('/reports/overview', AdminController.getOverviewReport);
router.get('/reports/bookings', AdminController.getBookingsReport);

module.exports = router;
