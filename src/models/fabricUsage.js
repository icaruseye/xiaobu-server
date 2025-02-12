const mongoose = require('mongoose');

const fabricUsageSchema = new mongoose.Schema({
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fabric',
    required: true
  },
  usedLength: {
    type: Number,
    required: true,
    min: 0
  },
  usageDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('FabricUsage', fabricUsageSchema); 