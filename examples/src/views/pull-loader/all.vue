<template>
  <div class="home-page">
    <ScrollView class="wrapper" ref="wrapper" :options="options">
      <div class="content" ref="content">
        <Content v-for="(item,index) in list" :key="index"/>
      </div>
    </ScrollView>
  </div>
</template>

<script>
import ScrollView from "@/components/ScrollView";
import Content from "@/components/Content";

export default {
  components:{
    ScrollView,
    Content,
  },
  data(){
    return {
      list:[''],

      options: {
        scrollbar: {
          axis: 'y'
        },
        
        scrollNeedOverflow: false,

        freeMode: false,

        topPull: {
          pullOffset: 50,

          defaultText:'下拉刷新',
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

        bottomPull: {
          pullOffset: 50,

          defaultText:'上拉加载更多',
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
        },

        leftPull: {
          pullOffset: 50,

          defaultText:'右拉到顶部',
          readyText:'释放到顶部',
          loadingText:'',

          onLoad: (loader)=> {
            loader.scrollView.scrollTo(undefined, 0, {
              duration: 500,
            });
            loader.complete('', 0);
          }
        },

        rightPull: {
          pullOffset: 50,

          defaultText:'左拉到底部',
          readyText:'释放到底部',
          loadingText:'',

          onLoad: (loader)=> {
            loader.scrollView.scrollTo(undefined, loader.scrollView.maxScrollY, {
              duration: 500
            });
            loader.complete('', 0);
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
</style>
