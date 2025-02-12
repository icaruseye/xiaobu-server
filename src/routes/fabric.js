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