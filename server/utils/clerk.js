// utils/clerk.js
const { requireAuth, getAuth } = require('@clerk/express');

const verifyAdmin = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

module.exports = {
  requireAuth,
  getAuth,
  verifyAdmin
};
