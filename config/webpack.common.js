'use strict'

const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin }  = require('vue-loader')

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = false

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  return {
    // Stop compilation early in production
    bail: isEnvProduction,

    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : 'cheap-module-source-map',

    plugins: [
      new VueLoaderPlugin(),

      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
            title: 'Kaikei',
            favicon: 'public/favicon.ico'
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),

      // Makes some environment variables available to the JS code.
      new Dotenv({
        path: isEnvDevelopment ? './.env.development' : './.env.production',
      }),

      // Copies files from target to destination folder
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.appPublic,
            globOptions: {
              ignore: [
                '*.DS_Store',
                '**/index.html',
                isEnvProduction && '**/service-worker.js',
              ].filter(Boolean),
            },
          },
        ],
      }),
    ],

    // Determine how modules within the project are treated
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                sassOptions: {
                  includePaths:[paths.appSrc, 'node_modules']
                }
              },
            },
          ],
        },

        // Images: Copy image files to build folder
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|bmp)$/i,
          loader: require.resolve('file-loader'),
          options: {
            name: 'assets/images/[name].[ext]',
          },
        },

        // Fonts and SVGs: Inline files
        { test: /\.(woff(2)?|eot|ttf|otf|)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'assets/fonts/[name].[ext]',
          }
        },

        {
          test: /\.svg$/,
          use: [
            'vue-loader',
            'vue-svg-loader'
          ],
        }
      ],
    },

    resolve: {
      modules: [paths.appSrc, paths.appNodeModules],
      extensions: ['.vue', '.js', '.json'],
      alias: {
        '@': paths.appSrc,
        'vue': '@vue/runtime-dom'
      },
      plugins: [],
    },
  }
}
