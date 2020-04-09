module.exports = {
  base: '/yyj/',
  title: '不肥的肥羊',
  description: 'Blog',
  themeConfig: {
    nav: [
      {
        text: 'Languages',
        items: [
          { text: 'Group1', items: [{ text: 'Chinese', link: '/language/chinese/' }, { text: 'Japanese', link: '/language/japanese/' }] }
        ]
      }
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
        title: 'JavaScript 原理',
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
        title: 'Vue 原理',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'Webpack',
        children: [
          { title: 'html-webpack-plugin 4.x 对多模板下热重载缓慢问题的修复', path: '/build/html-webpack-plugin-4.x-optimization.md' },
          { title: 'Webpack1 项目构建方案升级', path: '/build/webpack-1-project-optimization.md' }
        ]
      },
      {
        title: 'TCP',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      },
      {
        title: 'HTTP',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
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
        title: '前端工作流',
        children: [
          // { title: '从零开始实现一个 HTTP 服务器', path: '/protocol/build-http-server.md' }
        ]
      }
    ]
  }
}