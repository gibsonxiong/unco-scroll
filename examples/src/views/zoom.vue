<template>
<div>
  <ScrollView ref="scrollView" class="zoom-wrap" :options="zoomOptions">
    <div>
      <div class="img-wrap">
        <img src="@/assets/img1.jpg" alt="">
      </div> 
    </div>
  </ScrollView>

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
      scrollView: null,

      zoomOptions: {

        alignX: 'center',
        alignY: 'center',

        zoom: true,
        zoomStart: 1,
        zoomMax: 4,
      },
    };
  },
  methods: {
    zoom(event) {
      this.scrollView.zoomTo(6, event.x, event.y);
    }
  },
  mounted() {
    this.scrollView = ScrollView.get(this.$refs.scrollView);

    // this.scrollView.touch.on('onDoubleTap', this.zoom);
  }
};
</script>

<style lang="scss" scoped>

.zoom-wrap{
  position: relative;
  width: 100%;
  height: 100vh;
}

.img-wrap {
    padding-bottom: 56%;
    position: relative;
}
.img-wrap > img {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    vertical-align:middle;
}

</style>