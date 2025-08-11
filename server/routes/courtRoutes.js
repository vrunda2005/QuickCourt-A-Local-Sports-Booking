const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const CourtController = require('../controllers/courtController');

const router = express.Router();

router.post('/', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.createCourt);
router.get('/facility/:facilityId', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.getCourtsByFacility);
router.put('/:id', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.updateCourt);
router.delete('/:id', requireAuth(), attachUser, requireRole(['FacilityOwner']), CourtController.deleteCourt);

module.exports = router;
