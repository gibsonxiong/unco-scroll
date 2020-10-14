<template>
  <div class="container">
    <ScrollView class="panel" :options="options">
      <div style="width:100%;padding:30px 0;">
        <h2 style="text-align:center;">表单</h2>
        <div class="form-item">
          <span class="form-item-label">字段1：</span>
          <input class="form-item-control"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段2：</span>
          <input class="form-item-control"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段3：</span>
          <input class="form-item-control" value="123"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段4：</span>
          <input class="form-item-control" value="123456789"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段5：</span>
          <input class="form-item-control" value="1234567897777777777"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段6：</span>
          <input class="form-item-control" value="12345678912345"/>
        </div>
        
        <div class="form-item">
          <span class="form-item-label">字段7：</span>
          <div class="form-item-control">
            <input type="checkbox"/>
          </div>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段8：</span>
          <div class="form-item-control">
            <input type="radio"/>
          </div>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段9：</span>
          <textarea class="form-item-control" style="height:100px"></textarea>
        </div>
        <div class="form-item">
          <span class="form-item-label">字段10：</span>
          <textarea class="form-item-control" style="height:100px">123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789</textarea>
        </div>
      </div>
    </ScrollView>
  </div>
</template>

<script>
/* eslint-disable */
import ScrollView from "@/components/ScrollView";

export default {
  components: {
    ScrollView,
  },
  data() {
    return {
      options: {
        scrollbar:true
      },
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size:16px;
}

.panel{
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
}

.form-item{
  display:flex;
  padding:10px;
  align-items:center;
}

.form-item-label{
  font-weight:600;
  width:85px;
}

.form-item-control{
  padding:5px;
   font-size:16px;
   width:100%;
}

</style>