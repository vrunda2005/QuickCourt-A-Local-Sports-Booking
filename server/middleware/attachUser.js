const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    if (!req.auth || typeof req.auth !== 'function') {
      console.log('attachUser: req.auth is missing or invalid');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.auth();
    if (!userId) {
      console.log('attachUser: userId not found in req.auth()');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      const profile = await clerkClient.users.getUser(userId);
      user = await User.create({
        clerkUserId: userId,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        email: profile.emailAddresses[0]?.emailAddress,
        avatar: profile.imageUrl,
        role: 'User',
      });
      console.log('attachUser: Created new user:', user._id);
    } else {
      console.log('attachUser: Found existing user:', user._id);
    }

    req.user = user;  // This is a full Mongoose user document
    next();
  } catch (err) {
    console.error('attachUser error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
