<template>
  <div id="mobile">
      <br>
      <br>
      <br>
      <div>当前版本尚未支持移动端</div>
      <br>
      <div>请使用pc浏览器访问</div>
   
      <div class="imgArea">
          <img src="../../assets/logo-tb.png" alt="logo" style="width:450px;height:300px">
      </div>
      
  </div>
</template>

<script>

export default {
  name: 'mobile',
  data(){
      return {
      }
  }
}

</script>

<style>
#mobile {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.imgArea{
    display: flex;
    justify-content: center;
}

</style>