const multer = require('multer');
const path = require('path');

// 设置存储位置和文件命名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 上传文件存储路径
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 文件命名
  }
});

// 创建 multer 实例
const upload = multer({ storage: storage });

module.exports = upload; 