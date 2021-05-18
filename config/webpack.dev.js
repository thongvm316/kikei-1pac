'use strict'

const webpack = require('webpack')
const { merge } = require('webpack-merge')

const common = require('./webpack.common.js')
const paths = require('./paths')

module.exports = merge(common('development'), {
  // Set the mode to development or production
  mode: 'development',

  entry: [
    paths.appIndexJs,
    require.resolve('webpack-dev-server/client'),
  ],

  output: {
    path: paths.appBuild,
    publicPath: paths.publicUrlOrPath,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
  },

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    inline: true,
    open: true,
    port: 3000,
    compress: true,
    contentBase: paths.appBuild,
    hot: true,
    publicPath: paths.publicUrlOrPath,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
