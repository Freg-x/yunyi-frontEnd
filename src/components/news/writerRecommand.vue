<template>
  <div id="writerRecommand">
      <div class="recommandMain">
        <el-row class="firstLine">
          <el-col class="avatarWrapper" :span="4">
            <el-avatar :size="40" :src="writerInfo.writerAvatar"></el-avatar>
          </el-col>
          <el-col class="InfoWrapper" :span="20">
            <div class="writerName">{{writerInfo.writerName}} 的上传文章</div>
            <div class="writerAge">{{writerInfo.writerAge}} 岁</div>
          </el-col>
        </el-row>

        <div class="recArea">
          <div 
          v-for="(news,index) in ArticleList"
          :key="index"
          class="singleRec"
          >
            <router-link :to="{path:'/news/'+news.id+'/comment'}"><b>[{{news.genre}}]</b> {{news.title}}</router-link>
            <div class="commentNum">{{news.hasTrans?"有翻译, ":"未翻译, "}}{{news.commentNum}} 人参与讨论</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'writerRecommand',
  data(){
      return {
        writerInfo:{
          writerName:"",
          writerAge:-1,
          writerAvatar:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        ArticleList:[
        ],
      }
  },
  //父组件告诉你writerId
  props:{
    writerId:{
      type:Number,
      default:-1
    }
  },
  watch:{
    //writerId 变了我就查
    writerId(){
      this.updateUserInfo();
      this.updateUploadList();
    }
  },
  methods:{
    updateUserInfo:function(){

    var userInfoUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.user.prefix
    + this.GLOBAL.apiController.user.info + this.writerId;

    this.$axios.get(userInfoUrl).then(
      res => {
        this.writerInfo.writerName = res.data.result.name;
        this.writerInfo.writerAge = res.data.result.age;
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
    },
    updateUploadList:function(){
      var uploadUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
      + this.GLOBAL.apiController.article.uploader + "/" + this.writerId;
      this.$axios.get(uploadUrl).then(
        res => {
          this.ArticleList = [];
          for(let resArticle of res.data.result){
            var newArticle = {};
            newArticle.id = resArticle.id;
            newArticle.title = resArticle.title;
            newArticle.genre = resArticle.genre;
            newArticle.hasTrans = resArticle.hasTrans;
            newArticle.commentNum = resArticle.commentNum;
            this.ArticleList.push(newArticle);
          }
          console.log(res);
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
    },
  },
  components:{
  },
  created:function(){
  }
}

</script>

<style scoped>

#writerRecommand .recommandMain{
  margin:20px;
  margin-top:0px;
  padding:20px;
  padding-bottom: 10px;
  color:black;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#writerRecommand .recommandMain .firstLine{
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(230,230,230);
}

#writerRecommand .recommandMain .firstLine .avatarWrapper{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

#writerRecommand .recommandMain .firstLine .InfoWrapper{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#writerRecommand .recommandMain .firstLine .InfoWrapper .writerName{
  margin-top:3px;
  font-size: 16px;
  color:black;
  font-weight: bold;
}

#writerRecommand .recommandMain .firstLine .InfoWrapper .writerAge{
  font-size: 12px;
  color:rgb(100, 100, 100);
}

#writerRecommand .recommandMain .recArea .singleRec{
  text-align: left;
  margin:15px 0px;
}

#writerRecommand .recommandMain .recArea .singleRec a{
  font-size: 14px;
  color:black;
  text-decoration: none;
  transition:0.5s;
}

#writerRecommand .recommandMain .recArea .singleRec a:hover{
  color:teal;
}

#writerRecommand .recommandMain .recArea .singleRec .commentNum{
  margin-top:5px;
  font-size: 12px;
  color:rgb(100,100,100);
}

</style>