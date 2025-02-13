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
    const objectIdMaterialsId = materialsId ? materialsId.split(',').map(id => new mongoose.Types.ObjectId(id)) : []; // 材质ID
    const objectIdTagsId = tagsId ? tagsId.split(',').map(id => new mongoose.Types.ObjectId(id)) : []; // 标签ID

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
      lengthRange,
      remainingLengthRange,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      purchaseChannelId,
    } = req.query;
    
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query = { createdBy: req.user._id };
    
    // 关键词搜索
    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { brandText: new RegExp(keyword, 'i') },
        { materialsText: new RegExp(keyword, 'i') },
        { tagsText: new RegExp(keyword, 'i') }
      ];
    }

    // 收藏筛选
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // 材质筛选（支持多个）
    if (materialsId) {
      const materialsIdArray = materialsId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (materialsIdArray.length > 0) {
        query.materialsId = { $all: materialsIdArray };
      }
    }

    // 标签筛选（支持多个）
    if (tagsId) {
      const tagsIdArray = tagsId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (tagsIdArray.length > 0) {
        query.tagsId = { $all: tagsIdArray };
      }
    }

    // 品牌筛选（支持多个）
    if (brandId) {
      const brandIdArray = brandId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (brandIdArray.length > 0) {
        query.brandId = { $in: brandIdArray }; // 使用 $in 表示满足其中任一品牌即可
      }
    }

    // 使用状态筛选
    if (isUsed === 'true') {
      query.usedLength = { $gt: 0 };
    } else if (isUsed === 'false') {
      query.usedLength = 0;
    }

    // 长度范围筛选
    if (lengthRange) {
      switch (lengthRange) {
        case '0-1':
          query.length = { $gte: 0, $lte: 1 };
          break;
        case '1-3':
          query.length = { $gte: 1, $lte: 3 };
          break;
        case '3-5':
          query.length = { $gte: 3, $lte: 5 };
          break;
        case '5-10':
          query.length = { $gte: 5, $lte: 10 };
          break;
        case '10+':
          query.length = { $gte: 10 };
          break;
      }
    }

    // 剩余长度范围筛选
    if (remainingLengthRange) {
      switch (remainingLengthRange) {
        case '0-1':
          query.$expr = {
            $and: [
              { $gte: [{ $subtract: ['$length', '$usedLength'] }, 0] },
              { $lte: [{ $subtract: ['$length', '$usedLength'] }, 1] }
            ]
          };
          break;
        case '1-3':
          query.$expr = {
            $and: [
              { $gt: [{ $subtract: ['$length', '$usedLength'] }, 1] },
              { $lte: [{ $subtract: ['$length', '$usedLength'] }, 3] }
            ]
          };
          break;
        case '3-5':
          query.$expr = {
            $and: [
              { $gt: [{ $subtract: ['$length', '$usedLength'] }, 3] },
              { $lte: [{ $subtract: ['$length', '$usedLength'] }, 5] }
            ]
          };
          break;
        case '5-10':
          query.$expr = {
            $and: [
              { $gt: [{ $subtract: ['$length', '$usedLength'] }, 5] },
              { $lte: [{ $subtract: ['$length', '$usedLength'] }, 10] }
            ]
          };
          break;
        case '10+':
          query.$expr = {
            $gt: [{ $subtract: ['$length', '$usedLength'] }, 10]
          };
          break;
      }
    }

    // 购买渠道筛选（支持多个）
    if (purchaseChannelId) {
      const channelIdArray = purchaseChannelId.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      if (channelIdArray.length > 0) {
        query.purchaseChannelId = { $in: channelIdArray };
      }
    }

    // 构建排序条件
    let sort = {};
    
    // 处理特殊的排序字段
    if (sortBy === 'remainingLength') {
      // 按剩余长度排序需要特殊处理，因为它是一个计算字段
      sort = { 
        $sort: { 
          $subtract: ['$length', '$usedLength'] // 计算剩余长度
        }
      };
    } else {
      // 其他字段直接排序
      const validSortFields = ['createdAt', 'updatedAt', 'length', 'width', 'price'];
      if (validSortFields.includes(sortBy)) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } else {
        // 默认按创建时间降序
        sort.createdAt = -1;
      }
    }

    // 执行查询
    const total = await Fabric.countDocuments(query);
    
    let list;
    if (sortBy === 'remainingLength') {
      // 使用聚合管道处理剩余长度排序
      list = await Fabric.aggregate([
        { $match: query },
        {
          $addFields: {
            remainingLength: { $subtract: ['$length', '$usedLength'] }
          }
        },
        { $sort: { remainingLength: sortOrder === 'asc' ? 1 : -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
      ]).exec();
      
      // 手动填充关联数据
      await Fabric.populate(list, [
        { path: 'brandId', select: 'name' },
        { path: 'materialsId', select: 'name' },
        { path: 'tagsId', select: 'name' }
      ]);
    } else {
      // 普通字段排序
      list = await Fabric.find(query)
        .populate('brandId', 'name')
        .populate('materialsId', 'name')
        .populate('tagsId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));
    }

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
      // 计算统计数据
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 }, // 布料总数量
          totalLength: { $sum: '$length' }, // 总长度
          totalUsedLength: { $sum: '$usedLength' }, // 总使用长度
          totalValue: { $sum: '$price' }, // 总价值
          remainingLength: { 
            $sum: { $subtract: ['$length', '$usedLength'] } 
          } // 剩余总长度
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