<template>
  <div id="newsOther">
    <div class="firstLine">
      <div class="greenIcon"></div>
      <div class="recTitle">今日推荐</div>
    </div>
    <div class="recArea">
      <div 
      v-for="(news,index) in recList"
      :key="index"
      class="singleRec"
      >
        <router-link :to="{path:'/news/'+news.newsId+'/comment'}"><b>[{{news.genre}}]</b> {{news.title}}</router-link>
        <div class="commentNum">{{news.hasTrans?"有翻译, ":"未翻译, "}}{{news.commentNum}} 人参与讨论</div>
      </div>
    </div>
      
  </div>
</template>

<script>

export default {
  name: 'newsOther',
  data(){
      return {
          recList:[
          ]
      }
  },
  methods:{
    updateHotList:function(){
      var params = {
        "pageId": 1,
        "pageSize": 6,
        "sort":"hot",
      };
      this.$axios.get(
          this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
          + this.GLOBAL.apiController.article.all,
          {
            params
          }
      ).then(
        res => {
          this.recList = [];
          for(var newArticle of res.data.result.articleList){
            var curArticle = {};
            curArticle.newsId = newArticle.id;
            curArticle.title = newArticle.title;
            curArticle.hasTrans = newArticle.hasTrans;
            curArticle.commentNum = newArticle.commentNum;
            curArticle.genre = newArticle.genre;
            this.recList.push(curArticle);
          }
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
    }
  },
  components:{
  },
  created:function(){
    this.updateHotList();
  }
}

</script>

<style scoped>

#newsOther {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #909399;
  margin:20px;
  padding: 20px;
  padding-bottom: 10px;
  color:black;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#newsOther .firstLine{
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}

#newsOther .firstLine .greenIcon{
  width: 5px;
  height: 23px;
  background-color: teal;
}

#newsOther .firstLine .recTitle{
  margin-left:10px;
  font-size: 16px;
  text-align: left;
  font-weight: bold;
}

#newsOther .recArea .singleRec{
  text-align: left;
  margin:15px 0px;
}

#newsOther .recArea .singleRec a{
  font-size: 14px;
  color:black;
  text-decoration: none;
  transition:0.5s;
}

#newsOther .recArea .singleRec a:hover{
  color:teal;
}

#newsOther .recArea .singleRec .commentNum{
  margin-top:5px;
  font-size: 12px;
  color:rgb(100,100,100);
}

</style>