const resolve = require('path').resolve

module.exports = {
  base: '/blog/',
  title: '不肥的肥羊的博客',
  description: 'Blog',
  head: [
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?34ffe82902ef2e02b9f8f8642ace8775";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `]
  ],
  themeConfig: {
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'yyj08070631/blog',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '查看源码',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    // docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    // editLinkText: '帮助我们改善此页面！',
    lastUpdated: 'Last Updated',
    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),
    nav: [
      { text: '首页', link: '/' }
    ],
    sidebar: [
      {
        title: 'HTML',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'CSS',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'JavaScript',
        children: [
          { title: '001 关于 JavaScript this 指向', path: '/js/001.md' },
          { title: '002 模拟实现 call 和 apply', path: '/js/002.md' },
          { title: '003 模拟实现 bind', path: '/js/003.md' },
          { title: '004 模拟实现 new', path: '/js/004.md' },
        ]
      },
      {
        title: 'TypeScript',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'Vue',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: '构建生态',
        children: [
          { title: 'html-webpack-plugin 4.x 对多模板下热重载缓慢问题的修复', path: '/build/html-webpack-plugin-4.x-optimization.md' },
          { title: 'Webpack1 项目构建方案升级', path: '/build/webpack-1-project-optimization.md' }
        ]
      },
      {
        title: '计算机网络',
        children: [
          { title: '001 HTTP 状态码', path: '/network/001.md' },
          { title: '002 HTTP 请求方法', path: '/network/002.md' },
          { title: '003 HTTP 头部：内容协商', path: '/network/003.md' },
          { title: '004 HTTP 头部：缓存策略', path: '/network/004.md' },
          { title: '005 HTTP 其它常用头部字段', path: '/network/005.md' },
          { title: '006 HTTPS', path: '/network/006.md' },
          { title: '007 TLS 记录协议', path: '/network/007.md' },
          { title: '008 TLS 握手协议', path: '/network/008.md' },
          { title: '009 HTTP/2 的改进', path: '/network/009.md' },
          { title: '010', path: '/network/010.md' },
          { title: '011', path: '/network/011.md' }
        ]
      },
      {
        title: '浏览器原理',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'Web 安全',
        children: [
          { title: '001 XSS 攻击', path: '/security/001.md' }
        ]
      },
      {
        title: '设计模式',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'UI/UX',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: '前端工程化',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      }
    ]
  }
}