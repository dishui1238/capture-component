const path = require('path');
const dir = path.resolve(__dirname, 'src/assets/icons/svg');

module.exports = {
  chainWebpack: config => {
    // 当前默认的 svg loader 排除 assets/svg 目录
    config.module
      .rule('svg')
      .exclude.add(dir)
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(dir)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' }); // 图标的名字 #icon-xxx
  }
};
