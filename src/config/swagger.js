const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API 文档',
      version: '1.0.0',
      description: 'API 接口文档'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发服务器'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // 指定 API 路由文件的位置
};

const specs = swaggerJsdoc(options);

module.exports = specs; 