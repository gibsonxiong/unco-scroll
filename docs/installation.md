# 安装使用

## NPM 

``` shell
# 通过 npm 安装
npm install --save unco-scroll

# 通过 yarn 安装
yarn add unco-scroll
```

``` js
// 全部引入
import UScroll from 'unco-scroll';

const us = new UScroll('.container', {
  scrollbar: true // 开启scrollbar插件
});

// 或按需引入
import UScroll from 'unco-scroll/lib/core';
import Scrollbar from 'unco-scroll/lib/scrollbar';

UScroll.use(Scrollbar);

const us = new UScroll('.container', {
  scrollbar: true
});
```

## CDN

``` html
<!-- 全部引入 -->
<script src="https://cdn.jsdelivr.net/npm/unco-scroll@1/lib/unco-scroll.min.js"></script>
<script>
  var us = new UScroll('.container', {
    scrollbar: true
  });
</script>

<!-- 或按需引入 -->
<script src="https://cdn.jsdelivr.net/npm/unco-scroll@1/lib/core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/unco-scroll@1/lib/scrollbar.js"></script>
<script>
  UScroll.use(Scrollbar);

  var us = new UScroll('.container', {
    scrollbar: true
  });
</script>
```