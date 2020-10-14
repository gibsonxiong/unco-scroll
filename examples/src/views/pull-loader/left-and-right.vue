<template>
  <div class="home-page">
    <ScrollView class="wrapper" ref="wrapper" :options="options">
      <div class="content" ref="content">
        <Content2 v-for="(item,index) in list" :key="index"/>
      </div>
    </ScrollView>
  </div>
</template>

<script>
import ScrollView from "@/components/ScrollView";
import Content2 from "@/components/Content2";

export default {
  components:{
    ScrollView,
    Content2,
  },
  data(){
    return {
      list:[''],

      options: {
        axis: 'x',
        scrollbar: true,

        leftPull: {
          pullOffset: 60,

          defaultText:'右拉刷新',
          readyText:'释放刷新',
          loadingText:'刷新中...',

          onLoad: (loader)=> {
            setTimeout(()=>{
              this.list = [''];
              this.$nextTick(()=>{
                loader.complete('刷新成功', 500);
              });
            },500);
          }
        },

        rightPull: {
          pullOffset: 60,

          defaultText:'左拉加载更多',
          readyText:'释放加载更多',
          loadingText:'加载中...',

          onLoad: (loader)=> {
            setTimeout(()=>{
              this.list.push('');
              this.$nextTick(()=>{
                loader.complete('加载成功', 1000);
              });
            },500);
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  padding: 0;
  margin: 0;

  height:100vh;
}

.content{
  display: inline-flex;
  align-items: center;
  height: 100%;
}
</style>
