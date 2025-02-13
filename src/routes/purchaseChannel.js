const express = require('express');
const router = express.Router();
const purchaseChannelController = require('../controllers/purchaseChannelController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/purchase-channels:
 *   post:
 *     summary: 创建购买渠道
 *     tags: [购买渠道]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 购买渠道名称
 */
router.post('/', auth, purchaseChannelController.createPurchaseChannel);

/**
 * @swagger
 * /api/purchase-channels/{id}:
 *   delete:
 *     summary: 删除购买渠道
 *     tags: [购买渠道]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', auth, purchaseChannelController.deletePurchaseChannel);

/**
 * @swagger
 * /api/purchase-channels:
 *   get:
 *     summary: 获取购买渠道列表
 *     tags: [购买渠道]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', auth, purchaseChannelController.getPurchaseChannels);

module.exports = router; 