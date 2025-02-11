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
 *     summary: 微信小程序登录
 *     tags: [认证]
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
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *               example:
 *                 code: 200
 *                 message: 登录成功
 *       401:
 *         description: 登录失败
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 401001
 *                 message: 微信登录失败
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/userinfo:
 *   put:
 *     summary: 更新用户信息
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 用户昵称
 *               avatarUrl:
 *                 type: string
 *                 description: 用户头像URL
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 更新用户信息成功
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.put('/userinfo', auth, authController.updateUserInfo);

/**
 * @swagger
 * /api/auth/check-token:
 *   get:
 *     summary: 检查token是否有效
 *     tags: [认证]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token验证成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token有效
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token无效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token已失效
 *                 valid:
 *                   type: boolean
 *                   example: false
 */
router.get('/check-token', auth, authController.checkToken);

module.exports = router; 