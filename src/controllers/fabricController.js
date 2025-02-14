const mongoose = require('mongoose'); // 引入 mongoose
const Fabric = require('../models/fabric');
const FabricUsage = require('../models/fabricUsage'); // 引入使用记录模型

// 创建布料
const createFabric = async (req, res) => {
  try {
    const { brandId, materialsId, tagsId, purchaseChannelId, ...fabricData } = req.body;

    // 将字符串 ID 转换为 ObjectId
    const objectIdBrandId = brandId ? new mongoose.Types.ObjectId(brandId) : null; // 品牌ID
    const objectIdPurchaseChannelId = purchaseChannelId ? new mongoose.Types.ObjectId(purchaseChannelId) : null; // 购买渠道ID
    const objectIdMaterialsId = materialsId ? materialsId.map(id => new mongoose.Types.ObjectId(id)) : []; // 材质ID
    const objectIdTagsId = tagsId ? tagsId.map(id => new mongoose.Types.ObjectId(id)) : []; // 标签ID

    const newFabricData = {
      ...fabricData,
      brandId: objectIdBrandId,
      materialsId: objectIdMaterialsId,
      tagsId: objectIdTagsId,
      purchaseChannelId: objectIdPurchaseChannelId,
      createdBy: req.user._id
    };

    const fabric = await Fabric.create(newFabricData);

    // 检查 usedLength 是否存在且大于 0
    if (req.body.usedLength && req.body.usedLength > 0) {
      const usageData = {
        fabricId: fabric._id, // 使用新创建的布料ID
        usedLength: req.body.usedLength,
        createdBy: req.user._id
      };

      // 创建使用记录
      await FabricUsage.create(usageData);
    }

    res.json({
      code: 200,
      message: '创建成功',
      data: fabric
    });
  } catch (error) {
    console.error('创建布料失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建布料失败'
    });
  }
};

// 更新布料
const updateFabric = async (req, res) => {
  try {
    const { brandId, materialsId, tagsId, purchaseChannelId, ...updateData } = req.body;

    // 将字符串 ID 转换为 ObjectId
    const objectIdBrandId = brandId ? new mongoose.Types.ObjectId(brandId) : null;
    const objectIdMaterialsId = materialsId ? materialsId.map(id => new mongoose.Types.ObjectId(id)) : [];
    const objectIdTagsId = tagsId ? tagsId.map(id => new mongoose.Types.ObjectId(id)) : [];
    const objectIdPurchaseChannelId = purchaseChannelId ? new mongoose.Types.ObjectId(purchaseChannelId) : null;

    const fabric = await Fabric.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...updateData, brandId: objectIdBrandId, materialsId: objectIdMaterialsId, tagsId: objectIdTagsId, purchaseChannelId: objectIdPurchaseChannelId },
      { new: true }
    );

    if (!fabric) {
      return res.status(404).json({
        code: 404001,
        message: '布料不存在'
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: fabric
    });
  } catch (error) {
    console.error('更新布料失败:', error);
    res.status(500).json({
      code: 500002,
      message: '更新布料失败'
    });
  }
};

// 获取布料详情
const getFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!fabric) {
      return res.status(404).json({
        code: 404001,
        message: '布料不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: fabric
    });
  } catch (error) {
    console.error('获取布料详情失败:', error);
    res.status(500).json({
      code: 500003,
      message: '获取布料详情失败'
    });
  }
};

// 获取布料列表
const getFabrics = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      keyword,
      favorite,
      materialsId,
      tagsId,
      brandId,
      isUsed,
      lengthRange, // 长度范围（米）
      remainingLengthRange, // 剩余长度范围（米）
      sortBy = 'createdAt',
      sortOrder = 'desc',
      purchaseChannelId,
    } = req.query;
    
    const skip = (page - 1) * limit;

    // 构建聚合管道
    const pipeline = [];

    // 匹配当前用户
    pipeline.push({ $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) } });

    // 关键词搜索
    if (keyword) {
      pipeline.push({
        $match: {
          $or: [
            { name: new RegExp(keyword, 'i') },
            { brandText: new RegExp(keyword, 'i') },
            { materialsText: new RegExp(keyword, 'i') },
            { tagsText: new RegExp(keyword, 'i') }
          ]
        }
      });
    }

    // 收藏筛选
    if (favorite === 'true') {
      pipeline.push({ $match: { isFavorite: true } });
    }

    // 材质筛选
    if (materialsId) {
      const materialsIdArray = materialsId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (materialsIdArray.length > 0) {
        pipeline.push({ 
          $match: { 
            materialsId: { 
              $in: materialsIdArray.map(id => new mongoose.Types.ObjectId(id)) 
            } 
          } 
        });
      }
    }

    // 标签筛选
    if (tagsId) {
      const tagsIdArray = tagsId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (tagsIdArray.length > 0) {
        pipeline.push({ 
          $match: { 
            tagsId: { 
              $in: tagsIdArray.map(id => new mongoose.Types.ObjectId(id)) 
            } 
          } 
        });
      }
    }

    // 品牌筛选
    if (brandId) {
      const brandIdArray = brandId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (brandIdArray.length > 0) {
        pipeline.push({ 
          $match: { 
            brandId: { 
              $in: brandIdArray.map(id => new mongoose.Types.ObjectId(id)) 
            } 
          } 
        });
      }
    }

    // 使用状态筛选
    if (isUsed === 'true') {
      pipeline.push({ $match: { usedLength: { $gt: 0 } } });
    } else if (isUsed === 'false') {
      pipeline.push({ $match: { usedLength: 0 } });
    }

    // 添加计算字段
    pipeline.push({
      $addFields: {
        lengthInMeters: {
          $cond: {
            if: { $eq: ['$lengthUnit', '米'] },
            then: '$length',
            else: { $multiply: ['$length', 0.9144] }
          }
        },
        remainingLengthInMeters: {
          $cond: {
            if: { $eq: ['$lengthUnit', '米'] },
            then: { $subtract: ['$length', { $ifNull: ['$usedLength', 0] }] },
            else: { 
              $multiply: [
                { $subtract: ['$length', { $ifNull: ['$usedLength', 0] }] },
                0.9144
              ]
            }
          }
        }
      }
    });

    // 长度范围筛选（米）
    if (lengthRange) {
      const ranges = {
        '0-1': { $match: { lengthInMeters: { $gte: 0, $lte: 1 } } },
        '1-3': { $match: { lengthInMeters: { $gt: 1, $lte: 3 } } },
        '3-5': { $match: { lengthInMeters: { $gt: 3, $lte: 5 } } },
        '5-10': { $match: { lengthInMeters: { $gt: 5, $lte: 10 } } },
        '10+': { $match: { lengthInMeters: { $gt: 10 } } }
      };
      if (ranges[lengthRange]) {
        pipeline.push(ranges[lengthRange]);
      }
    }

    // 剩余长度范围筛选（米）
    if (remainingLengthRange) {
      const ranges = {
        '0-1': { $match: { remainingLengthInMeters: { $gte: 0, $lte: 1 } } },
        '1-3': { $match: { remainingLengthInMeters: { $gt: 1, $lte: 3 } } },
        '3-5': { $match: { remainingLengthInMeters: { $gt: 3, $lte: 5 } } },
        '5-10': { $match: { remainingLengthInMeters: { $gt: 5, $lte: 10 } } },
        '10+': { $match: { remainingLengthInMeters: { $gt: 10 } } }
      };
      if (ranges[remainingLengthRange]) {
        pipeline.push(ranges[remainingLengthRange]);
      }
    }

    // 购买渠道筛选
    if (purchaseChannelId) {
      const channelIdArray = purchaseChannelId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (channelIdArray.length > 0) {
        pipeline.push({ 
          $match: { 
            purchaseChannelId: { 
              $in: channelIdArray.map(id => new mongoose.Types.ObjectId(id)) 
            } 
          } 
        });
      }
    }

    // 获取总数
    const countPipeline = [...pipeline];
    const countResult = await Fabric.aggregate([...countPipeline, { $count: 'total' }]);
    const total = countResult[0]?.total || 0;

    // 排序
    if (sortBy === 'remainingLength') {
      pipeline.push({ $sort: { remainingLengthInMeters: sortOrder === 'asc' ? 1 : -1 } });
    } else if (sortBy === 'length') {
      pipeline.push({ $sort: { lengthInMeters: sortOrder === 'asc' ? 1 : -1 } });
    } else {
      const validSortFields = ['createdAt', 'updatedAt', 'width', 'price'];
      if (validSortFields.includes(sortBy)) {
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
        pipeline.push({ $sort: sortObj });
      } else {
        pipeline.push({ $sort: { createdAt: -1 } });
      }
    }

    // 分页
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    // 执行查询
    const list = await Fabric.aggregate(pipeline);

    // 填充关联数据
    await Fabric.populate(list, [
      { path: 'brandId', select: 'name' },
      { path: 'materialsId', select: 'name' },
      { path: 'tagsId', select: 'name' },
      { path: 'purchaseChannelId', select: 'name' }
    ]);

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        total,
        list,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('获取布料列表失败:', error);
    res.status(500).json({
      code: 500004,
      message: '获取布料列表失败'
    });
  }
};

// 切换收藏状态
const toggleFavorite = async (req, res) => {
  try {
    const fabric = await Fabric.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!fabric) {
      return res.status(404).json({
        code: 404001,
        message: '布料不存在'
      });
    }

    fabric.isFavorite = !fabric.isFavorite;
    await fabric.save();

    res.json({
      code: 200,
      message: '操作成功',
      data: {
        isFavorite: fabric.isFavorite
      }
    });
  } catch (error) {
    console.error('切换收藏状态失败:', error);
    res.status(500).json({
      code: 500005,
      message: '切换收藏状态失败'
    });
  }
};

// 删除布料
const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!fabric) {
      return res.status(404).json({
        code: 404001,
        message: '布料不存在或无权限删除'
      });
    }

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除布料失败:', error);
    res.status(500).json({
      code: 500002,
      message: '删除布料失败'
    });
  }
};

// 获取布料统计数据
const getFabricStats = async (req, res) => {
  try {
    // 使用聚合管道进行统计
    const stats = await Fabric.aggregate([
      // 匹配当前用户的布料
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(req.user._id) 
        } 
      },
      // 添加计算字段
      {
        $addFields: {
          lengthInMeters: {
            $cond: {
              if: { $eq: ['$lengthUnit', '米'] },
              then: '$length',
              else: { $multiply: ['$length', 0.9144] }
            }
          },
          remainingLengthInMeters: {
            $cond: {
              if: { $eq: ['$lengthUnit', '米'] },
              then: { $subtract: ['$length', { $ifNull: ['$usedLength', 0] }] },
              else: { 
                $multiply: [
                  { $subtract: ['$length', { $ifNull: ['$usedLength', 0] }] },
                  0.9144
                ]
              }
            }
          }
        }
      },
      // 计算统计数据
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 }, // 布料总数量
          totalLength: { $sum: '$lengthInMeters' }, // 总长度（米）
          totalUsedLength: { $sum: '$usedLength' }, // 总使用长度
          totalValue: { $sum: '$price' }, // 总价值
          remainingLength: { $sum: '$remainingLengthInMeters' } // 剩余总长度（米）
        }
      },
      // 格式化输出
      {
        $project: {
          _id: 0,
          totalCount: 1,
          totalLength: { $round: ['$totalLength', 2] },
          totalUsedLength: { $round: ['$totalUsedLength', 2] },
          remainingLength: { $round: ['$remainingLength', 2] },
          totalValue: { $round: ['$totalValue', 2] }
        }
      }
    ]);

    res.json({
      code: 200,
      message: '获取成功',
      data: stats[0] || {
        totalCount: 0,
        totalLength: 0,
        totalUsedLength: 0,
        remainingLength: 0,
        totalValue: 0
      }
    });
  } catch (error) {
    console.error('获取布料统计数据失败:', error);
    res.status(500).json({
      code: 500006,
      message: '获取布料统计数据失败'
    });
  }
};

module.exports = {
  createFabric,
  updateFabric,
  getFabric,
  getFabrics,
  toggleFavorite,
  deleteFabric,
  getFabricStats
}; 