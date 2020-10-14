<template>
  <ScrollView class="sv" :options="options">
    <div style="width:100%;">
      <Content :lazyload="true" :count="500"></Content>
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
        scrollbar: true,
        lazyload:{
            selector:'img'
        },
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>

.sv{
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>