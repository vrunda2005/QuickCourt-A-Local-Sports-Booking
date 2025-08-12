const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    if (!req.auth || typeof req.auth !== 'function') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { userId } = req.auth();
    if (!userId) {
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
        role: 'User'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
