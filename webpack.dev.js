const { merge } = require('webpack-merge');
const webpackCommonJs = require('./webpack.common.js');

module.exports = merge(webpackCommonJs, {
  mode: 'development',
  devtool: 'inline-source-map',
});