const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 联合索引确保同一用户不会创建重复的标签名
tagSchema.index({ name: 1, creator: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag; 