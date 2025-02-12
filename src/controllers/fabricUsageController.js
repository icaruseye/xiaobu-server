const Fabric = require('../models/fabric');
const FabricUsage = require('../models/fabricUsage');

// 创建使用记录
const createUsageRecord = async (req, res) => {
  try {
    const { fabricId, usedLength } = req.body;

    // 查找布料
    const fabric = await Fabric.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        code: 404001,
        message: '布料不存在'
      });
    }

    // 检查使用长度是否超过剩余长度
    const remainingLength = fabric.remainingLength; // 使用虚拟字段获取剩余长度
    if (usedLength > remainingLength) {
      return res.status(400).json({
        code: 400001,
        message: '使用长度超过剩余长度'
      });
    }

    // 创建使用记录
    const usageData = {
      fabricId: fabricId,
      usedLength: usedLength,
      createdBy: req.user._id
    };

    const usageRecord = await FabricUsage.create(usageData);

    // 更新布料的已使用长度
    fabric.usedLength += usedLength; // 更新已使用长度
    await fabric.save(); // 保存布料更新

    res.json({
      code: 200,
      message: '记录创建成功',
      data: usageRecord
    });
  } catch (error) {
    console.error('创建使用记录失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建使用记录失败'
    });
  }
};

// 获取用户的使用记录列表
const getUsageRecords = async (req, res) => {
  try {
    const records = await FabricUsage.find({ createdBy: req.user._id }).populate('fabricId');

    res.json({
      code: 200,
      message: '获取成功',
      data: records
    });
  } catch (error) {
    console.error('获取使用记录失败:', error);
    res.status(500).json({
      code: 500002,
      message: '获取使用记录失败'
    });
  }
};

module.exports = {
  createUsageRecord,
  getUsageRecords
}; 