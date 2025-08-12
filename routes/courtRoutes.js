const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const CourtController = require('../controllers/courtController');

const router = express.Router();

// Create a court under a facility
router.post('/', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.createCourt);

// List courts for a facility (owner scope)
router.get('/facility/:facilityId', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.getCourtsByFacility);

// Update a court
router.put('/:id', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.updateCourt);

// Delete a court
router.delete('/:id', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.deleteCourt);

module.exports = router;
