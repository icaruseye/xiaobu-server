const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // 引入 multer 配置
const auth = require('../middleware/auth');
const qiniuConfig = require('../config/qiniuConfig'); // 引入七牛云配置
const qiniu = require('qiniu');
const fs = require('fs');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: 上传图片到七牛云
 *     tags: [公共]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 上传成功
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
 *                   example: 上传成功
 *                 url:
 *                   type: string
 *                   description: 图片URL
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
  console.log(req.file); // 打印上传的文件信息
  if (!req.file) {
    return res.status(400).json({
      code: 400001,
      message: '请上传图片'
    });
  }

  const filePath = req.file.path; // 本地文件路径
  const key = req.file.filename; // 文件名

  // 上传到七牛云
  const uploadToken = qiniuConfig.generateUploadToken();
  const formUploader = new qiniu.form_up.FormUploader();
  const putExtra = new qiniu.form_up.PutExtra();

  formUploader.putFile(uploadToken, key, filePath, putExtra, (err, body, info) => {
    // 删除本地文件
    fs.unlinkSync(filePath);

    if (err) {
      console.error('上传到七牛云失败:', err);
      return res.status(500).json({
        code: 500001,
        message: '上传到七牛云失败'
      });
    }

    if (info.statusCode === 200) {
      const imageUrl = `${qiniuConfig.domain}/${key}`; // 七牛云图片URL
      res.json({
        code: 200,
        message: '上传成功',
        url: imageUrl
      });
    } else {
      console.error('上传到七牛云失败:', body);
      res.status(500).json({
        code: 500002,
        message: '上传到七牛云失败'
      });
    }
  });
});

module.exports = router; 