<template>
  <div id="singleNews">
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
          <!-- 作者和文章信息区 -->
          <div class="writerInfoArea">
            <el-avatar :size="40" :src="ArticleInfo.writerAvatar"></el-avatar>
            <div class="writerDescArea">
              <div class="writerName">{{ArticleInfo.writerName}}</div>
              <div class="writerUpdateTime">{{ArticleInfo.updateTime}}</div>
            </div>
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
</template>

<script>
  import newsOther from './newsOther.vue';
  import writerRecommand from './writerRecommand.vue';

  export default {
    name: 'singleNews',
    data() {
      return {
        newsId: '1',
        curMode: 1,

        commentsCount:0,

        ArticleInfo: {
          title: "World experts hail Xi's proposals to boost global cause of women",
          writerAvatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          writerName: "Freakx",
          writerId: "1",
          updateTime: "2020-11-4 16:00:00",
          genre: "政治",
          viewNum: "16.4k",
          likeNum: 23,
          commentNum: 5,
          transRequestNum: 6,
          content: "President Xi Jinping's call for elimination of violence, discrimination and other forms of inequalities against women will consolidate global consensus on promoting gender equality and boost global action to further buttress the well-being of women, international experts said",
        },


      }
    },
    computed:{
      commentRoute: function(){
        return "/news/" + this.newsId + "/comment";
      },
      transRoute: function(){
        return "/news/" + this.newsId + "/trans"
      }
    },
    methods:{
      updateArticleInfo:function(){

        var articleUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
        + this.GLOBAL.apiController.article.info + this.newsId;

        this.$axios.get(
          articleUrl
        ).then(
          res =>{
            console.log(res);
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
      }
    },
    components: {
      newsOther,
      writerRecommand,
    },
    created: function () {
      this.newsId = this.$route.params.newsId;
      this.curMode = this.$route.fullPath.match("comment");
      this.updateArticleInfo();
    }
  }
</script>

<style>
  #singleNews{
    margin:20px;
  }
  .mainContent {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 0px 10px;
    margin-bottom: 10px;
  }

  .mainContent .breadcrumbArea {
    margin: 0px 20px;
    padding: 20px 10px;
  }

  .mainContent .greyline {
    margin-top: 20px;
    background-color: lightgray;
    height: 1px;
    border: none;
  }

  .mainContent .writerInfoArea {
    margin: 0px 20px;
    padding: 0px 10px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
  }

  .mainContent .writerInfoArea .writerDescArea {
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
    color: gray;
    margin: 0px 15px;
  }

  .commentAreaSwitch{
    margin:10px 10px;
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