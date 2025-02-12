const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  
  // 从环境变量获取token有效期，如果未设置则默认24小时
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h'
  
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn }
  )
}

const login = async (req, res) => {
  try {
    const { code } = req.body;

    console.log('进入登录方法')
    
    // 请求微信接口获取openid和session_key
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WX_APP_ID,
        secret: process.env.WX_APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = response.data;

    // 处理微信接口错误
    if (errcode) {
      console.error('微信登录失败:', errmsg);
      return res.status(401).json({ 
        code: 401001,
        message: '微信登录失败',
        error: errmsg 
      });
    }

    // 查找或创建用户
    let user = await User.findOne({ openid });
    
    if (user) {
      // 更新现有用户的登录信息
      user = await User.findOneAndUpdate(
        { openid },
        { 
          sessionKey: session_key,
          lastLoginTime: new Date(),
          isActive: true
        },
        { new: true }
      );
    } else {
      // 创建新用户
      user = await User.create({
        openid,
        sessionKey: session_key,
        lastLoginTime: new Date()
      });
    }

    // 生成JWT令牌
    const token = generateToken(user);

    res.json({
      code: 200,
      message: '登录成功',
      token,
      user: {
        isNewUser: !user.nickname,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        isMember: user.isMember,
        memberExpiryDate: user.memberExpiryDate
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      code: 500001,
      message: '登录失败' 
    });
  }
};

// 更新用户信息
const updateUserInfo = async (req, res) => {
  try {
    const { nickname, avatarUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        nickname, 
        avatarUrl,
        lastLoginTime: new Date()
      },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新用户信息成功',
      user: {
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        isMember: user.isMember,
        memberExpiryDate: user.memberExpiryDate
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ 
      code: 500002,
      message: '更新用户信息失败' 
    });
  }
};

// 检查token是否有效
const checkToken = async (req, res) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ 
        code: 400001,
        message: 'token不存在',
        valid: false 
      })
    }

    const token = authHeader.split(' ')[1]
    
    try {
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // 检查用户是否存在
      const user = await User.findById(decoded.id)
      if (!user || !user.isActive) {
        return res.status(401).json({ 
          code: 401002,
          message: 'token已失效',
          valid: false 
        })
      }

      res.json({ 
        code: 200,
        message: 'token有效',
        valid: true,
        user: {
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          isMember: user.isMember,
          memberExpiryDate: user.memberExpiryDate
        }
      })
    } catch (error) {
      // token验证失败
      return res.status(401).json({ 
        code: 401003,
        message: 'token无效',
        valid: false 
      })
    }
  } catch (error) {
    console.error('Token验证错误:', error)
    res.status(500).json({ 
      code: 500003,
      message: '服务器错误',
      valid: false 
    })
  }
}

module.exports = {
  login,
  updateUserInfo,
  checkToken
}; 