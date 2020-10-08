<template>
  <div id="singleNews">
      <el-row>
          <el-col :span="24">{{'当前新闻id：'+ newsId}}</el-col>
      </el-row>
  </div>
</template>

<script>

export default {
  name: 'singleNews',
  data(){
      return {
          test:'单个新闻界面',
          newsId:''
      }
  },
created:function(){
    this.newsId = this.$route.params.newsId;
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