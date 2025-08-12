const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const { storage } = require('../utils/cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const FacilityController = require('../controllers/facilityController');

const router = express.Router();

// Public listing
router.get('/', FacilityController.getFacilities);

// Admin facility approval
router.get('/pending', requireAuth(), attachUser, requireRole(['Admin']), FacilityController.getPendingFacilities);
router.put('/:id/approve', requireAuth(), attachUser, requireRole(['Admin']), FacilityController.approveFacility);

// Owner routes
router.get('/mine', requireAuth(), attachUser, requireRole(['FacilityOwner']), FacilityController.getMyFacilities);
router.post('/', requireAuth(), attachUser, requireRole(['FacilityOwner']), upload.single('image'), FacilityController.createFacility);

// Public details (must be last to avoid conflicts)
router.get('/:id', FacilityController.getFacilityById);

module.exports = router;
