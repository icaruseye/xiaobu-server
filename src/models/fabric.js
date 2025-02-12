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
    required: true
  },
  // 品牌信息文本
  brandText: {
    type: String,
    trim: true
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
    enum: ['米', '厘米', '英寸', '码'],
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
  // 购买渠道
  purchaseChannel: {
    type: String,
    trim: true
  },
  // 
  purchaseDate: {
    type: Date
  },
  // 材质信息
  materialsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  }],
  // 材质信息文本
  materialsText: {
    type: String,
    trim: true
  },
  // 图片信息
  coverImage: {
    type: String,
    required: true
  },
  // 详情图片
  detailImages: [{
    type: String
  }],
  // 标签和分类
  tagsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  }],
  // 标签和分类文本
  tagsText: {
    type: String,
    trim: true
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
  }
}, {
  timestamps: true // 自动管理 createdAt 和 updatedAt
});

// 添加索引
fabricSchema.index({ name: 'text' }); // 支持按名称搜索
fabricSchema.index({ createdBy: 1 }); // 支持按用户查询
fabricSchema.index({ tags: 1 }); // 支持按标签查询

// 添加虚拟字段
fabricSchema.virtual('remainingLength').get(function() {
  return this.length - (this.usedLength || 0);
});

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