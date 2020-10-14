<template>
  <div class="c-container">
    <Demo :initOptions="options"></Demo>
  </div>
</template>

<script>
/* eslint-disable */
import Demo from "@/components/Demo";

export default {
  components: {
    Demo
  },
  data() {
    return {
      options:{
        axis:'xy'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
</style>