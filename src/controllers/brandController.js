const Brand = require('../models/brand');

// 创建品牌
const createBrand = async (req, res) => {
  try {
    const brandData = {
      name: req.body.name,
      createdBy: req.user._id
    };

    const brand = await Brand.create(brandData);

    res.json({
      code: 200,
      message: '创建成功',
      data: brand
    });
  } catch (error) {
    console.error('创建品牌失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建品牌失败'
    });
  }
};

// 删除品牌
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!brand) {
      return res.status(404).json({
        code: 404001,
        message: '品牌不存在或无权限删除'
      });
    }

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除品牌失败:', error);
    res.status(500).json({
      code: 500002,
      message: '删除品牌失败'
    });
  }
};

// 获取用户的品牌列表
const getBrands = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // 构建查询条件
    const query = { createdBy: req.user._id };
    
    // 添加关键词搜索
    if (keyword) {
      query.name = new RegExp(keyword, 'i');
    }

    const brands = await Brand.find(query).sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: '获取成功',
      data: brands
    });
  } catch (error) {
    console.error('获取品牌列表失败:', error);
    res.status(500).json({
      code: 500003,
      message: '获取品牌列表失败'
    });
  }
};

module.exports = {
  createBrand,
  deleteBrand,
  getBrands
}; 