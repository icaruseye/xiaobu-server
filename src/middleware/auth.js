const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401001,
        message: '未授权访问'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        code: 401002,
        message: '用户不存在或已禁用'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      code: 401003,
      message: '认证失败'
    });
  }
};

module.exports = auth; 