const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config(); // 引入环境变量配置
const connectDB = require('./config/database'); // 引入数据库配置
const swaggerSpec = require('./config/swagger'); // 引入swagger配置
const authRoutes = require('./routes/auth'); // 引入认证路由
const fabricRoutes = require('./routes/fabric'); // 引入面料路由
const uploadRoutes = require('./routes/upload'); // 引入上传路由
const materialRoutes = require('./routes/material'); // 引入材质路由
const tagRoutes = require('./routes/tag'); // 引入标签路由
const brandRoutes = require('./routes/brand'); // 引入品牌路由
const fabricUsageRoutes = require('./routes/fabricUsage'); // 引入布料使用记录路由
const purchaseChannelRoutes = require('./routes/purchaseChannel');

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
app.use('/api/auth', authRoutes); // 注册认证路由
app.use('/api/fabrics', fabricRoutes); // 注册面料路由
app.use('/api/upload', uploadRoutes); // 注册上传路由
app.use('/api/materials', materialRoutes); // 注册材质路由
app.use('/api/tags', tagRoutes); // 注册标签路由
app.use('/api/brands', brandRoutes); // 注册品牌路由
app.use('/api/fabric-usage', fabricUsageRoutes); // 注册布料使用记录路由
app.use('/api/purchase-channels', purchaseChannelRoutes);

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
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
}); 