// webpack 中的方法 加载素材
// require(目录，是否递归，后缀)
const req = require.context('./svg', false, /\.svg$/);

// 获取当前目录下所有文件名
// 遍历所有文件，自动加载
req.keys().map(req)
