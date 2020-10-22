# unco-scroll

## 介绍

顺滑和易用的移动端滚动组件

## 特性

- 无第三方依赖
- 插件机制，支持按需引入
- 完善的中英文文档和示例

## 安装

```bash
# 通过 npm 安装
npm install --save unco-scroll

# 通过 yarn 安装
yarn add unco-scroll
```

## 快速上手

```html
<div class="container">
  <div class="scroller">
      <h1>Thank you for use unco-scroll</h1>
  </div>
</div>
```

```js
import UScroll from 'unco-scroll';

new UScroll('.container', {
  // 配置项  
});
```

unco-scroll 也支持按需引入、CDN 引入等方式，详细说明见 [安装使用](https://gibsonxiong.gitee.io/unco-scroll/#/installation).

## 浏览器支持

现代浏览器以及 Android 4.0+, iOS 8.0+.

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议，请自由地享受和参与开源。