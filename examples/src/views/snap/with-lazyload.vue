<template>
  <div class="container">
    <div class="section">
      <ScrollView class="banner" ref="demo" :options="options">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item % 5 + 1}`" :key="item" @click="handleClick(item)">
            <img :data-src="require('@/assets/img1.jpg')" />
          </div>
        </div>
      </ScrollView>
    </div>
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
      options: {
        axis: "x",

        snap: {
          selector: ".banner-item",
        },

        lazyload:{
          selector:'img'
        },
      }
    };
  },
  methods: {
    handleClick(index){
      console.log('handleClick', index);
    },

    
  },
  mounted(){
    this.scrollView = this.$refs.demo.scrollView;
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #777;
}

.section {
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
  width:100%;
  height: 180px;

  .banner-content {
    width:100%;
    white-space: nowrap;
    
  }

  .banner-item{
    width:100%;

  }
}

img {
  width: 100%;
  height:100%;
  object-fit:cover;

  &[data-src]{
    opacity: 0.2;
    transition:opacity 0.3s;
  }

  &[lazyload-status=loaded]{
    opacity: 1;
  }
}


</style>