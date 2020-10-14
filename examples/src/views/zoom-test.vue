<template>
<div @touchstart="start">
  <img src="@/assets/img4.jpg" alt="" :style="{'transform': `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`}" >

<div class="bottom">
  <button class="btn" @click="zoom1">zoom1</button>
  <button class="btn" @click="zoom2">zoom2</button>
</div>
</div>
</template>

<script>
/* eslint-disable */



export default {
  components: {

  },
  data() {
    return {
      scale: 1,
      x: 0,
      y: 0
      // zoomOptions: {
      //   axis:'xy',

      //   alignX: 'center',
      //   alignY: 'center',

      //   zoom: true,
      //   zoomStart: 1,
      //   zoomMax: 50,
      // },
    };
  },
  methods: {
    zoom1() {
      const centerX = 50;
      const centerY = 50;
      const newScale = 2;
      this.scale = this.scale * newScale;
      this.x -= newScale * centerX;
      this.y -= newScale * centerY;
    },
    zoom2() {
      const centerX = 150;
      const centerY = 150;
      const newScale = 1.5;
      this.scale = this.scale * newScale;
      this.x = this.x - newScale * centerX;
      this.y = this.y - newScale * centerY;
    },
    start(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>

.zoom-wrap{
  position: relative;
  width: 100%;
  height: 100vh;
}

.bottom {
    position: fixed;
  bottom: 200px;
  left: 100px;
}
.btn{
  width: 100px;
  height: 100px;

}

img{
  width:100px;
  height: 100px;
      // transform: matrix(1.5, 0, 0, 1.5, 0, 0);
      transform-origin: 0 0;
  // height:1200px;
}
</style>