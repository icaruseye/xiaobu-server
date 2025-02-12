const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: 创建标签
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 标签名称
 */
router.post('/', auth, tagController.createTag);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: 获取用户的所有标签
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', auth, tagController.getTags);

/**
 * @swagger
 * /api/tags/{tagId}:
 *   delete:
 *     summary: 删除标签
 *     tags: [Tags]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:tagId', auth, tagController.deleteTag);

module.exports = router;