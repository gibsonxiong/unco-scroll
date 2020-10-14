<template>
  <ScrollView class="container">
    <div>
      <ScrollView class="banner" :options="options" style="margin-top:50px;">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :key="item" @click="handleClick">
            <img
              :src="require(`@/assets/img${(item-1)%5+1}.sm.jpg`)"
              alt
            />
          </div>
        </div>
      </ScrollView>
    </div>
  </ScrollView>
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
          align:'center',
          loop:true,
          // lastAlign: 'end',
          // step: false,
          // onlyEdgeBounce: false,
        }
      }, 
    };
  },
  methods: {
    handleClick(index){
      console.log('handleClick', index);
    },
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
.my-swipe .van-swipe-item {
  position: relative;
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    height: 150px;
    text-align: center;
    // background-color: #39a9ed;
  }
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.banner {
  height: 180px;

  .banner-content {
    white-space: nowrap;
  }

  .banner-item{
    width:300px;
    transform: scale(0.9);
    transition: transform 0.2s ease-out;

    &.active {
      transform: scale(1);
    }

    & + .banner-item{
      margin-left: 0px;
    }
  }
}
        img{
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          top: 0;
          left: 0;
        }

</style>