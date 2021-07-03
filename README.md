```
yarn install
yarn serve
```

## 添加 svg loader

```
yarn add svg-sprite-loader -D
```

2. 修改 vue.config.js

vue inspect --rule svg 查看当前 svg 的处理规则

修改当前 loader，添加一个排除项，配置 svg-sprite-loader

3. 图标自动导入
