// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   clerkUserId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String
//   },
//   email: {
//     type: String,
//     lowercase: true
//   },
//   avatar: {
//     type: String
//   },
//   role: {
//     type: String,
//     enum: ['User', 'FacilityOwner', 'Admin'],
//     default: 'User'
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// server/models/User.js
const mongoose = require("mongoose");

/* server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["user", "owner", "admin"], default: "user" },
  isBanned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
*/
const userSchema = new mongoose.Schema({
    clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["User", "Owner", "Admin"], default: "User" },
  isBanned: { type: Boolean, default: false },

  // NEW: Optional profile enhancements
  phoneNumber: { type: String },      // For contact
  avatarUrl: { type: String },        // Profile picture
  reportsCount: { type: Number, default: 0 }, // Number of times reported
  isFlagged: { type: Boolean, default: false } // For admin quick action
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);