<template>
  <div class="content">
    <Item2 v-for="item in count"  :key="item" :lazyload="lazyload" @click="handleClick"/>
  </div>
</template>

<script>
import Item2 from './Item2';

export default {
  components: {
    Item2
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
.content{
  display: inline-flex;
}
</style>