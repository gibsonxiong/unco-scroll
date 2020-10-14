<template>
  <div>
    <Item v-for="item in count"  :key="item" :lazyload="lazyload" @click="handleClick"/>
  </div>
</template>

<script>
import Item from './Item';

export default {
  components: {
    Item
  },
  props:{
    count: {
      type: Number,
      default: 20,
    },
    lazyload: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
    }
  },
  methods:{
    handleClick(){
      console.log('handleClick');
    }
  }
}
</script>

<style scoped lang="scss">
</style>