# VuePress

Vue 驱动的静态网站生成器

- 简洁至上
- Vue 驱动
- 高性能

## 快速上手

1. 初始化项目
```sh
mkdir ut-notes && cd ut-notes
npm init --yes
```

2. 安装依赖
```sh
npm i -D vuepress
```

3. 创建文档
```sh
mkdir docs
echo '# Hello VuePress' > docs/README.md
```

4. 在 `package.json` 中添加 `scripts`, 可选, 但建议添加
```json {2-3}
"scripts": {
  "start": "vuepress dev docs",
  "build": "vuepress build docs"
}
```

5. 启动本地服务, VuePress 会在 <http://localhost:8080> 启动一个热重载的开发服务器.
```sh
npm start
```

关于 Markdown 基础用法, 以及在 VuePress 中的扩展用法, 参见[这里](chap02-markdown.md).

## 本项目做了哪些定制

- 底部展示贡献者列表, 以及最近一次更新时间
- 底部展示文档标签, 标签和章节标题可用于文档快速查找
- 中文章节标题锚点, 采用中文转拼音的方式, 否则无法正确定位
- 支持 LaTeX 数学公式, 流程图
- 代码一键拷贝
- 图片点击放大
- 回到顶部

Lint, remark, [textlint](https://textlint.github.io)

Pangu

LaTeX

Todo

## 参考资料

- [VuePress 中文文档](https://www.vuepress.cn), [英文文档](https://vuepress.vuejs.org)
- [Awesome VuePress](https://github.com/vuepress/awesome-vuepress)
- [为 VuePress 提供更多 Markdown 增强功能](https://vuepress-md-enhance.mrhope.site/zh)
- [掘金 VuePress 文章集合](https://juejin.im/tag/VuePress)
- [VuePress 介绍 PPT](https://xxholly32.github.io/what-i-learned-from-analysis-vuepress/)
- [VuePress 社区](https://vuepress.github.io/zh/)
- [VuePress 自动生成侧边栏](https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar)
- [飞跃高山与大洋的鱼](https://docs.shanyuhai.top)
- [VuePress 主题改造指南](https://www.xerrors.fun/decorate-vuepress)
