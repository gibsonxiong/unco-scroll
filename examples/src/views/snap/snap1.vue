<template>
  <div class="container">
    <div class="section">
      <h2 class="section-title">axis</h2>
      <h3 class="section-subtitle">x</h3>
      <ScrollView class="banner-x" :options="scrollViewOptions1">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`"  :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">y</h3>
      <ScrollView class="banner-y" :options="scrollViewOptions2">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
    </div>
    <div class="section">
      <h2 class="section-title">step</h2>
      <h3 class="section-subtitle">true</h3>
      <ScrollView class="banner3" :options="scrollViewOptions3">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">false</h3>
      <ScrollView class="banner3" :options="scrollViewOptions4">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
    </div>
    <div class="section">
      <h2 class="section-title">onlyEdgeBounce</h2>
      <h3 class="section-subtitle">true</h3>
      <ScrollView class="banner3" :options="scrollViewOptions5">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 3" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">false</h3>
      <ScrollView class="banner3" :options="scrollViewOptions6">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 3" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
    </div>
    <div class="section">
      <h2 class="section-title">align</h2>
      <h3 class="section-subtitle">start</h3>
      <ScrollView class="banner3" :options="scrollViewOptions7">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">center</h3>
      <ScrollView class="banner3" :options="scrollViewOptions8">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">end</h3>
      <ScrollView class="banner3" :options="scrollViewOptions9">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
    </div>
    <div class="section">
      <h2 class="section-title">loop</h2>
      <h3 class="section-subtitle">true</h3>
      <ScrollView class="banner3" :options="scrollViewOptions10">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
      <h3 class="section-subtitle">false</h3>
      <ScrollView class="banner3" :options="scrollViewOptions11">
        <div class="banner-content">
          <div class="banner-item" v-for="item in 5" :class="`c${item}`" :key="item">
            {{item}}
          </div>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";

export default {
  components: {
    ScrollView
  },
  data() {
    return {
      scrollViewOptions1: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          
        }
      },
      scrollViewOptions2: {
        axis: "y",
        snap: {
          selector: ".banner-item",
          axis: "y"
        }
      },

      scrollViewOptions3: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          step: true,
          axis: "x"
        }
      },


      scrollViewOptions4: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          step: false,
          axis: "x"
        }
      },

      scrollViewOptions5: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          // step:false,
          onlyEdgeBounce: true,
          axis: "x"
        }
      },


      scrollViewOptions6: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          // step:false,
          onlyEdgeBounce: false,
          axis: "x"
        }
      },

      scrollViewOptions7: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          align:'start',
        }
      },

      scrollViewOptions8: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          align:'center',
        }
      },

      scrollViewOptions9: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          align:'end',
        }
      },    
      scrollViewOptions10: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
          loop:true
        }
      },
      scrollViewOptions11: {
        axis: "x",
        snap: {
          selector: ".banner-item",
          axis: "x",
        }
      },  
    };
  },
  methods: {
    handleClick(index){
      console.log('handleClick', index);
    },
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // background-color: #333;
  color: #777;
}

.section {
  padding:0 10px;

  & + .section {
    padding-top: 80px;
  }

  .section-title {
    color:  #e99;
    border-bottom: 2px solid #e99;
    margin: 10px 0;
  }

  .section-subtitle {
    font-size: 14px;
    margin: 5px 0;
  }
}

.banner-x {
  height: 180px;

  .banner-content {
    width:100%;
    white-space: nowrap;
    
  }
}

.banner-y {
  height: 180px;

  .banner-content {
    width:100%;
    // white-space: nowrap;
    
  }
}

.banner3 {
  width:100%;
  height: 180px;

  .banner-content {
    width:100%;
    white-space: nowrap;
    
  }

  .banner-item{
    width:70%;

    & + .banner-item{
      margin-left: 10px;
    }
  }
}

img {
  width: 100%;
  height:100%;
  object-fit:cover;
}

button{
  height:60px;
  line-height:60px;
  font-size:14px;
  padding:0 20px;

  & + button{
    margin-left:10px;
  }
}


</style>