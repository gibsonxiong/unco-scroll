<template>
  <div class="home-page">
    <ScrollView class="wrapper" ref="wrapper" :options="options">
      <div class="content" ref="content">
        <button @click="enable">Enable</button>
        <button @click="disable">Disable</button>
        <div>刷新次数：{{count}}，超过3次将禁止刷新</div>
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

      count:0,

      options: {
        scrollbar: true,

        topPull: {
          pullOffset: 60,

          defaultText:'下拉刷新',
          readyText:'释放刷新',
          loadingText:'刷新中...',

          onLoad: (loader)=> {
            setTimeout(()=>{
              this.list = [''];
              this.count ++;
              this.$nextTick(()=>{
                loader.complete('刷新成功', 300, this.count > 3);
              });
            },2000);
          }
        },

        bottomPull: {
          pullOffset: 60,

          defaultText:'上拉加载更多',
          readyText:'释放加载更多',
          loadingText:'加载中...',

          onLoad: (loader)=> {
            setTimeout(()=>{
              this.list.push('');
              this.$nextTick(()=>{
                loader.complete('加载成功', 3000);
              });
            },1000);
          }
        }
      }
    }
  },
  methods: {
    enable() {
      const sv = ScrollView.get(this.$refs.wrapper);
      const topPull = sv.topPull;

      topPull.enable();
    },
    disable() {
      const sv = ScrollView.get(this.$refs.wrapper);
      const topPull = sv.topPull;

      topPull.disable();
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  padding: 0;
  margin: 0;

  height:100vh;

  background: #f8f8f8;
}

.content{
  background: #fff;
}
</style>
