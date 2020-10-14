<template>
  <div>
    <div v-for="item in 2" :key="item">
        <img
          src="../assets/img1.jpg"
          alt
        />
        <img
          src="../assets/img2.jpg"
          alt
        />
        <img
          src="../assets/img3.jpg"
          alt
        />
        <img
          src="../assets/img4.jpg"
          alt
        />
        <img
          src="../assets/img5.jpg"
          alt
        />
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
img{
  height:300px;
}
</style>