<template>
  <div id="intro">
      <el-row>
          <el-col :span="24">
            {{test}}
            </el-col>
      </el-row>
  </div>
</template>

<script>

export default {
  name: 'intro',
  data(){
      return {
          test:'这是本网站的主页，但目前竟然啥也没有！'
      }
  }
}

</script>

<style scoped>
#banner {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-col{
  height:700px;
}
</style>