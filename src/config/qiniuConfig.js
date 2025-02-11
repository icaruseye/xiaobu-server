const qiniu = require('qiniu');

// 七牛云配置
const accessKey = 'B2KINSVNZKUG8mhfGJTUsJiJxGd3OaHRe59yM08n'; // 替换为你的 Access Key
const secretKey = 'u_PvsJajvYI5mqz-2AN1jbknIOULdzW7Ocd2OUpJ'; // 替换为你的 Secret Key
const bucket = 'ewingparty'; // 替换为你的 Bucket 名称
const domain = 'srisd8xil.hn-bkt.clouddn.com'; // 替换为你的域名

// 生成上传 Token
function generateUploadToken() {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}

module.exports = {
  generateUploadToken,
  domain
}; 