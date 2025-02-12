const express = require('express');
const router = express.Router();
const fabricUsageController = require('../controllers/fabricUsageController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/fabric-usage:
 *   post:
 *     summary: 创建布料使用记录
 *     tags: [布料使用记录]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fabricId:
 *                 type: string
 *                 description: 布料ID
 *               usedLength:
 *                 type: number
 *                 description: 使用长度
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 记录创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     fabricId:
 *                       type: string
 *                       description: 布料ID
 *                     usedLength:
 *                       type: number
 *                       description: 使用长度
 */
router.post('/', auth, fabricUsageController.createUsageRecord);

/**
 * @swagger
 * /api/fabric-usage:
 *   get:
 *     summary: 获取用户的布料使用记录列表
 *     tags: [布料使用记录]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 获取成功
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fabricId:
 *                         type: string
 *                         description: 布料ID
 *                       usedLength:
 *                         type: number
 *                         description: 使用长度
 *                       usageDate:
 *                         type: string
 *                         format: date-time
 *                         description: 使用日期
 */
router.get('/', auth, fabricUsageController.getUsageRecords);

module.exports = router; 