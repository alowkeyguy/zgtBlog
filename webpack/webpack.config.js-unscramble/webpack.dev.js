const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const webpack = require('webpack')

module.exports = merge(base, {
  mode: 'development',
  // source-map,将编译后的代码映射到原代码，便于报错后定位错误
  devtool: 'inline-source-map',
  // "dev": "webpack-dev-server --open"，devServer是webpack-dev-server的配置选项
  devServer: {
    contentBase: './dist',
    // 与下面webpack提供的热替换模块共同使用
    hot: true
  },
  plugins: [
    // 模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块
    new webpack.HotModuleReplacementPlugin()
  ]
})