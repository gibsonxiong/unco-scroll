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
    // this.touch1 = new touch.Touch(this.$refs.wrapper, {
    //     stopPropagation:false,
    //     // onPanStart:  (e)=> {
    //     //     console.log('onPanStart',e);
    //     // },
    //     // onPan: (e)=> {
    //     //   console.log('onPan',e);

    //     //   e.event.preventDefault();
 
    //     // },
    //     // onPanEnd: (e)=> {
    //     //     console.log('onPanEnd',e);

    //     //     e.event.stopPropagation();
    //     //     e.event.preventDefault();
    //     // },
    //     // onPinchStart: (e)=> {
    //     //     console.log('onPinchStart',e);
    //     // },
    //     // onPinch: (e)=> {
    //     //     console.log('onPinch',e);
    //     // },
    //     // onPinchEnd: (e)=> {
    //     //     console.log('onPinchEnd',e);
    //     // },

    //     // onTap: (e)=> {
    //     //     console.log('onTap',e);
    //     // },

    //     // onDoubleTap: (e)=> {
    //     //     console.log('onDoubleTap',e);
    //     // },

    //     // onSwipe:(e)=>{
    //     //   console.log('onSwipe',e);
    //     // }
    // });
  }
}
</script>


