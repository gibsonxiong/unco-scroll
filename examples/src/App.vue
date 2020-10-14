<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
/* eslint-disable */

export default {
  data(){
    return {

    }
  },
  mounted(){
  }
}
</script>

<style lang="scss">
 html,body {
	position:relative;
	min-height:100%;
}
html {
	// overflow:hidden;
}
// #app {
//   position: fixed;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   height: 100%;
//   background: #f00;
// }
* {
	padding:0;
	margin:0;
	box-sizing: border-box;
}
li {
	list-style:none;
}
body {
	background:#fff;
	font-family: PingFang SC,STHeitiSC-Light,Helvetica-Light,arial,sans-serif;
	font-size:14px;
}
img{
  width: 100%;
}

.c-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
}



.c-header{
  text-align: center;
  padding: 15px;
  font-size: 16px;
  border-bottom: 1px solid #f1f1f1;
}

.banner-item {
  display: inline-block;
  width: 100%;
  height: 180px;
  line-height: 180px;
  align-items: center;
  font-size: 40px;
  color: #fff;
  text-align: center;

  &.c1{
    background: #e23;
  }

  &.c2{
    background: #2a2;
    
  }

  &.c3{
    background: #48e;
  }

  &.c4{
    background: #93a;
  }

  &.c5{
    background: #36a;
  }

  &.c6{
    background: rgb(248, 149, 19);
  }

  &.c7{
    background: rgb(48, 170, 252);
  }
}
</style>
