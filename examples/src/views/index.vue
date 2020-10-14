<template>
  <div class="frame">
    <div class="container">
      <div>
        <div class="group">
          <h3 class="group-title" >基础示例</h3>
          <router-link class="link-item" to="normal-x">Normal-x</router-link> 
        
          <router-link class="link-item" to="normal-y">Normal-y</router-link> 
        
          <router-link class="link-item" to="normal-xy">Normal-xy</router-link> 
                  
          <router-link class="link-item" to="form">表单</router-link>
        </div>
        <div class="group">
          <h3 class="group-title">Zoom</h3>
          <router-link class="link-item" to="zoom">Zoom</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">嵌套</h3>
          <router-link class="link-item" to="nested/nested1">基础示例1</router-link>
          <router-link class="link-item" to="nested/nested2">基础示例2</router-link>
          <router-link class="link-item" to="nested/nested3">基础示例3</router-link>
          <router-link class="link-item" to="nested/nested-native">与原生滚动嵌套</router-link>  
        </div>
        <div class="group">
          <h3 class="group-title">图片懒加载</h3>
          <router-link class="link-item" to="lazyload">基础示例</router-link> 
        </div>
        
        <div class="group">
          <h3 class="group-title">PullLoader</h3>
          <router-link class="link-item" to="pull-loader/top-and-bottom">TopPull && BottomPull</router-link> 
          <router-link class="link-item" to="pull-loader/left-and-right">LeftPull && RightPull</router-link> 
          <router-link class="link-item" to="pull-loader/all">All</router-link> 
        </div>
        
        <div class="group">
          <h3 class="group-title">生命周期/钩子</h3>
          <router-link class="link-item" to="scrollview-hooks">基础示例</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">Snap</h3>
          <router-link class="link-item" to="snap/snap">基础示例</router-link>
          <router-link class="link-item" to="snap/api">API</router-link>  
          <router-link class="link-item" to="snap/nested-same">同向嵌套</router-link> 
          <router-link class="link-item" to="snap/nested-cross">异向嵌套</router-link> 
          <router-link class="link-item" to="snap/with-pullloader">左拉and右拉</router-link>
          <router-link class="link-item" to="snap/with-lazyload">图片懒加载</router-link>
          <router-link class="link-item" to="snap/with-scrollbar">滚动条</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">SwipeCell</h3>
          <router-link class="link-item" to="swipe-cell">SwipeCell</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">Picker</h3>
          <router-link class="link-item" to="picker/picker1">一栏</router-link> 
          <router-link class="link-item" to="picker/picker2">两栏</router-link> 
          <router-link class="link-item" to="picker/picker3">联动</router-link> 
          <router-link class="link-item" to="picker/picker4">API</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">图片浏览器</h3>
          <router-link class="link-item" to="image-viewer">基础示例</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">分页</h3>
          <router-link class="link-item" to="paging">基础示例</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">综合</h3>
          <router-link class="link-item" to="complex">基础示例</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">Cases</h3>
          <router-link class="link-item" to="cases/story">Story</router-link>
        </div>
        <div class="group">
          <h3 class="group-title">Touch</h3>
          <router-link class="link-item" to="touch/touch">Touch</router-link>
          <router-link class="link-item" to="touch/native">Native</router-link>  
        </div>
        <div class="group">
          <h3 class="group-title">BS</h3>
          <router-link class="link-item" to="bs/normal">Normal</router-link> 
          <router-link class="link-item" to="bs/zoom">Zoom</router-link> 
        </div>
        <div class="group">
          <h3 class="group-title">Native</h3>
          <router-link class="link-item" to="native/normal">Normal</router-link> 
          <router-link class="link-item" to="native/zoom">Zoom</router-link>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import BScroll from "better-scroll";
import ScrollView from '../../../src/index';

export default {
  data(){
    return {

    }
  },
  methods: {

  },
  mounted(){
    const sv = new ScrollView(document.querySelector('.container'), {
      // allowTouch: false,

      scrollbar:true,

      sticky: {
        selector: '.group-title'
      }
    });

    // const sv = new BScroll(document.querySelector('.container'), {
    //   click: true,
    //   scrollbar: true
    // });
  }
}
</script>

<style lang="scss">
// a{
//   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

// }

.frame{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  display: flex;
}
.container{
  flex: 1;
  overflow: auto;
}

.group{
  // margin-bottom:20px;
}

.group-title{
  background-color: #f2f2f2;
  padding:10px 15px;
  font-size:14px;
  color: #999;
  font-weight: 500;
}
.link-item{
    line-height: 45px;
    height: 45px;
    color:#333;
    text-decoration: none;
    border-bottom:1px solid #f4f4f4;
    font-size:16px;
    display: block;
    padding: 0 16px;

}
</style>