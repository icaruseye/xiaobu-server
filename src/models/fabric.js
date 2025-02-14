const mongoose = require('mongoose');

const fabricSchema = new mongoose.Schema({
  // 基本信息
  name: {
    type: String,
    required: true,
    trim: true
  },
  // 品牌信息
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: false
  },
  // 品牌信息文本
  brandText: {
    type: String,
    trim: false
  },
  // 规格信息
  length: {
    type: Number,
    required: true,
    min: 0
  },
  // 宽度信息
  width: {
    type: Number,
    required: true,
    min: 0
  },
  // 单位信息
  lengthUnit: {
    type: String,
    enum: ['米', '码'],
    default: '米'
  },
  // 已使用长度
  usedLength: {
    type: Number,
    default: 0,
    min: 0
  },
  // 价格信息
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // 来源信息
  origin: {
    type: String,
    trim: true
  },
  // 购买日期
  purchaseDate: {
    type: Date
  },
  // 材质信息
  materialsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: false
  }],
  // 材质信息文本
  materialsText: {
    type: String,
    trim: false
  },
  // 图片信息
  coverImage: {
    type: String,
    required: false
  },
  // 详情图片
  detailImages: [{
    type: String
  }],
  // 标签和分类
  tagsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: false
  }],
  // 标签和分类文本
  tagsText: {
    type: String,
    trim: false
  },
  // 状态信息
  isFavorite: {
    type: Boolean,
    default: false
  },
  // 其他信息
  notes: {
    type: String,
    trim: true
  },
  // 元数据
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // 购买渠道ID
  purchaseChannelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseChannel',
    required: false
  },
  // 购买渠道文本
  purchaseChannelText: {
    type: String,
    trim: false
  }
}, {
  timestamps: true, // 自动管理 createdAt 和 updatedAt
  toJSON: { virtuals: true }, // 确保虚拟字段在 JSON 中可见
  toObject: { virtuals: true } // 确保虚拟字段在对象中可见
});

// 码转米的换算系数
const YARD_TO_METER = 0.9144;

// 添加虚拟字段：总长度（米）
fabricSchema.virtual('lengthInMeters').get(function() {
  if (this.lengthUnit === '米') {
    return this.length;
  } else if (this.lengthUnit === '码') {
    return Number((this.length * YARD_TO_METER).toFixed(2));
  }
  return this.length; // 默认返回原始长度
});

// 添加虚拟字段：剩余长度（米）
fabricSchema.virtual('remainingLengthInMeters').get(function() {
  const remainingLength = this.length - (this.usedLength || 0);
  if (this.lengthUnit === '米') {
    return Number(remainingLength.toFixed(2));
  } else if (this.lengthUnit === '码') {
    return Number((remainingLength * YARD_TO_METER).toFixed(2));
  }
  return Number(remainingLength.toFixed(2)); // 默认返回原始剩余长度
});

// 原有的剩余长度虚拟字段保持不变
fabricSchema.virtual('remainingLength').get(function() {
  return Number((this.length - (this.usedLength || 0)).toFixed(2));
});

// 添加索引
fabricSchema.index({ name: 'text' }); // 支持按名称搜索
fabricSchema.index({ createdBy: 1 }); // 支持按用户查询
fabricSchema.index({ tags: 1 }); // 支持按标签查询

// 添加中间件
fabricSchema.pre('save', function(next) {
  // 确保 usedLength 不超过总长度
  if (this.usedLength > this.length) {
    next(new Error('已使用长度不能超过总长度'));
  }
  next();
});

const Fabric = mongoose.model('Fabric', fabricSchema);

module.exports = Fabric; 