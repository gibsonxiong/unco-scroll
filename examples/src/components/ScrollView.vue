<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<script>

import ScrollView from '../../../src/index';

export default {
  get: ScrollView.get,
  _defaults: ScrollView._defaults,

  props:{
    options:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  watch:{
    options:{
      handler(value){
        this.scrollView.setOptions(value)
      },
      deep:true
    },
    
  },
  data(){
    return {
      scrollView:null
    }
  },
  
  methods:{
  },

  mounted() {
    this.scrollView = new ScrollView(this.$refs.container, this.options);
  },

  beforeDestroy() {
    this.scrollView.destroy();
  }
};
</script>

<style lang="scss">

</style>