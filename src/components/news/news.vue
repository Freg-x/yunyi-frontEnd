<template>
  <div id="news">
      <el-row>
          <el-col :span="18">
            <newsMain></newsMain>
          </el-col>
          <el-col :span="6">
            <newsOther></newsOther>
          </el-col>
      </el-row>
  </div>
</template>

<script>

import newsMain from './newsMain.vue';
import newsOther from './newsOther.vue';

export default {
  name: 'news',
  data(){
      return {
          test:'news'
      }
  },
  components:{
    newsMain,
    newsOther
  }
}

</script>

<style>
#news {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>