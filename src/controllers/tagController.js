const Tag = require('../models/tag');

// 创建标签
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    
    // 检查标签名是否已存在
    const existingTag = await Tag.findOne({ 
      name, 
      creator: req.user._id 
    });
    
    if (existingTag) {
      return res.status(400).json({
        code: 400001,
        message: '标签名已存在'
      });
    }

    const tag = await Tag.create({
      name,
      creator: req.user._id
    });

    res.json({
      code: 200,
      message: '创建成功',
      data: tag
    });
  } catch (error) {
    console.error('创建标签失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建标签失败'
    });
  }
};

// 获取用户的所有标签
const getTags = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // 构建查询条件
    const query = { creator: req.user._id };
    
    // 添加关键词搜索
    if (keyword) {
      query.name = new RegExp(keyword, 'i');
    }

    const tags = await Tag.find(query).sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: '获取成功',
      data: tags
    });
  } catch (error) {
    console.error('获取标签失败:', error);
    res.status(500).json({
      code: 500002,
      message: '获取标签失败'
    });
  }
};

// 删除标签
const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    
    const tag = await Tag.findOne({
      _id: tagId,
      creator: req.user._id
    });

    if (!tag) {
      return res.status(404).json({
        code: 404001,
        message: '标签不存在'
      });
    }

    await tag.remove();

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除标签失败:', error);
    res.status(500).json({
      code: 500003,
      message: '删除标签失败'
    });
  }
};

module.exports = {
  createTag,
  getTags,
  deleteTag
}; 