/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/main.js'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath: '/',
  variableOverride: resolveApp('src/styles/vendor/ant/index.less'),
}
