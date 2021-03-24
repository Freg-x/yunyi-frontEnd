<template>
  <div id="singleNews">
    <div>
      <el-row>
        <!-- 左半部分，主要内容和评论区 -->
        <el-col :span="18">
          <div class="mainContent">
            <!-- 面包屑导航区 -->
            <div class="breadcrumbArea">

              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/news'}">新闻</el-breadcrumb-item>
                <el-breadcrumb-item>{{ArticleInfo.genre}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ArticleInfo.title}}</el-breadcrumb-item>
              </el-breadcrumb>
              <hr class="greyline">
            </div>
            <!-- 标题 -->
            <div class="newsTitle">
              {{transMode?ArticleInfo.bestTrans.title:ArticleInfo.title}}
            </div>
            <!-- 作者和文章信息区 -->
            <div class="writerInfoArea">
              <el-avatar :size="40" :src="ArticleInfo.writerAvatar"></el-avatar>
              <div class="writerDescArea">
                <el-row>
                  <el-col :span="12">
                    <div class="writerName">{{ArticleInfo.writerName}}</div>
                    <div class="writerUpdateTime">最初发布于：{{ArticleInfo.uploadTime}} <div style="margin-left:20px">当前字数：{{wordCount}}</div></div>
                  </el-col>
                  <el-col :span="12" class="rightCol">
                    <el-switch
                    v-model="transMode"
                    active-text="翻译模式"
                    inactive-text="原文模式"
                    :disabled="!ArticleInfo.hasTrans"
                    ></el-switch>
                    <div class="switchNote">
                      {{switchNoteInfo}}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="contentArea">
              {{transMode?ArticleInfo.bestTrans.content:ArticleInfo.content}}
            </div>
            <hr class="greyline">
            <div class="contentBottom">
                <el-row>
                  <el-col :span="18" class="bottomLeft">
                    <div :class="{likeIcon:true, yellow:ArticleInfo.liked}" @click="handleLikeButtonClicked">
                      <i class="el-icon-sunny"></i> {{ArticleInfo.likeNum}} 次点赞
                    </div>
                    <div :class="{requestIcon:true, green:ArticleInfo.requestVote}" @click="handleRequestButtonClicked">
                      <i class="el-icon-user"></i> {{ArticleInfo.transRequestNum}} 人求翻译
                    </div>
                  </el-col>
                  <el-col :span="6" class="bottomRight">
                    最后更新于：{{ArticleInfo.updateTime}}
                  </el-col>
                </el-row>
            </div>

          </div>

          <div class="commentAreaSwitch">
            
            <router-link :to="commentRoute" :class="{selected : curMode}" >评论区</router-link>
            <span>/</span>
            <router-link :to="transRoute" :class="{selected : !curMode}">翻译区</router-link>
          </div>

          <router-view></router-view>

        </el-col>
        <!-- 右半部分，作者推荐和其他新闻推荐 -->
        <el-col :span="6">
          <writer-recommand></writer-recommand>
          <news-other></news-other>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import newsOther from './newsOther.vue';
  import writerRecommand from './writerRecommand.vue';

  export default {
    name: 'singleNews',
    data() {
      return {
        newsId: -1,

        //评论区还是翻译区
        curMode: 1,

        //原文模式还是翻译模式
        transMode:false,

        ArticleInfo: {},
      }
    },
    computed:{
      commentRoute: function(){
        return "/news/" + this.newsId + "/comment";
      },

      transRoute: function(){
        return "/news/" + this.newsId + "/trans"
      },

      switchNoteInfo:function(){
        if(!this.ArticleInfo.hasTrans){
          return "该文章暂时没有翻译，无法切换模式哦";
        }
        else{
          return "该翻译由 "+this.ArticleInfo.bestTrans.uploaderName+" 大佬提供，共获得点赞 "+this.ArticleInfo.bestTrans.likeNum +" 次！"
        }
      },

      wordCount:function(){
        if(!this.ArticleInfo.content)return 0;
        if(this.transMode){
          return this.ArticleInfo.bestTrans.content.length;
        }
        else{
          return this.ArticleInfo.content.length;
        }
      }
    },
    methods:{
      handleLikeButtonClicked:function(){
        var token = this.GLOBAL.getCookie("jwt");
        if(token){
          var requestOp = "";
          if(this.ArticleInfo.liked)requestOp = "/cancel_like";
          else requestOp = "/like";

          var requestURL = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix + "/"
          + this.newsId + requestOp;
          var data = {
            "articleId":this.newsId
          };

          this.$axios.post(requestURL,data,{
            params:{
              token:token
            }
          }
          ).then(
            () => {
              this.updateArticleInfo();
            }
          ).catch(
            error => {
              console.log(error);
            }
          );
        }else{
          this.$message({
            message:"请登录后再操作！",
            type:"warning"
          });
        }
      },
      handleRequestButtonClicked:function(){
        var token = this.GLOBAL.getCookie("jwt");
        if(token){
          var requestURL = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix + "/"
          + this.newsId + this.GLOBAL.apiController.article.request_trans;
          var data = {
            "articleId":this.newsId
          };

          this.$axios.post(requestURL,data,{
            params:{
              token:token
            }
          }
          ).then(
            () => {
              this.updateArticleInfo();
            }
          ).catch(
            error => {
              console.log(error);
            }
          );
        }else{
          this.$message({
            message:"请登录后再操作！",
            type:"warning"
          });
        }
      },
      updateArticleInfo:function(){

        var token = this.GLOBAL.getCookie("jwt");

        var articleUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
        + this.GLOBAL.apiController.article.info + this.newsId;

        this.$axios.get(
          articleUrl,{
            params:{
              token:token
            }
          }
        ).then(
          res =>{
            console.log(res);
            var sampleArticle = {
              bestTrans:null,
              title: "",
              writerAvatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
              writerName: "",
              writerId: -1,
              uploadTime:"",
              updateTime: "",
              genre: "",
              viewNum: "",
              liked:false,
              hasTrans:false,
              likeNum: 0,
              transRequestNum: 0,
              content: "",
            }
            var resArticle = res.data.result;

            sampleArticle.hasTrans = resArticle.hasTrans;
            if(sampleArticle.hasTrans){
              sampleArticle.bestTrans = {};
              sampleArticle.bestTrans.content = resArticle.bestTranslation.content;
              sampleArticle.bestTrans.likeNum = resArticle.bestTranslation.likeNum;
              sampleArticle.bestTrans.transId = resArticle.bestTranslation.transId;
              sampleArticle.bestTrans.title = resArticle.bestTranslation.transTitle;
              sampleArticle.bestTrans.uploaderId = resArticle.bestTranslation.uploaderId;
              sampleArticle.bestTrans.uploaderName = resArticle.bestTranslation.uploaderName;
            }
            sampleArticle.title = resArticle.title;
            sampleArticle.writerName = resArticle.name;
            sampleArticle.writerId = resArticle.uploaderId;
            sampleArticle.uploadTime = this.GLOBAL.seconds2String(resArticle.createTime);
            sampleArticle.updateTime = this.GLOBAL.seconds2String(resArticle.updateTime);
            sampleArticle.genre = resArticle.genre;
            sampleArticle.viewNum = resArticle.viewNum;
            sampleArticle.liked = resArticle.like;
            sampleArticle.requestVote = resArticle.requestVote;
            sampleArticle.likeNum = resArticle.likeNum;
            sampleArticle.transRequestNum = resArticle.transRequestNum;
            sampleArticle.content = resArticle.originalText;
            this.ArticleInfo = sampleArticle;
          }
        ).catch(
          error =>{
            this.$message({
              message:"更新文章内容失败",
              type:"warning"
            });
            console.log(error);
          }
        );
      }
    },
    watch:{
      $route(to){
        this.curMode = to.fullPath.match("comment");
        this.transMode = false;
        this.newsId = this.$route.params.newsId;
        this.updateArticleInfo();
      }
      },
    components: {
      newsOther,
      writerRecommand,
    },
    created: function () {
      this.newsId = this.$route.params.newsId;
      this.curMode = this.$route.fullPath.match("comment");
      this.transMode = false;
      this.updateArticleInfo();
    }
  }
</script>

<style scoped>
/*这块写的很烂，有点hardcode见谅 */
#singleNews{
  margin:20px;
}

.mainContent {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0px 10px;
  margin-bottom: 10px;
  padding:10px 40px;
  padding-bottom:20px;
}

.mainContent .breadcrumbArea {
  padding: 20px 0px;
}

.mainContent .greyline {
  margin-top: 20px;
  background-color: lightgray;
  height: 1px;
  border: none;
}

.mainContent .newsTitle{
  text-align: left;
  font-size: 30px;
  font-weight: bold;
  margin-top:-10px;
  margin-bottom: 5px;
  color:black;
}

.mainContent .writerInfoArea {
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
}

.mainContent .writerInfoArea .writerDescArea {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.mainContent .writerInfoArea .writerDescArea .writerName {
  font-size: 20px;
  font-weight: bold;
  margin: 0px 15px;
}

.mainContent .writerInfoArea .writerDescArea .writerUpdateTime {
  display: flex;
  color: gray;
  margin: 0px 15px;
}

.mainContent .writerInfoArea .rightCol{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  vertical-align: center;
  padding-top: 5px;
}

.mainContent .writerInfoArea .rightCol .switchNote{
  margin-top:5px;
  font-size: 12px;
  color:rgb(100,100,100);
}

.mainContent .contentArea{
  color:black;
  text-align: left;
  font-size: 18px;
  line-height: 2;
  white-space: pre-line;
}

.mainContent .contentBottom{
  margin-top:10px;
  width: 100%;
}

.mainContent .contentBottom .bottomLeft{
  color:rgb(50,50,50);
  font-size: 14px;
  display: flex;
  flex-direction: row;
}

.mainContent .contentBottom .bottomLeft .likeIcon{
  transition: 0.5s;
}

.mainContent .contentBottom .bottomLeft .likeIcon:hover{
  color:rgb(165, 152, 34);
  cursor: pointer;
}

.mainContent .contentBottom .bottomLeft .yellow{
  color:rgb(165, 152, 34);
}

.mainContent .contentBottom .bottomLeft .requestIcon{
  margin-left: 40px;
  transition: 0.5s;
}

.mainContent .contentBottom .bottomLeft .requestIcon:hover{
  color:teal;
  cursor: pointer;
}

.mainContent .contentBottom .bottomLeft .green{
  color:teal;
}


.mainContent .contentBottom .bottomRight{
  padding-top: 1px;
  vertical-align: center;
  text-align: right;
  font-size: 12px;
  color:rgb(100,100,100);
}

.commentAreaSwitch{
  margin:20px 10px;
  text-align: left;
  font-size: 14px;
  color: #606266;
}

.commentAreaSwitch a{
  color: #606266;
  text-decoration: none;
}

.commentAreaSwitch .selected{
  color: black;
  font-weight: bold;
}

.commentAreaSwitch span{
  padding: 10px 10px;
}

</style>