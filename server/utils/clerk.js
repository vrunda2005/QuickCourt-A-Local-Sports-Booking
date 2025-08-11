// utils/clerk.js
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  frontendApi: process.env.CLERK_PUBLISHABLE_KEY,
  apiKey: process.env.CLERK_SECRET_KEY,
});

module.exports = { requireAuth };
