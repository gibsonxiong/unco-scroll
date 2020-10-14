<style lang="scss" scoped>
.container{
  padding: 0;
  margin: 0;
}
.container{
  height: 100vh;
  overflow: hidden;
}

.box{
  width:1500px;
}

img{
  width:1000px;
  height:1200px;
}
</style>

<template>
  <div class="home-page">
    <div class="container" ref="container">
      <div class="box" ref="box">
        <img src="@/assets/img1.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {

  data(){
    return {
      scrollView:null
    }
  },
  methods:{
  },
  mounted(){
    let wrapper = document.querySelector('.container');
    this.scrollView = new BScroll(wrapper,{
      scrollbar:true,
      scrollX:true,
      scrollY:true,
      freeScroll:true,
      zoom:true,
      bounce:false
    })
  }
}
</script>


