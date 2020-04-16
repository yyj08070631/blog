module.exports = {
  base: '/yyj/',
  title: '不肥的肥羊',
  description: 'Blog',
  themeConfig: {
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'yyj08070631/yyj',
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
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
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
          { title: '007 TLS CipherSuite', path: '/network/007.md' },
          { title: '008', path: '/network/008.md' },
          { title: '009', path: '/network/009.md' },
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
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
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