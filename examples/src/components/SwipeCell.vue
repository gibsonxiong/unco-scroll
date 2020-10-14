<template>
  <div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import SwipeCell from '../../../src/swipe-cell';

export default {
  props:{
    options:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  data() {
    return {
      swipeCell: null
    };
  },
  mounted() {
    this.swipeCell = new SwipeCell(this.$el, this.options);

    // setTimeout(()=> {
    //   this.swipeCell.open();
    // },1000)

    // setTimeout(()=> {
    //   this.swipeCell.close();
    // },2000)
  },
  beforeDestroy() {
    this.swipeCell.destroy();
  }
};
</script>
