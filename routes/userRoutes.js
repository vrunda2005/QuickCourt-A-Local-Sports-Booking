// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { requireAuth } = require('../utils/clerk');
const User = require('../models/User');
const AuthController = require('../controllers/authController');

// Sync current Clerk user into DB
router.post('/sync', requireAuth(), AuthController.syncUser);

// Create/update user; block Admin role here
router.post('/', requireAuth(), async (req, res) => {
  try {
    const { clerkUserId, email, name, avatar, role } = req.body;
    if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId is required' });

    const safeRole = role === 'Admin' ? 'User' : (role || 'User');

    const existing = await User.findOne({ clerkUserId });
    if (existing) {
      existing.email = email ?? existing.email;
      existing.name = name ?? existing.name;
      existing.avatar = avatar ?? existing.avatar;
      if (existing.role !== 'Admin') existing.role = safeRole;
      await existing.save();
      return res.json({ message: 'User updated', user: existing });
    }

    const created = await User.create({ clerkUserId, email, name, avatar, role: safeRole });
    return res.status(201).json({ message: 'User created', user: created });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get current signed-in user's profile (with role)
router.get('/me', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
