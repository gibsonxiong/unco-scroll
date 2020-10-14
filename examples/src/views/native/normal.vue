<template>
  <div class="container">
      <div class="content">
        <!-- <div class="c-item" v-for="item in 10000" :key="item">
          item{{item}}
        </div> -->
        <Content></Content>
      </div>
  </div>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";
import Content from "@/components/Content";

export default {
  components: {
    Content
  },
  data() {
    return {
      options: {
        axis:'y',
        scrollbar:true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  justify-content: center;
}

// .scrollview{
//   height: 100%;

  .content{
  }

  .c-item{
    height:60px;
    & + .c-item{
      border-top: 1px solid #eee;
    }
  }
// }

</style>