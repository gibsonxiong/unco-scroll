<template>
    <div class="demo-view" :style="{paddingTop: paddingTop + 'px'}">
        <ScrollView class="scrollview" :class="`scrollview-${axis}`" :options="options">
            <div class="content">
                <div class="c-item" v-for="item in itemCount" :key="item">
                    <img v-if="axis === 'xy'" src="@/assets/img1.jpg"/>
                    <template v-else>
                        item{{item}}
                    </template>
                
                </div>
            </div>
        </ScrollView>
        <div class="config-view" v-show="visible">
            <div class="header">
                <h3>配置</h3>
                <span class="close-btn" @click="visible = false">关闭</span>
            </div>
            <div class="body">
                <div class="form">
                    <div class="form-item">
                        <div class="form-item-label">
                            Item数量
                        </div>
                        <div class="form-item-control">
                            <input v-model.number="itemCount"/>
                        </div>
                    </div>
                    <div class="form-item" v-for="(value,key) in options" :key="key">
                        <div class="form-item-label">
                            {{key}}
                        </div>
                        <div class="form-item-control">
                            <input v-if="typeof value === 'number'" v-model.number="options[key]"/>
                            <input v-else-if="typeof value === 'boolean'" type="checkbox" v-model="options[key]"/>
                            <input v-else v-model="options[key]"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="open-btn" @click="visible = true;">配置</div>
    </div> 
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";

const optionTypes = {
   

} 

export default {
    props:{
        initOptions: {
            type:Object,
            default(){
                return {
                    
                };
            }
        }
    },
    data(){
        return {
            visible:false,

            options:ScrollView._defaults,
            itemCount: 1000,

            paddingTop: 0
        }
    },
    
  components: {
    ScrollView,
  },
  computed:{
      axis(){
          return this.options.axis || 'y';
      }
  },
  created(){
      const that = this;
      this.options = {
          ...this.options,
          ...this.initOptions,

        //   onDrag(e){
        //     if(e.deltaY > 0  && that.paddingTop > 0){
        //         that.paddingTop -= e.deltaY ;
        //         e.deltaY = 0;
        //         this.refresh();
        //     }
        //     else if(e.deltaY < 0  && that.paddingTop < 200){
        //         that.paddingTop -= e.deltaY ;
        //         e.deltaY = 0;
        //         this.refresh();
        //     }
        // }
      }

      this.itemCount 
  }
};
</script>

<style lang="scss" scoped>
.demo-view{
    width:100%;
    height:100%;

    // padding: 30px;

}

.c-item {
  font-size: 18px;
  color:#444;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.scrollview{
  border:1px solid #eee;
  height:100%;
  background-color: #eee;

  .content{
      background-color: #fff;
  }
}

.scrollview-x{

  .content {
    display: inline-block;
    height:100%;
    white-space: nowrap;
  }

  .c-item{
   width:100px;
    & + .c-item{
      border-left: 1px solid #eee;
    }
  }
}

.scrollview-y{

  .c-item{
    height:60px;

    & + .c-item{
      border-top: 1px solid #eee;
    }
  }
}

.scrollview-xy{

    .content{
        display: inline-block;
    }

    .c-item{
        width:1000px;
        height:auto;       
    }
    }

    .config-view{
        position: fixed;
        z-index: 10;
        background-color: rgba(0,0,0,0.8);
        border-radius: 10px;
        color: #fff;
        width: 95%;
        height: 95%;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        
        font-size:16px;
        display:flex;
        flex-direction: column;

        .header{
            display: flex;
            justify-content: space-between;
            padding:10px 15px;

        }

        .body{
            flex:1;
            overflow:auto;
            padding:5px 15px;
        }

        .close-btn{
            // position:absolute;
            // top:10px;
            // right:10px;
            color:#fff;
        }
    }

    .open-btn{
        z-index:5;
        position:absolute;
        top:0;
        right:0;
        padding:5px 10px;
        background:#2db2e4;
        color:#fff;
    }

    .form{
        .form-item{
            padding:10px 0;
            display:flex;
            align-items:center;

            .form-item-label{
                width: 150px;
        word-break: break-all;
        margin-right: 10px;
            }

            .form-item-control{
                text-align:right;
                flex:1;
            }
        }
    }

input{
    color:#444;
    padding-left:5px;
    font-size:16px;
    height:30px;
}
</style>