const PurchaseChannel = require('../models/purchaseChannel');

// 创建购买渠道
const createPurchaseChannel = async (req, res) => {
  try {
    const channelData = {
      name: req.body.name,
      createdBy: req.user._id
    };

    const channel = await PurchaseChannel.create(channelData);

    res.json({
      code: 200,
      message: '创建成功',
      data: channel
    });
  } catch (error) {
    console.error('创建购买渠道失败:', error);
    res.status(500).json({
      code: 500001,
      message: '创建购买渠道失败'
    });
  }
};

// 删除购买渠道
const deletePurchaseChannel = async (req, res) => {
  try {
    const channel = await PurchaseChannel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!channel) {
      return res.status(404).json({
        code: 404001,
        message: '购买渠道不存在或无权限删除'
      });
    }

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除购买渠道失败:', error);
    res.status(500).json({
      code: 500002,
      message: '删除购买渠道失败'
    });
  }
};

// 获取用户的购买渠道列表
const getPurchaseChannels = async (req, res) => {
  try {
    const channels = await PurchaseChannel.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: '获取成功',
      data: channels
    });
  } catch (error) {
    console.error('获取购买渠道列表失败:', error);
    res.status(500).json({
      code: 500003,
      message: '获取购买渠道列表失败'
    });
  }
};

module.exports = {
  createPurchaseChannel,
  deletePurchaseChannel,
  getPurchaseChannels
}; 