<style lang="scss" scoped>
.container{
  padding-top:100px;
}

.content{
    width:100%;
    height:380px;
    background:#aaa;
}

img{
  width:100%;
}
</style>

<template>
  <div class="container">
    <div class="wrapper" ref="wrapper">
      <div class="content" ref="content">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import touch from '@/packages/touch';


export default {
  components:{
  },
  data(){
    return {
      
    }
  },
  methods:{

  },
  mounted(){
    var round = 1;
    // 父类
    this.$refs.wrapper.addEventListener('touchstart', (e) => {
      
      console.log('start parent');
    });

    this.$refs.wrapper.addEventListener('touchmove', (e) => {
      console.log('move parent');
    });

    this.$refs.wrapper.addEventListener('touchend', (e) => {
      console.log('end parent');
    });

    // 子类
    this.$refs.content.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('start child');
    });

    this.$refs.content.addEventListener('touchmove', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('move child');
    });

    this.$refs.content.addEventListener('touchend', (e) => {
      if(round === 1) {
        e.preventDefault();
        e.stopPropagation();
        round++;
      }
      console.log('end child');
    });

  }
}
</script>


