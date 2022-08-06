# Markdown 用法

## 目录

`[[toc]]` 效果如下:

[[toc]]

## 内部链接

使用相对位置

```md
[首页](/)
[随笔首页](/essay/)
[VuePress](chap02-vuepress.md)
[TensorFlow 特征列](../deep-learning/chap04-feature-columns.md)
[特征列之交叉列](../deep-learning/chap04-feature-columns.md#jiao-cha-lie)
```

效果:
[首页](/)
[随笔首页](/essay/)
[VuePress](chap02-vuepress.md)
[TensorFlow 特征列](../deep-learning/chap04-feature-columns.md)
[特征列之交叉列](../deep-learning/chap04-feature-columns.md#jiao-cha-lie)

## FrontMatter

唯一推荐配置的变量是 `tags`, 标签列表, 用于搜索

## 表格

```md
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

效果:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Emoji

```md
:tada: :100:
```

效果:
:tada: :100:

## 自定义容器

> 这是引用文本的展示样式, 这节展示更多自定义容器

输入

```md
::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: danger STOP
危险区域, 禁止通行
:::
```

输出

::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: danger STOP
危险区域, 禁止通行
:::

## 代码块

VuePress 使用 [Prism](https://prismjs.com/#languages-list) 实现语法高亮, 增加有效的语言别名即可

配置行高亮, 将添加行号

导入代码片段
