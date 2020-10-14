<template>
  <ScrollView class="parent" ref="parent" :options="parentOptions">
    <div>
      <div class="shop-container">
        <div class="shop-bg" :style="{transform:`scale(${scale})`}">
          <img  src="@/assets/bg.jpg" />
          <div class="mask"></div>
        </div>
        <div class="shop-info">
          <img src="@/assets/logo1.png" class="logo"/>
          <h3 class="title">麦当当(小熊熊店)</h3>
          <div class="coupon-wrap"><span class="coupon" v-for="item in 3" :key="item">7元</span></div>
          <div class="desc">公告：“免费配料”选项是默认不加，如需要加珍珠波霸椰果红豆仙草，请直接选需要的配料，谢谢～</div>
        </div>
      </div>
      <div class="banner-wrap">
        <ScrollView class="banner" :options="bannerOptions">
          <div class="banner-content">
            <div class="banner-item" v-for="item in 4" :key="item">
              <img :src="require(`@/assets/banner${item}.jpg`)" alt="">
            </div>
          </div>
        </ScrollView>
      </div>
      <div class="panel">
        <nav class="tab-wrapper">
          <div class="tab-item" :class="{active:tabIndex == 0}" @click="changeTabIndex(0)">
            点菜
            <span class="tab-slider" :style="{transform:`translateX(${tabIndex * 100 + tabProgress * 100}%)`}"></span>
          </div>
          <div class="tab-item" :class="{active:tabIndex == 1}" @click="changeTabIndex(1)">评价</div>
          <div class="tab-item" :class="{active:tabIndex == 2}" @click="changeTabIndex(2)">商家</div>
        </nav>
        <ScrollView class="tab-content-wrapper" ref="tabContentWrapper" :options="wrapperOptions">
          <div class="tab-content-content">
            <div class="tab-content">
              <div class="goods-container">
                <div class="left">
                  <ScrollView class="menu" ref="menu" :options="menuOptions">
                    <div class="menu-content">
                      <div class="menu-item" v-for="(categroyItem,index) in categroys" :key="index" :class="{active:menuIndex === index}" @click="handleMenuIndexChange(index)">{{categroyItem}}</div>
                    </div>
                  </ScrollView>
                </div>
                <div class="right">
                  <ScrollView class="main" ref="itemWrap" :options="itemWrapOptions">
                    <div class="main-content">
                      <div class="item-group" v-for="(categroyItem,index) in categroys" :key="index">
                        <h3 class="item-group-title">{{categroyItem}}</h3>
                        <Content :lazyload="true" :count="5"/>
                      </div>
                    </div>
                  </ScrollView>
                </div>
              </div>
            </div>
            <div class="tab-content">
              <ScrollView class="rating-wrapper" ref="child1" :options="childOptions">
                <Rating />
              </ScrollView>
            </div>
            <div class="tab-content">
              <ScrollView class="seller-wrapper" ref="child2" :options="childOptions">
                <Shop />
              </ScrollView>
            </div>
          </div>
        </ScrollView>
      </div>
    </div>
  </ScrollView>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";
import Content from "@/components/Content";
import Rating from "./components/Rating";
import Shop from "./components/Shop";

function delegateHandler(parentScrollView, childScrollView){
  return function (axis, delta){
    
      let result = 0;

      if(delta < 0) {
        if(childScrollView.scrollY + delta < childScrollView.minScrollY){
          result = delta - (childScrollView.minScrollY - childScrollView.scrollY);
        }
      } else if(delta > 0 ) {
        if(parentScrollView.scrollY + delta < parentScrollView.maxScrollY){
          result = delta;
        }else if(parentScrollView.scrollY + delta > parentScrollView.maxScrollY){
          result = parentScrollView.maxScrollY - parentScrollView.scrollY;
        }

      }
      return result;
    }
}

export default {
  components: {
    ScrollView,
    Content,
    Rating,
    Shop
  },
  data() {
    const that = this;
    return {
      scale:1,
      tabIndex: 0,
      tabProgress:0,
      menuIndex:0,

      categroys: ['种类1','种类2','种类3','种类4','种类5','种类6','种类7','种类8','种类9','种类10'],

      parentScrollView:null,
      childScrollView:null,

      tabContentScrollView: null,

      parentOptions:{
        axis: "y",
        // bounceY:[false,true],

        onScroll(e){

          if(e.scrollY <  0){
            that.scale = 1 + ( e.scrollY) / -140;
          }else {
            that.scale = 1;
          }
          
        },

        delegate:true,
        delegateOptions:{
          scrollView(){
            return that.childScrollView
          },
          handler(axis, delta){
            let result = 0;

            if(delta < 0){
              if(that.childScrollView.scrollY + delta > that.childScrollView.minScrollY){
                result = delta;
              }else if(that.childScrollView.scrollY + delta < that.childScrollView.minScrollY){
                result = that.childScrollView.minScrollY -that.childScrollView.scrollY;
              }
            }else if(delta > 0){
              if(that.parentScrollView.scrollY + delta > that.parentScrollView.maxScrollY){
                result = delta - (that.parentScrollView.maxScrollY - that.parentScrollView.scrollY);
              }
            }
            
            return result;
          }
        },
      },

      bannerOptions: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          // autoplay:true
        }
      },

      wrapperOptions: {
        axis: "x",
        freeMode: false,
        snap: {
          duration: 300,
          selector: ".tab-content",
          axis: "x",
          onProgress:(index, progress)=>{
            this.tabIndex = index;
            this.tabProgress = progress;

            if(index === 0){
              this.childScrollView  = this.itemWrapScrollView;
            }else{
              this.childScrollView = this.$refs[`child${index}`].$el.scrollView;
            }
          }
        }
      },
      childOptions:{
        axis: "y",
        freeMode: false,
        // scrollbar: true,

        delegate:true,
        delegateOptions:{
          scrollView(){
            return that.parentScrollView
          },
          handler(axis, delta){
            const handler = delegateHandler(that.parentScrollView, that.childScrollView);
            return handler(axis, delta);
          }
        },
      },
      itemWrapOptions:{
        axis: "y",
        freeMode: false,
        // scrollbar: true,

        lazyload:{
            selector:'img'
        },

        sticky: {
          selector: '.item-group-title'
        },

        itemGroup:{
          selector:'.item-group',
          onChange:(index)=>{
            this.menuIndex = index;

            let element = this.menuScrollView.querySelector(`.menu-item:nth-child(${index+1})`);
            // this.menuScrollView.scrollToElement(element, 'y');
          }
        },

        delegate:true,
        delegateOptions:{
          scrollView(){
            return that.parentScrollView
          },
          handler(axis, delta){
            const handler = delegateHandler(that.parentScrollView, that.itemWrapScrollView);
            return handler(axis, delta);
          }
        },
      },
      menuOptions:{
        axis: "y",
        freeMode: false,
        // scrollbar: true,

        delegate:true,
        delegateOptions:{
          scrollView(){
            return that.parentScrollView
          },
          handler(axis, delta){
            const handler = delegateHandler(that.parentScrollView, that.menuScrollView);
            return handler(axis, delta);
          }
        },
      },
    };
  },
  methods: {
    changeTabIndex(index){
      this.tabIndex = index;

      this.tabContentWrapper.snap.goto(index);
    },

    handleMenuIndexChange(index){
      this.menuIndex = index;

      this.itemWrapScrollView.itemGroup.scrollTo(index);
    }
  },
  mounted(){
    this.parentScrollView = this.$refs.parent.$el.scrollView;
    this.tabContentWrapper = this.$refs.tabContentWrapper.scrollView;
    this.menuScrollView = this.$refs.menu.$el.scrollView;
    this.itemWrapScrollView = this.$refs.itemWrap.$el.scrollView;
    this.childScrollView = this.itemWrapScrollView;
  }
};
</script>

<style lang="scss" scoped>
.parent {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #777;
}

.shop-container{
  position:relative;
  padding:10px;
  padding: 80px 10px 10px;

  .shop-bg{
    z-index:-1;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:140px;
    transform-origin: center bottom;

    img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .mask{
      content:"";
      position:absolute;
      display:block;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background:rgba(10,10,10,0.2);
    }
  }
  .shop-info{
    position:relative;
    background-color:#fff;
    border-radius:5px;
    padding:15px;
    box-shadow:0 1px 10px rgba(0,0,0,0.1);
  }

  .logo{
    position:absolute;
    top:-40px;
    right:20px;
    width:80px;
    height:80px;
    border-radius:10px;
    overflow:hidden;
    border:1px solid #eee;
    object-fit:cover;
  }

  .title{
    color:#444;
  
  }

  .coupon-wrap{
    font-size:12px;
    padding:5px 0;
    color:#999;

    .coupon{
      background: #ffebce;
      color: #868686;
      padding: 2px 10px;
      border-radius: 2px;
      margin: 0 2px;
    }
  }

  .desc{
    // margin-top:5px;
    font-size:12px;
    color:#999;
  }
}

.banner-wrap{
  padding: 10px;
}

.banner {
  height: 100px;
  border: 1px solid #eee;
  border-radius: 10px;

  .banner-content {
    height:100%;
    white-space: nowrap;
    
  }

  .banner-item{
    display: inline-block;
    width: 100%;
    height: 100%;

    img{
      width: 100%;
      height:100%;
      object-fit: cover;
    }
  }
}

.panel{
  height:100vh;
  display: flex;
  flex-direction: column;
}

.tab-wrapper {
  display: flex;
  height: 45px;
  // min-height: 50px;
  z-index: 1;
  background-color: #ffffff;
  position: relative;
  border-bottom: 1px solid #eee;

  .tab-item {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666666;
    font-size: 16px;

    &.active {
      font-weight: 600;
      color: #333333;
    }
  }

  .tab-slider {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    left: 0%;
    transform: translateX(0);
    width: 100%;
    // transition: 0.2s;
    height: 0px;
    border-radius: 1px;

    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      bottom: 0px;
      left: 50%;
      width: 20px;
      margin-left: -10px;
      border-bottom: solid 2px rgb(35, 154, 233);
    }
  }
}

.goods-container {
  display: flex;
  height: 100%;

  .left {
    width: 80px;
  }

  .right {
    flex: 1;
    overflow: hidden;

  }

  .menu {
    height:100%;
    background: #f5f5f8;
    .menu-content {
      width: 100%;
    }

    .menu-item {
      font-size: 12px;
      height: 50px;
      line-height: 18px;
      padding: 10px 15px 22px;
      color:#666666;
      background: #f5f5f8;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active{
        background:#fff;
      }
    }
  }

  .main {
    height:100%;
    .main-content {
      width: 100%;
    }
  }

  .item-group{
    
  }
}

.item-group-title{
  font-size: 14px;
  padding: 4px 15px;
  background-color: #f5f5f5;
}

.tab-content-wrapper {
  width: 100%;
  flex:1;
  overflow: hidden;
  background:#eee;

  .tab-content-content {
    width: 300%;
    height: 100%;
    white-space:nowrap;
    padding-right:30px;
    box-sizing:content-box;
  }
}

.tab-content {
  width:33.3333%;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  background:#fff;

  & + .tab-content{
    margin-left:15px;
  }

  .block-content {
  }
}

img {
  width: 100%;
}

.rating-wrapper{
  height:100%;
}

.seller-wrapper{
  height:100%;
}

.fixed-header {
  z-index: 10;
  top: 0;
  left: 0;
  position: absolute;
}


</style>