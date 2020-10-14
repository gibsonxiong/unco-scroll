<template>
  <ScrollView class="container" :options="parentOptions">
    <div class="container-content">
      <h2 class="c-header">普通嵌套2</h2>
        <div class="section">
          <h3>bounce true</h3>
          <ScrollView class="children" style="height:300px;" :options="options1">
            <div class="children-content">
              <Content :count="20"></Content>
            </div>
          </ScrollView>
        </div>
        <div class="section">
          <h3>bounce false</h3>
          <ScrollView class="children" style="height:300px;" :options="options2">
            <div class="children-content">
              <Content :count="20"></Content>
            </div>
          </ScrollView>
        </div>
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
      parentOptions: {
        axis:'y',
        scrollbar:true,
      },
      options1:{
        axis:'y',
        boundingReleaseY:true,
        scrollbar:true,
        freeMode: false
      },
      options2:{
        axis:'y',
        boundingReleaseY:true,
        bounceY: false,
        scrollbar:true,
        freeMode: false
      },
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.section{
  padding: 10px 30px 60px;
}

h3{
  margin-top: 20px;
  margin-bottom: 10px;
}

.container{
  position: relative;
  height: 100vh;
}


.children{
  border:1px solid #f1f1f1;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  .children-content{
    width:100%;
  }
}

</style>