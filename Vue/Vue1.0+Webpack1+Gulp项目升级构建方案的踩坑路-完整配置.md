```js
// webpack.prod.conf.js
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack-base.conf')
const utils = require('./utils')

process.env.NODE_ENV = 'production'

module.exports = merge(baseWebpackConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    ...utils.htmlWebpackPluginConfig()
  ]
})

// webpack.dev.conf.js
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack-base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./utils')
const proxyDomain = '...'
const host = '...'
const port = ...

process.env.NODE_ENV = 'development'

module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    publicPath: '/',
    clientLogLevel: 'warning',
    hot: true,
    open: true,
    inline: true,
    compress: true,
    host: host,
    port: port,
    proxy: { ... },
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: '...' }
      ]
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['...']
      },
      onErrors: utils.createNotifierCallback()
    }),
    ...utils.htmlWebpackPluginConfig()
  ]
})

// webpack.base.conf.js
const webpack = require('webpack')
const HappyPack = require('happypack')
const path = require('path')
const os = require('os')
const utils = require('./utils')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const resolve = dir => path.join(__dirname, '..', dir)

module.exports = {
  context: resolve('/'),
  entry: { ... },
  output: {
    path: resolve('build'),
    publicPath: '/',
    filename: '...',
    chunkFilename: '...'
  },
  externals: { ... },
  resolve: {
    modules: [resolve('...'), 'node_modules'],
    extentions: ['...'],
    alias: { ... }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                js: 'happypack/loader?id=js',
                ...utils.cssLoader(),
                cssSourceMap: process.env.NODE_ENV === 'development',
                cacheBusting: true
              }
            }
          }
        ],
        include: [resolve('...')]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
        include: [resolve('...')]
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        include: [resolve('...')]
      },
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../build/development/vendor-manifest.json')
    }),
    new webpack.DefinePlugin({ ... }),
    new HappyPack({
      id: 'js',
      use: [{ loader: 'babel-loader', cacheDirectory: true }],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  node: {
    fs: 'empty'
  }
}

// webpack.dll.conf.js
const webpack = require('webpack')
const path = require('path')
const resolve = dir => path.join(__dirname, '..', dir)

module.exports = {
  entry: {
    vendor: [...]
  },
  output: {
    path: resolve('build/development'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DllPlugin({
      path: resolve('build/development/[name]-manifest.json'),
      name: '[name]-library',
      context: __dirname
    })
  ]
}
```