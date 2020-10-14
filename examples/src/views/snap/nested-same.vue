<template>
  <div class="container">
    <ScrollView class="parent-wrapper" :options="parentOptions">
      <div class="parent-content">
        <div class="slide">
          <ScrollView class="child-wrapper" :options="childOptions">
            <div class="child-content">
              <div class="child-slide">
                <div class="box">slide1-1</div>
              </div>
              <div class="child-slide">
                <div class="box">slide1-2</div>
              </div>
              <div class="child-slide">
                <div class="box">slide1-3</div>
              </div>
            </div>
          </ScrollView>
        </div>
        <div class="slide">
          <ScrollView class="child-wrapper" :options="childOptions">
            <div class="child-content">
              <div class="child-slide">
                <div class="box">slide2-1</div>
              </div>
              <div class="child-slide">
                <div class="box">slide2-2</div>
              </div>
              <div class="child-slide">
                <div class="box">slide2-3</div>
              </div>
            </div>
          </ScrollView>
        </div>
        <div class="slide">
          <ScrollView class="child-wrapper" :options="childOptions">
            <div class="child-content">
              <div class="child-slide">
                <div class="box">slide3-1</div>
              </div>
              <div class="child-slide">
                <div class="box">slide3-2</div>
              </div>
              <div class="child-slide">
                <div class="box">slide3-3</div>
              </div>
            </div>
          </ScrollView>
        </div>
      </div>
    </ScrollView>
    
  </div>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";
import Content from "@/components/Content";


export default {
  components: {
    ScrollView,
    Content,
  },
  data() {
    return {
      parentOptions:{
        axis: "y",
        freeMode: true,
        snap: {
          selector: ".slide",
          axis: "y",
        }
      },
      childOptions: {
        boundingReleaseY:true,
        axis: "y",
        freeMode: true,
        snap: {
          selector: ".child-slide",
          axis: "y",
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

.parent-wrapper {
  position:absolute;
  width:100%;
  height: 100%;
  // background: rgba(0,0,0,0.6);

  .parent-content {
    width:100%;
    height: 100%;
    background: transparent;
  }

  .slide{
    width:100%;
    height:100%;
  }
}

.child-wrapper {
  width:100%;
  height: 100%;
  background: transparent;

  .child-content {
    width:100%;
    height: 100%;
    background: transparent;
  }

  .child-slide{
    width:100%;
    height:100%;
  }
}

.box{
  width:100%;
  height:100%;
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}

img {
  width: 100%;
}
</style>