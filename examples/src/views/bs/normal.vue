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
  width:100%;
}

img{
  width:100%;
}
</style>

<template>
  <div class="home-page">
    <div class="container" ref="container">
      <div class="box" ref="box">
        <!-- <button @click="scrollTo">scrollTo</button> -->
        <Content></Content>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Content from "@/components/Content";

export default {
  components:{
    Content
  },
  data(){
    return {
      scrollView:null
    }
  },
  methods:{
    scrollTo(){
      this.scrollView.scrollTo(0,1000);
    }
  },
  mounted(){
    let wrapper = document.querySelector('.container');
    this.scrollView = new BScroll(wrapper,{
      scrollX:true,
      scrollY:true,
      scrollbar:true,
      useTransition:false,
    })
  }
}
</script>


