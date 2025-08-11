const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../utils/clerk");

// Facility approval
router.get("/facilities/pending", verifyAdmin, adminController.getPendingFacilities);
router.put("/facility/:id/approve", verifyAdmin, adminController.approveFacility);
router.put("/facility/:id/reject", verifyAdmin, adminController.rejectFacility);

// User management
router.get("/users", verifyAdmin, adminController.getAllUsers);
router.put("/user/:id/ban", verifyAdmin, adminController.banUser);
router.put("/user/:id/unban", verifyAdmin, adminController.unbanUser);

// Booking management (optional)
router.get("/bookings", verifyAdmin, adminController.getAllBookings);

module.exports = router;
