#### 1、[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside` <p>`, or missing `<tbody>`. Bailing hydration and performing full client-side render.

这个问题大致的意思就是，HTML结构嵌套不正确，我项目中出现的情况是：使用了element-ui中的`<el-container>`里面嵌套了一个`<el-header>`导致渲染出来的结果是一个`<section>`里面嵌套了一个`<header>`标签，导致了这样的情况。

![这里写图片描述](https://img-blog.csdn.net/20180515163006372?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM1MjcxNTU2/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

最近发现这个问题的描述其实十分的清晰：服务端与客户端渲染的DOM结构不一样。上图中出现的这个问题是element-ui没有允许在服务端使用导致的。

![这里写图片描述](https://img-blog.csdn.net/20180515163326348?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM1MjcxNTU2/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

将ssr的配置改为true，让element-ui能在服务端调用，直接渲染DOM结构，那么控制台就清净了。

#### 2、vue-socket.io在chrome中无法正常运行

博客中糅合了一个用vue-socket.io + socket.io实现的实时聊天的功能，这个功能移植自早先我使用socket.io的客户端与服务端库实现的实时聊天程序，移植完成后我发现，在chrome里无法正常触发vue-socket.io中的connect回调，在IE Edge与Firefox中不断刷新则有较小几率可以触发。

经过各种百度后发现，vue-socket.io使用到了大量es6的语法，考虑到原生es6在浏览器中的兼容性，推测是语法兼容问题，因此导入babel-loader(nuxt cli中没有自带)，对js进行编译，最终vue-socket.io得以正常运行。