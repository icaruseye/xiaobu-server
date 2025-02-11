const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth');
const fabricRoutes = require('./routes/fabric');
const uploadRoutes = require('./routes/upload'); // 引入上传路由
const tagRoutes = require('./routes/tag');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/fabrics', fabricRoutes);
app.use('/api/upload', uploadRoutes); // 注册上传路由
app.use('/api/tags', tagRoutes);

// 静态文件服务
app.use('/uploads', express.static('uploads')); // 提供上传文件的访问

app.get('/', (req, res) => {
  res.json({ message: '欢迎访问 API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
const HOST = '192.168.31.58'; // 替换为你的本地 IP 地址

app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
}); 