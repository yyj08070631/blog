module.exports = {
  title: '不肥的肥羊',
  description: 'Blog',
  themeConfig: {
    nav: [
      {
        text: 'Languages',
        items: [
          { text: 'Group1', items: [{ text: 'Chinese', link: '/language/chinese/' }, { text: 'Japanese', link: '/language/japanese/' }] },
          { text: 'Group2', items: [{ text: 'Chinese', link: '/language/chinese/' }, { text: 'Japanese', link: '/language/japanese/' }] }
        ]
      }
    ],
    sidebar: [
      {
        title: '构建生态',
        children: [
          { title: 'html-webpack-plugin 4.x 对多模板下热重载缓慢问题的修复', path: '/about-build/html-webpack-plugin-4.x-optimization.md' },
          { title: 'Webpack1 项目构建方案升级', path: '/about-build/webpack-1-project-optimization.md' }
        ]
      }
    ]
  }
}