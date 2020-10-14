<template>
  <ScrollView class="container" :options="parentOptions">
    <div class="container-content">
      <h2 class="c-header">普通嵌套3</h2>
        <div class="box"></div>
        <ScrollView class="children" style="height:100vh;" :options="options">
          <div class="children-content">
            <Content :count="20"></Content>
          </div>
        </ScrollView>
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
        momentum: false,

        delegateDrag(axis, delta) {
          if(axis === 'x') return null;

          if(delta < 0) {
            return {
              scrollView: ScrollView.get('.children'),
              axis,
              delta: delta, 
            }
          }

          if(delta > 0) {
            if(this.isOverLowerBounding('y', this.scrollY + delta)) {

              return {
                scrollView: ScrollView.get('.children'),
                axis,
                delta: this.scrollY + delta - this.maxScrollY, 
              }
            } 
          }
        },

        onDelegateDrag(axis, delta) {
          if(axis === 'x') return 0;


          if(delta < 0) {
            if(this.isOverUpperBounding('y', this.scrollY + delta)) {
              return this.minScrollY - this.scrollY;
            } else {
              return delta;
            }
          }

          if(delta > 0) {
            if(this.isOverLowerBounding('y', this.scrollY + delta)) {
              return this.maxScrollY - this.scrollY;
            } else {
              return delta;
            }
          }
        }
      },
      options:{
        axis:'y',
        scrollbar:true,
        freeMode: false,
        momentum: false,

        delegateDrag(axis, delta) {
          if(axis === 'x') return null;

          if(delta < 0) {
            if(this.isOverUpperBounding('y', this.scrollY + delta)) {
              return {
                scrollView: ScrollView.get('.container'),
                axis,
                delta: this.scrollY + delta - this.minScrollY, 
              }
            } 
          }

          if(delta > 0) {
            if(!this.isOverUpperBounding('y', this.scrollY + delta)) {
              return {
                scrollView: ScrollView.get('.container'),
                axis,
                delta: this.scrollY + delta - this.minScrollY, 
              }
            } 
          }

        },

        onDelegateDrag(axis, delta) {
          if(axis === 'x') return 0;

          if(delta < 0) {
            if(this.isOverUpperBounding('y', this.scrollY + delta)) {
              return this.minScrollY - this.scrollY;
            } else {
              return delta;
            }
          }

          return delta;
        }
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

.box{
  height: 300px;
  background-color: #333;
}

.children{
  border:1px solid #f1f1f1;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  .children-content{
    width:100%;
  }
}

</style>