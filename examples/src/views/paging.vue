<template>
  <ScrollView class="container" :options="options">
    <div>
      <h2 class="c-header">10000条数据</h2>
      <Content :count="200" class="scroll-paging" v-for="item in 50" :key="item"></Content> 
    </div>
  </ScrollView>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";
import Content from "@/components/Content";

export default {
  components: {
    Content,
    ScrollView
  },
  data() {
    return {
      options: {
        scrollbar:true,
        paging: true
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
      height: 100vh;
}



.panel{
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

</style>