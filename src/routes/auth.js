const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           description: 用户昵称
 *         avatarUrl:
 *           type: string
 *           description: 用户头像URL
 *         isMember:
 *           type: boolean
 *           description: 是否是会员
 *         memberExpiryDate:
 *           type: string
 *           format: date-time
 *           description: 会员过期时间
 *         isNewUser:
 *           type: boolean
 *           description: 是否新用户
 *     ApiResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 状态码
 *         message:
 *           type: string
 *           description: 响应消息
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 微信登录
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: 微信登录code
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/check-token:
 *   get:
 *     summary: 检查token是否有效
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Bearer token
 */
router.get('/check-token', authController.checkToken);

/**
 * @swagger
 * /api/auth/update-info:
 *   put:
 *     summary: 更新用户信息
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 */
router.put('/update-info', auth, authController.updateUserInfo);

router.get('/user/profile', auth, async (req, res) => {
  // 用户已经通过auth中间件验证
  res.json({
    code: 200,
    user: {
      nickname: req.user.nickname,
      avatarUrl: req.user.avatarUrl,
      isMember: req.user.isMember,
      memberExpiryDate: req.user.memberExpiryDate
    }
  });
});

module.exports = router; 