## 项目启动

```
yarn install
yarn serve
```

## 相关文章

https://juejin.cn/post/6985428860859285511

## 添加 svg loader

```
yarn add svg-sprite-loader -D
```

2. 修改 vue.config.js

vue inspect --rule svg 查看当前 svg 的处理规则

修改当前 loader，添加一个排除项，配置 svg-sprite-loader

3. 图标自动导入，见 ./src/assets/icpns/svg/index

```js
// webpack 中的方法 加载素材
// require(目录，是否递归，后缀)
const req = require.context("./svg", false, /\.svg$/);

// 获取当前目录下所有文件名
// 遍历所有文件，自动加载
req.keys().map(req);
```

4. 在 main.js 文件中引入自动加载的文件即可
