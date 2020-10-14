<template>
  <div class="container">
    <ScrollView class="banner3" ref="demo" :options="options">
      <div class="banner-content">
        <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item" @click="handleClick(item)">
          {{item}}
        </div>
      </div>
    </ScrollView>
    <div style="padding:10px;">
      <van-button @click="goto(2)">goto(2)</van-button>
      <van-button @click="prev()">prev()</van-button>
      <van-button @click="next()">next()</van-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";

export default {
  components: {
    ScrollView
  },
  data() {
    return {
      options: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          loop: false,
          align: 'center',
          autoplay: false,
          autoplayInterval: 1000,
          duration: 300,
          step: true
        }
      }
    };
  },
  methods: {
    handleClick(index){
      console.log('handleClick', index);
    },

    goto(index){
      this.scrollView.snap.goto(index);
    },

    prev(){
      this.scrollView.snap.prev();
    },

    next(){
      this.scrollView.snap.next();
    }
  },
  mounted(){
    this.scrollView = this.$refs.demo.scrollView;
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // background-color: #333;
  color: #777;
}

.section {
  padding:0 10px;

  & + .section {
    padding-top: 80px;
  }

  .section-title {
    color:  #e99;
    border-bottom: 2px solid #e99;
    margin: 10px 0;
  }

  .section-subtitle {
    font-size: 14px;
    margin: 5px 0;
  }
}

.banner-item {
  display: inline-block;
  width: 100%;
  height: 165px;
  line-height: 165px;
  font-size: 40px;
  color: #fff;
  text-align: center;

  &.c1{
    background: #e23;
  }

  &.c2{
    background: #2a2;
    
  }

  &.c3{
    background: #48e;
  }

  &.c4{
    background: #93a;
  }

  &.c5{
    background: #36a;
  }

  &.c6{
    background: rgb(248, 149, 19);
  }

  &.c7{
    background: rgb(48, 170, 252);
  }
}

.banner-x {
  height: 165px;

  .banner-content {
    width:100%;
    white-space: nowrap;
    
  }
}

.banner-y {
  height: 165px;

  .banner-content {
    width:100%;
    // white-space: nowrap;
    
  }
}

.banner3 {
  width:100%;
  height: 165px;

  .banner-content {
    width:100%;
    white-space: nowrap;
    
  }

  .banner-item{
    width:70%;

    & + .banner-item{
      margin-left: 10px;
    }
  }
}

img {
  width: 100%;
  height:100%;
  object-fit:cover;
}

button{
  height:60px;
  line-height:60px;
  font-size:14px;
  padding:0 20px;

  & + button{
    margin-left:10px;
  }
}

.first-virtual,
.last-virtual{
  // border: 1px solid #000;
}

</style>