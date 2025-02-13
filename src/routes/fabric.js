const express = require('express');
const router = express.Router();
const fabricController = require('../controllers/fabricController');
const auth = require('../middleware/auth');
const upload = require('../config/multerConfig'); // 引入 multer 配置

/**
 * @swagger
 * components:
 *   schemas:
 *     Fabric:
 *       type: object
 *       required:
 *         - name
 *         - length
 *         - width
 *         - price
 *         - coverImage
 *       properties:
 *         name:
 *           type: string
 *           description: 布料名称
 *         brand:
 *           type: string
 *           description: 品牌
 *         length:
 *           type: number
 *           description: 长度
 *         width:
 *           type: number
 *           description: 宽度
 *         lengthUnit:
 *           type: string
 *           enum: [m, cm, inch, yard]
 *           description: 长度单位
 *         usedLength:
 *           type: number
 *           description: 已使用长度
 *         price:
 *           type: number
 *           description: 价格
 *         origin:
 *           type: string
 *           description: 产地
 *         purchaseChannel:
 *           type: string
 *           description: 购买渠道
 *         purchaseDate:
 *           type: string
 *           format: date
 *           description: 购买日期
 *         materials:
 *           type: array
 *           items:
 *             type: string
 *           description: 材质列表
 *         coverImage:
 *           type: string
 *           description: 封面图片URL
 *         detailImages:
 *           type: array
 *           items:
 *             type: string
 *           description: 详情图片URL列表
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 标签列表
 *         isFavorite:
 *           type: boolean
 *           description: 是否收藏
 *         notes:
 *           type: string
 *           description: 备注
 */

/**
 * @swagger
 * /api/fabrics:
 *   post:
 *     summary: 新增布料
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabric'
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
 *                   example: 创建成功
 *                 data:
 *                   $ref: '#/components/schemas/Fabric'
 */
router.post('/', auth, fabricController.createFabric);

/**
 * @swagger
 * /api/fabrics/{id}:
 *   put:
 *     summary: 编辑布料
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabric'
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 更新成功
 *                 data:
 *                   $ref: '#/components/schemas/Fabric'
 */
router.put('/:id', auth, fabricController.updateFabric);

/**
 * @swagger
 * /api/fabrics/stats:
 *   get:
 *     summary: 获取布料统计数据
 *     tags: [布料]
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
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: number
 *                       description: 布料总数量
 *                     totalLength:
 *                       type: number
 *                       description: 总长度
 *                     totalUsedLength:
 *                       type: number
 *                       description: 总使用长度
 *                     remainingLength:
 *                       type: number
 *                       description: 剩余总长度
 *                     totalValue:
 *                       type: number
 *                       description: 总价值
 */
router.get('/stats', auth, fabricController.getFabricStats);

/**
 * @swagger
 * /api/fabrics/{id}:
 *   get:
 *     summary: 获取布料详情
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                   $ref: '#/components/schemas/Fabric'
 */
router.get('/:id', auth, fabricController.getFabric);

/**
 * @swagger
 * /api/fabrics:
 *   get:
 *     summary: 获取布料列表
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: 是否只看收藏
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *         description: 品牌ID，多个ID用逗号分隔
 *       - in: query
 *         name: isUsed
 *         schema:
 *           type: boolean
 *         description: 是否使用（true-已使用，false-未使用）
 *       - in: query
 *         name: lengthRange
 *         schema:
 *           type: string
 *           enum: [0-1, 1-3, 3-5, 5-10, 10+]
 *         description: 长度范围
 *       - in: query
 *         name: remainingLengthRange
 *         schema:
 *           type: string
 *           enum: [0-1, 1-3, 3-5, 5-10, 10+]
 *         description: 剩余长度范围
 *       - in: query
 *         name: materialsId
 *         schema:
 *           type: string
 *         description: 材质ID，多个ID用逗号分隔
 *       - in: query
 *         name: tagsId
 *         schema:
 *           type: string
 *         description: 标签ID，多个ID用逗号分隔
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, length, remainingLength, width, price]
 *           default: createdAt
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 排序方向（asc-升序，desc-降序）
 *       - in: query
 *         name: purchaseChannelId
 *         schema:
 *           type: string
 *         description: 购买渠道ID，多个ID用逗号分隔
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
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Fabric'
 */
router.get('/', auth, fabricController.getFabrics);

/**
 * @swagger
 * /api/fabrics/{id}/favorite:
 *   put:
 *     summary: 切换布料收藏状态
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorite:
 *                       type: boolean
 */
router.put('/:id/favorite', auth, fabricController.toggleFavorite);

/**
 * @swagger
 * /api/fabrics/{id}:
 *   delete:
 *     summary: 删除布料
 *     tags: [布料]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 删除成功
 */
router.delete('/:id', auth, fabricController.deleteFabric);

module.exports = router; 