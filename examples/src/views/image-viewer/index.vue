<template>
  <div class="container">
    <div class="group">
      <h2>Group1</h2>
      <img :src="require(`@/assets/img1.sm.jpg`)" :data-group="`default1`" :data-high-src="require(`@/assets/img1.jpg`)" @click="viewImage($event)" alt="">
      <img :src="require(`@/assets/img2.sm.jpg`)" :data-group="`default1`" :data-high-src="require(`@/assets/img2.jpg`)" @click="viewImage($event)" alt="">
      <img :src="require(`@/assets/img3.sm.jpg`)" :data-group="`default1`" :data-high-src="require(`@/assets/img3.jpg`)" @click="viewImage($event)" alt="">
    </div>
    <div class="group">
      <h2>Group2</h2>
      <img :src="require(`@/assets/img4.sm.jpg`)" :data-group="`default2`" :data-high-src="require(`@/assets/img4.jpg`)" @click="viewImage($event)" alt="">
      <img :src="require(`@/assets/img5.sm.jpg`)" :data-group="`default2`" :data-high-src="require(`@/assets/img5.jpg`)" @click="viewImage($event)" alt="">
      <img :src="require(`@/assets/img6.sm.jpg`)" :data-group="`default2`" :data-high-src="require(`@/assets/img6.jpg`)" @click="viewImage($event)" alt="">
    </div>
    <div class="group">
      <h2>Group3</h2>
      <img :src="require(`@/assets/img7.sm.jpg`)" :data-group="`default3`" @click="viewImage($event)" alt="">
      <img :src="require(`@/assets/img8.sm.jpg`)" :data-group="`default3`" @click="viewImage($event)" alt="">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ImageViewer from "../../../../src/image-viewer";

export default {
  data() {
    return {
      imageViewer: null
    };
  },
  methods: {
    viewImage(e) {
      this.imageViewer.show(e.target);
    }
  },
  mounted(){
    this.imageViewer = new ImageViewer();
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #777;
  padding:15px;
}

img{
  margin-right:10px;
  margin-bottom:10px;
  width:100px;
  height:100px;
  object-fit:cover;
}
</style>