<template>
  <div id="singleNews">
      <el-row>
          <el-col :span="18">
            <div class="mainContent">文章的主要内容</div>
          </el-col>
          <el-col :span="6">
            <writer-recommand></writer-recommand>
            <news-other></news-other>
          </el-col>
      </el-row>
  </div>
</template>

<script>

import newsOther from './newsOther.vue';
import writerRecommand from './writerRecommand.vue';

export default {
  name: 'singleNews',
  data(){
      return {
          newsId:'-1',

          ArticleInfo:{
            newsId:"1",
            title:"World experts hail Xi's proposals to boost global cause of women",
            writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            writerName:"Freakx",
            writerId:"1",
            genre:"政治",
            viewNum:"16.4k",
            likeNum:23,
            commentNum:5,
            transRequestNum:6,
            content:"President Xi Jinping's call for elimination of violence, discrimination and other forms of inequalities against women will consolidate global consensus on promoting gender equality and boost global action to further buttress the well-being of women, international experts said",
          },
      }
  },
  components:{
    newsOther,
    writerRecommand
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

.mainContent{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:10px 10px;
}
</style>