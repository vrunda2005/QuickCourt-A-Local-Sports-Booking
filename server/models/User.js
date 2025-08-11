const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    lowercase: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['User', 'FacilityOwner', 'Admin'],
    default: 'User'
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
