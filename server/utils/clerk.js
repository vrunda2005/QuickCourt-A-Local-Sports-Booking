const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  frontendApi: process.env.CLERK_PUBLISHABLE_KEY,
  apiKey: process.env.CLERK_SECRET_KEY,
});
/* i added */

exports.requireAuth = requireAuth; 
exports.verifyAdmin = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};