const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true
  },
  nickname: String,
  avatarUrl: String,
  sessionKey: String,
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isMember: {
    type: Boolean,
    default: false
  },
  memberExpiryDate: Date
});

module.exports = mongoose.model('User', userSchema); 