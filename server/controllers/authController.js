const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const clerkUserId = userId;
    let user = await User.findOne({ clerkUserId });

    if (!user) {
      const profile = await clerkClient.users.getUser(clerkUserId);
      user = await User.create({
        clerkUserId,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        email: profile.emailAddresses[0]?.emailAddress,
        avatar: profile.imageUrl,
        role: 'User'
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
