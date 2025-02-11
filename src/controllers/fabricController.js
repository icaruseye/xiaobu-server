const Fabric = require('../models/fabric');

// 创建布料
const createFabric = async (req, res) => {
  try {
    const fabricData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const fabric = await Fabric.create(fabricData);

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
    const fabric = await Fabric.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
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
      createdBy: req.user.userId
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
    const { page = 1, limit = 10, keyword, favorite } = req.query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query = { createdBy: req.user.userId };
    
    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { brand: new RegExp(keyword, 'i') },
        { tags: new RegExp(keyword, 'i') }
      ];
    }

    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // 执行查询
    const total = await Fabric.countDocuments(query);
    const list = await Fabric.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
      createdBy: req.user.userId
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

module.exports = {
  createFabric,
  updateFabric,
  getFabric,
  getFabrics,
  toggleFavorite
}; 