<template>
  <div class="container">
    <button @click="show">显示</button>
  </div>
</template>

<script>
/* eslint-disable */
import Picker from "../../../../src/picker";

export default {
  components: {
  },
  data() {
    return {
      picker: null
    };
  },
  methods: {
    show( ) {
      this.picker.show();
    }
  },
  mounted(){
    let data1 = [];
    let data2 = []; 
    for(let i = 0; i < 1000; i++) {
      data1.push(`王者荣耀${i}区`);
    }
    for(let i = 0; i< 200; i++) {
      data2.push(`0区角色${i}`);
    }
    this.picker = new Picker({
      cols:[
        {data: data1},
        {data: data2}
      ],
      onChange: (colIndex, value, index, item) => {
        if(colIndex === 0) {
          const data = [];
          for(let i = 0; i< 200; i++) {
            data.push(`${index}区角色${i}`);
          }
          this.picker.setData(1, data);
        }
      }
    });

    this.picker.show();
  }
};
</script>

<style lang="scss" scoped>
$itemHeight:38px;
$itemCount:5;
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // background-color: #333;
  color: #777;
}
</style>