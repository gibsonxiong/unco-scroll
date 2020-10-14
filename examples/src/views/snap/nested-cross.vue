<template>
  <div class="container">
    <ScrollView class="viewer-wrapper" :options="wrapperOptions">
      <div class="viewer-content">
        <ScrollView v-for="item1 in 6" :key="item1" class="block-wrapper" :options="options">
          <div class="block-content">
            
            <div class="block-item" v-for="item2 in 5" :key="item2">
              <img :src="require(`@/assets/img${item2}.jpg`)" alt />
            </div>
          </div>
        </ScrollView>
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
      wrapperOptions:{
        axis: "y",
        freeMode:false,
        snap: {
          selector: ".block-wrapper",
          axis: "y",
        }
      },
      options: {
        axis: "x",
        freeMode:false,
        snap: {
          selector: ".block-item",
          axis: "x",
        }
      },
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #777;
}

.viewer-wrapper {
  position:absolute;
  width:100%;
  height: 100%;
  background: rgba(0,0,0,0.9);

  .viewer-content {
    width:100%;
    height: 100%;
    background: transparent;
  }
}

.block-wrapper {
  width:100%;
  height: 100%;
  background: transparent;

  .block-content {
    width:100%;
    height: 100%;
    white-space: nowrap;
    background: transparent;
    .block-item {
     
      vertical-align: text-bottom;
      display: inline-flex;
      align-items:center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      color: #fff;
      

      & + .block-item{
         margin-left:15px;
      }
    }
  }
}

img {
  width: 100%;
}
</style>