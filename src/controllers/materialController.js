const Material = require('../models/material');

// 创建材质
const createMaterial = async (req, res) => {
  try {
    const materialData = {
      name: req.body.name,
      createdBy: req.user._id
    };

    const material = await Material.create(materialData);

    res.json({
      code: 200,
      message: '创建成功',
      data: material
    });
  } catch (error) {
    console.error('创建材质失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建材质失败'
    });
  }
};

// 删除材质
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!material) {
      return res.status(404).json({
        code: 404001,
        message: '材质不存在或无权限删除'
      });
    }

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除材质失败:', error);
    res.status(500).json({
      code: 500002,
      message: '删除材质失败'
    });
  }
};

// 获取用户的材质列表
const getMaterials = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // 构建查询条件
    const query = { createdBy: req.user._id };
    
    // 添加关键词搜索
    if (keyword) {
      query.name = new RegExp(keyword, 'i');
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: '获取成功',
      data: materials
    });
  } catch (error) {
    console.error('获取材质列表失败:', error);
    res.status(500).json({
      code: 500003,
      message: '获取材质列表失败'
    });
  }
};

module.exports = {
  createMaterial,
  deleteMaterial,
  getMaterials
}; 