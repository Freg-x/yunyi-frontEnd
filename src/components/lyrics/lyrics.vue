<template>
  <div id="lyrics">
      <el-row>
          <el-col :span="24">{{test}}</el-col>
      </el-row>
  </div>
</template>

<script>

export default {
  name: 'lyrics',
  data(){
      return {
          test:'lyrics'
      }
  }
}

</script>

<style>
#banner {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>