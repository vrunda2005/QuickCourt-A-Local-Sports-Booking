const express = require('express');
const { requireAuth } = require('../utils/clerk');
const attachUser = require('../middleware/attachUser');
const requireRole = require('../middleware/requireRole');
const AdminController = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', requireAuth, attachUser, requireRole(['Admin']), AdminController.getStats);
router.put('/users/:id/role', requireAuth, attachUser, requireRole(['Admin']), AdminController.updateUserRole);

// Promotion endpoint guarded by ADMIN_SECRET (not visible in UI except admin-unlock)
router.post('/promote', requireAuth, attachUser, async (req, res) => {
  try {
    const { secret } = req.body;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Invalid secret' });
    }
    req.user.role = 'Admin';
    await req.user.save();
    return res.json({ message: 'User promoted to Admin' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
