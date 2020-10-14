<template>
<div >
  <ScrollView class="parent" :options="options">
    <div style="width:100%;"> 
      <Content></Content>
    </div>
  </ScrollView>
  <ScrollView class="parent" :options="options2">
    <div style="width:100%;"> 
      <Content></Content>
    </div>
  </ScrollView>
  </div>
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
        onDragStart(e){
          console.log('onDragStart')
        },
        onDrag(e){
          console.log('onDrag')
        },
        onDragEnd(e){
          console.log('onDragEnd')
        },
        onScroll(e){
          console.log('onScroll')
        },
        onScrollEnd(e){
          console.log('onScrollEnd')
        },
        onAnimationStart(e){
          console.log('onAnimationStart')
        },
        onAnimation(e){
          console.log('onAnimation')
        },
        onAnimationEnd(e){
          console.log('onAnimationEnd')
        },
      },

      options2: {
        onDragStart(e){
         
        },
        onDrag(e){
          
        },
        onDragEnd(e){
          
        },
        onScroll(e){
          
        },
        onScrollEnd(e){
          if(e.completed) {
            console.log('completed');
          }
        },
        onAnimationStart(e){
         
        },
        onAnimation(e){
          
        },
        onAnimationEnd(e){
          
        },
      },

      
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>

.parent{
  position: relative;
  width: 100%;
  height: 50vh;
}



</style>