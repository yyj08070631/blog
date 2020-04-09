# Vue1.0 + Webpack1 + Gulp项目升级构建方案的踩坑路

最近半年在维护公司的一个管理后台项目，搭建之初的技术栈比较混乱，构建方案采用了`Gulp`中调用`Webpack`的方式，`Gulp`负责处理`.html`文件，`Webpack`负责加载`.vue`、`.js`等。而在这一套构建方案中，主要有这些问题：
1. 没有实现JS压缩、CSS兼容等功能。
2. 在开发模式下，保存代码，项目会进行完全的重新打包，持续构建速度不仅缓慢，还会产生缓存的现象（构建完成后刷新页面改动不生效）。
3. 由于目前的方案没有使用`http-proxy-middleware`这样的请求代理模块，导致项目在本地开发时还要部署后端服务，对新接手的开发者不友好，而且经常由于沟通不及时产生测试环境与本地环境的代码同步问题。

因此，在熟悉这个项目之后，打算对其构建方案进行升级，主要为了解决上述的问题。

## 原有构建方案描述

### 原有构建速度

* `npm run build`：打包约50s
* `npm run dev`：开启开发模式约50s，保存自动重新编译需约6s，编译完成后需要刷新才能看到效果，偶尔因缓存问题需要再次自动重新编译才能看到效果

### 原有构建结果

* `./build/development`：存放渲染后的js文件
* `./build/html`：存放渲染后的html文件
* `./build/rev`：保存各个入口文件hash值的json文件

### 打包代码解析

```javascript
/**
 * 使用gulp-clean插件删除build目录下的文件
 */
gulp.task('clean', function () {
    if (!stopClean) {
        return gulp.src('build/' + directory, { read: false }).pipe(clean())
    }
})
/**
 * 使用webpack打包vue与js文件，在clean之后进行
 */
gulp.task('webpack', ['clean'], function (callback) {
    deCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err)
        gutil.log('[webpack]', stats.toString({}))
        callback()
    })
})
/**
 * 使用gulp-uglify插件对js文件进行丑化，在webpack之后进行
 */
gulp.task('minify', ['webpack'], function () {
    if (environment) {
        return
    } else {
        return gulp.src('build/' + directory + '/*.js').pipe(uglify())
    }
})
/**
 * 使用gulp-rev插件为打包后的文件增加hash，在minify之后运行
 * 
 * gulp-rev会做什么：
 * 根据静态资源内容，生成md5签名，打包出来的文件名会加上md5签名，同时生成一个json用来保存文件名路径对应关系。
 * 替换html里静态资源的路径为带有md5值的文件路径，这样html才能找到资源路径。
 * 有些人可能会做：静态服务器配置静态资源的过期时间为永不过期。
 * 达到什么效果：
 * 静态资源只需请求一次，永久缓存，不会发送协商请求304
 * 版本更新只会更新修改的静态资源内容
 * 不删除旧版本的静态资源，版本回滚的时候只需要更新html，同样不会增加http请求次数
 */
gulp.task('hashJS', ['minify'], function () {
    var dest = gulp.src(['一串入口文件...'])
        .pipe(rev()) // 设置文件的hash key
        .pipe(gulp.dest('build/' + directory)) // 将经过管道处理的文件写出到目录
        .pipe(rev.manifest({})) // 生成映射hash key的json
        .pipe(gulp.dest('build/rev')) // 将经过管道处理的文件写出到目录
    !environment && gulp.src(['一串入口文件...']).pipe(clean())
    return dest
})
/**
 * 使用gulp-rev-replace插件为html中引用的js和css替换新的hash
 * 使用gulp-livereload插件在所有文件重新打包完成后局部更新页面
 */
gulp.task('revReplace', ['hashJS'], function () {
    return gulp.src(['html/*.html'])
        .pipe(revReplace({ ... })) // 给html中的js引用提供新的hash
        .pipe(gulp.dest('build/html')) // 输出文件
        .pipe(livereload()) // 局部更新页面
})
/**
 * 使用gulp.watch，当应用程序目录下有任何文件发生改变，则重新执行一遍打包命令
 * gulp.watch：监视文件，并且可以在文件发生改动时候做一些事情。
 */
gulp.task('watch', ['revReplace'], function () {
    stopClean = true
    livereload.listen()
    gulp.watch('app/**/*', ['clean', 'webpack', 'minify', 'hashJS', 'revReplace'])
})
/**
 * 输出dev和build的工作流
 */
gulp.task('default', ['clean', 'webpack', 'minify', 'hashJS', 'revReplace', 'watch']) // dev
gulp.task('build', ['clean', 'webpack', 'minify', 'hashJS', 'revReplace']) // build
/**
 * webpack配置
 */
var devCompiler = webpack({
    entry: {
        ... // 一众入口文件
        vendor: ['vue', 'vue-router', 'lodash', 'echarts'] // 公共模块
    },
    output: {
        path: ..., // 所有输出文件的目标路径
        publicPath: ..., // 输出解析文件的目录
        filename: ..., // 输出文件
        chunkFilename: ... // 通过异步请求的文件
    },
    // 排除以下内容打包到 bundle，减小文件大小
    external: {
        jquery: 'jQuery',
        dialog: 'dialog'
    },
    plugins: [
        /**
         * 通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。
         * 这个带来页面速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor']
        }),
        /**
         * DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和生产模式的构建允许不同的行为非常有用。
         */
        new webpack.DefinePlugin({
            __VERSION__: new Date().getTime()
        })
    ],
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.vue', '.json'], // 解析组件的文件后缀白名单
        alias: { ... } // 配置路径别名
    },
    module: {
        // 各个文件的loaders
        loaders: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.jsx$/, loader: 'babel-loader', include: [path.join(__dirname, 'app')], exclude: /core/ },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    vue: {
        loaders: {
            js: 'babel-loader'
        }
    }
})
```

## 将`Gulp`的功能移到`Webpack1`上执行

### 使用`html-webpack-plugin`插件构建项目的主`.html`文件

```js
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            filename: '...', // 输出的路径
            template: '...', // 提取源html的路径
            chunks: ['...'], // 需要导入的模块
            inject: true // 是否附加到body底部
        })
    ]
}
```

### 使用`webpack.optimize.UglifyJsPlugin`插件进行`JS`压缩

```javascript
module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
}
```

### 使用`webpack-dev-server`模块，提供`node`搭建的开发环境

```javascript
module.exports = {
    devServer: {
        clientLogLevel: 'warning', // 输出日志的级别，配置为警告级别以上才输出
        inline: true, // 启动 live reload
        hot: true, // 允许启用热重载
        compress: true, // 对所有静态资源进行gzip压缩
        open: true, // 默认在启动本地服务时打开浏览器
        quiet: true, // 禁止输出繁杂的构建日志
        host: ..., // 服务启动的域名
        port: ..., // 服务启动的端口
        proxy: { ... }, // http代理配置
        /**
         * 这个配置常用于解决spa应用h5路由模式下将所有404路由匹配回index.html的问题
         * 由于生产环境为主页匹配了一个比较简单的别名，因此开发环境也照搬后端服务的配置
         */
        historyApiFallback: {
            rewrites: [{ from: '/^\/admin/', to: '...' }]
        }
    }
}
```

### 踩坑

1. `webpack-dev-server@3.2.1 requires a peer of webpack^@4.0.0 but none is installed.`：这两个模块版本不兼容，回退到`webpack-dev-server@2`成功运行。
2. `Cannot resolve module 'fsevents' ...`：将全局的`webpack`调用改为直接从`node_modules/webpack`下直接调用，解决了问题，`node node_modules/webpack/bin/webpack.js --config webpack.config.js`。
3. `Cannot resolve module 'fs' ...`：配置`config.node.fs = 'empty'`，为`Webpack`提供`node`原生模块，使其能加载到这个对象。
4. 热重载只对`.js`和`.css`及`.vue`中的`<style>`内样式生效，对`.vue`文件中的`html`模板及`js`内容都不生效，会打印“模块代码已发生改变并重新编译，但热重载不生效，可能会启用全局刷新的策略”之类的信息，暂时没有解决，初步判断是低版本的`vue-hot-reload-api`对这些部分的处理有问题，有大神了解原理可以在评论区科普一哈=.=。

## 从`Webpack1`升级到`Webpack3`

由于`Webpack2`与`Webpack3`几乎完全兼容，只是涉及到一些增量的功能，因此选择直接从`Webpack1`迁移到`Webapck3`，先在项目中安装`Webpack3`，然后根据`Webpack2`文档中《从`Webpack1`迁移》的章节，对配置项进行更改，参考的文档戳这个：https://www.html.cn/doc/webpack2/guides/migrating/

这次升级没有遇到什么问题，根据文档配置稍作更改就跑通了。梳理一下目前为止实现的功能：

1. 新的`Webpack`构建代码已经实现了原有的所有功能，下面列举新增的功能。
2. 使用`webpack-dev-server`作为开发服务器，实现了保存时`live reload`的功能。
3. 使用`http-proxy-middleware`插件，将请求直接代理到测试服，让开发环境脱离了本地部署的后端服务，大大降低了开发环境部署的时间成本。
4. 新增`friendly-errors-webpack-plugin`，输出友好的构建日志，打印几个重要模块的开发环境地址，配置方面完全参考了`vue-cli@2`的默认配置。
5. 新增`postcss-loader`，对css添加兼容处理，配置方面完全参考了`vue-cli@2`的默认配置。
6. 使用`webpack.optimize.UglifyJsPlugin`压缩js代码。

尝试进行构建，输出构建时间记录：

* `npm run build`：约`135s`
* `npm run dev`：初次构建约`58s`，持续构建约`30s`

项目构建时间过长（第一次打包把自己吓了一跳...），只能继续寻求构建速度上的优化

## 在`Webpack3`下进行构建速度的优化

### 使用`webpack-jarvis`监测构建性能

`webpack-jarvis`是一个图形化的webpack性能监测工具，它配置简便，对构建过程的时间占比、构建结果的详细记录都有具体的输出

```js
// 经过简单的配置就可以在本地3001端口输出构建结果记录
const Jarvis = require('webpack-jarvis')
module.exports = {
    plugins: [
        new Jarvis({
            watchOnly: false,
            port: 3001
        })
    ]
}
```

### 使用`happypack`

先根据网上搜到的文章，做一些简单的优化，如使用`happypack`，这个模块通过多进程模型，来加速代码构建，但是使用之后貌似没有太明显的结果，构建时间大概减少了几秒吧...暂时还不太懂这个模块对优化什么场景的效果比较明显，之前有看到一篇讲解`happypack`原理的文章，但还没细看，有兴趣小伙伴可以研究一下，要是能在评论里简洁明了的给渣渣楼主解释一下就更好了TUT：http://taobaofed.org/blog/2016/12/08/happypack-source-code-analysis/

```js
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
module.exports = {
    plugins: [
        new HappyPack({
            // happypack的id，在调用时需要声明，若需要编译其他类型的文件需要再声明一个happypack
            id: 'js',
            // cacheDirectory：设置后，将尽量在babel编译时使用缓存加载器的结果，避免重新走一遍babel的高昂代价
            use: [{ loader: 'babel-loader', cacheDirectory: true }],
            // 根据cpu的核心数判断需要拆分多少个进程池
            threadPool: happyThreadPool,
            // 是否输出编译过程的日志
            verbose: true
        })
    ]
}
```

做完这一步后，输出构建时间记录：

* `npm run build`：约`130s`
* `npm run dev`：初次构建约`60s`，持续构建约`30s`

### `devtool`配置为`cheap-module-eval-source-map`

`devtool`选项启用`cheap-module-eval-source-map`模式：`vue-cli@2`默认配置为这种模式，`cheap`代表在输出`source-map`时省略列信息；`module`表示在编译过程中启用如`babel-loader`这样的预编译器，使得调试时可以直接看到未经编译的源代码；`eval`表示启用`eval`模式编译，该模式直接使用`eval`函数执行编译后模块的字符串，减少了将字符串转化为可执行的代码文件这个步骤，加快了项目开发中重建的速度；`source-map`表示输出源代码的映射表，使得开发时可以直接把错误定位到源代码，提高开发效率。

做完这一步后，效果并不明显=.=（相比原来的`source-map`），大概减少了几秒，输出构建时间记录：

* `npm run build`：约`130s`
* `npm run dev`：初次构建约`58s`，持续构建约`30s`

### 使用`html-webpack-plugin-for-multihtml`提升多入口项目重建速度

重建一次竟然需要`30s`！各种搜索找到了`html-webpack-plugin`的一条`issue`，发现`html-webpack-plugin@2`在构建多入口应用时速度确实有明显变慢的情况，原因是没有成功的对构建内容进行缓存，使每次重建都重新编译所有代码。作者给出的解决方案是使用这个模块的一个分支项目（是由作者本人`fork`原项目并针对这个问题进行修复的项目）`html-webpack-plugin-for-multihtml`，用法与`html-webpack-plugin`完全相同，使用之后重建仅需`1s`左右。

做完这一步后，输出构建时间记录：

* `npm run build`：约`130s`
* `npm run dev`：初次构建约`58s`，持续构建约`1s`

### 使用`webpack.DllPlugin`提取公共模块

在输出结果中找到了不少较大的依赖包，如`Vue`的核心库、`lodash`、`echarts`等等，还有一些不希望被打包的静态资源，想办法避免每次都编译这些内容，提升编译速度，所以找到了这个插件。

`webpack.DllPlugin`这个插件是来源于`Windows`系统的`.dll`文件（动态链接库）的用法：首先通过`DllPlugin`模块构建出一个包含公共模块的包和一个映射表，再通过`DllReferencePlugin`模块通过映射表给每个模块关联对应的依赖，这样可以对这些公共模块进行预先打包，以后构建的时候就不需要处理这些模块，减少打包时间。

```js
// webpack.dll.conf.js
const webpack = require('webpack')
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
            path: resolve('build/development/[name]-manifest.json'), // 生成manifest文件输出的位置和文件名称
            name: '[name]-library', // 与output.library是一样的，对应manifest.json文件中name字段的值，防止全局变量冲突
            context: __dirname
        })
    ]
}
// webpack.base.conf.js
const webpack = require('webpack')
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../build/development/vendor-manifest.json') // 让webpack从映射表获取使用的依赖
        })
    ]
}
```

打包出来之后还需要在html文件中引入公共库`vendor.dll.js`文件

```html
<html>
    <head></head>
    <body>
        <div id="app"></div>
        <script src="/build/development/vendor.dll.js"></script>
        <!-- 其他JS应该注入到dll的后面，确保能够引用到公共库的内容 -->
    </body>
</html>
```

做完这一步后，输出构建时间记录，发现构建效率有了明显的提高：

* `npm run dll`：约`25s`
* `npm run build`：约`70s`
* `npm run dev`：初次构建约`55s`，持续构建约`1s`

## 后记

优化到这里就差不多结束，这次的优化为旧项目提供了新一代`spa`项目应有的一些功能，搭建了更现代的本地开发环境。下面贴上升级后的完整配置：

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

## Q&A

Q: 为什么不直接升级到`Webpack4`？

A: `Webpack4`只支持`vue-loader@15`以上版本，而这个版本已经无法解析`Vue1`的文件。
