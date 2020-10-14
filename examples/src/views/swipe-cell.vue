<template>
  <ScrollView class="container">
    <div class="content">

      <h3>两边</h3>
      <div class="cell-list">
        <SwipeCell v-for="(item,index) in 10" :key="index" :options="options1">
          <div class="item">
            <img class="img" src="@/assets/item1.png" alt />
            <div>
              <h2 class="title">巨无霸薯条菠萝派</h2>
              <p class="desc">好吃好吃好吃好吃好吃好吃好吃好吃!</p>
            </div>
          </div>
        </SwipeCell>
      </div>

      <h3>右边</h3>
      <div class="cell-list">
        <SwipeCell v-for="(item,index) in 3" :key="index" :options="options2">
          <div class="item">
            <img class="img" src="@/assets/item1.png" alt />
            <div>
              <h2 class="title">巨无霸薯条菠萝派</h2>
              <p class="desc">好吃好吃好吃好吃好吃好吃好吃好吃!</p>
            </div>
          </div>
        </SwipeCell>
      </div>

      <h3>左边</h3>
      <div class="cell-list">
        <SwipeCell v-for="(item,index) in 3" :key="index" :options="options3">
          <div class="item">
            <img class="img" src="@/assets/item1.png" alt />
            <div>
              <h2 class="title">巨无霸薯条菠萝派</h2>
              <p class="desc">好吃好吃好吃好吃好吃好吃好吃好吃!</p>
            </div>
          </div>
        </SwipeCell>
      </div>
    </div>
  </ScrollView>
</template>

<script>
/* eslint-disable */
import ScrollView from "../components/ScrollView";
import SwipeCell from "../components/SwipeCell";

export default {
  components: {
    ScrollView,
    SwipeCell
  },
  data() {
    return {
      options1: {
        onAction() {

        },
        leftActions: [
          {
            key: "select",
            type: "success",
            text: "选择"
          }
        ],
        actions: [
          {
            key: "add",
            type: "default",
            text: "加入关注"
          },
          {
            key: "delete",
            type: "danger",
            text: "删除"
          }
        ]
      },
      options2: {
        onAction() {

        },
        actions: [
          {
            key: "add",
            type: "default",
            text: "加入关注"
          },
          {
            key: "delete",
            type: "danger",
            text: "删除"
          }
        ]
      },
      options3: {
        onAction() {

        },
        leftActions: [
          {
            key: "select",
            type: "success",
            text: "选择"
          }
        ]
      }
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
h3{
  padding:10px 15px;
  font-size:14px;
  color: #777;
  font-weight: 500;
}
.container {
  background: #f8f8f8;
  height: 100vh;
}
.cell-list {
  margin-bottom: 15px;
  border-top: 1px solid #f2f2f2;
}
.item {
  background-color: #fff;
  padding: 10px;
  display: flex;
  border-bottom: 1px solid #f2f2f2;

  .img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 400;
    color: #222;
    // color: #444;
  }

  .desc {
    color: #777;
    margin-top: 5px;
    font-size: 12px;
  }
}
</style>