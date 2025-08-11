const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../utils/clerk");

// ===== Existing =====

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

// ===== NEW: Dashboard stats =====
router.get("/overview", verifyAdmin, adminController.getOverview);
router.get("/stats/bookings-activity", verifyAdmin, adminController.getBookingsActivity);
router.get("/stats/user-registrations", verifyAdmin, adminController.getUserRegistrations);
router.get("/stats/approval-trend", verifyAdmin, adminController.getApprovalTrend);
router.get("/stats/active-sports", verifyAdmin, adminController.getActiveSports);
router.get("/stats/earnings-simulation", verifyAdmin, adminController.getEarningsSimulation);

// ===== NEW: Reports =====
router.get("/reports", verifyAdmin, adminController.getReports);
router.put("/reports/:id/resolve", verifyAdmin, adminController.resolveReport);

// ===== NEW: Admin Profile =====
router.get("/profile", verifyAdmin, adminController.getProfile);
router.put("/profile", verifyAdmin, adminController.updateProfile);

// ===== NEW: User booking history =====
router.get("/user/:id/bookings", verifyAdmin, adminController.getUserBookings);

module.exports = router;

/*const express = require("express");
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

router.get("/bookings", verifyAdmin, adminController.getAllBookings);

module.exports = router;
*/