<template>
  <div id="transUploader" :style="defaultHeight">
    <el-row>
      <el-col :span="4">
        <div class="leftInfo">

        </div>
      </el-col>
      <el-col :span="20">
        231
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'transUploader',
  data(){
      return {
        defaultHeight:{
          height:""
        },
        newsId:-1
      }
  },
  methods:{
    getHeight:function(){
      this.defaultHeight.height = window.innerHeight - 95 + "px";
    },
    initPage:function(){
      window.addEventListener("resize", this.getHeight);
      this.getHeight();

      this.newsId = this.$route.params.newsId;
      var segmentUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
      + "/" + this.newsId + this.GLOBAL.apiController.article.segs;

      this.$axios.get(
        segmentUrl
      ).then(
        res => {
          console.log(res);
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
      
    }
  },
  created:function(){
    this.initPage();
  }
}

</script>

<style scoped>
#transUploader {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-row{
  height: 100%;
}

.el-col{
  height: 100%;
  background-color: white;
  overflow-y: scroll;
}

.leftInfo{
  height: 100%;
  background-color: #404040;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>