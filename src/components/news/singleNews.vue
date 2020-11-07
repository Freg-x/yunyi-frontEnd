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
            <comment-area></comment-area> 
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
import commentArea from './commentArea';

export default {
  name: 'singleNews',
  data(){
      return {
          newsId:'-1',

          ArticleInfo:{
            newsId:"1",
            title:"World experts hail Xi's proposals to boost global cause of women",
            writerAvatar:"../../assets/logo.png",
            writerName:"Freakx",
            writerId:"1",
            updateTime:"2020-11-4 16:00:00",
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
    writerRecommand,
    commentArea
  },
created:function(){
    this.newsId = this.$route.params.newsId;
  }
}

</script>

<style>

.mainContent{
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin:0px 10px;
  margin-bottom:20px;
}

.mainContent .breadcrumbArea{
  margin:0px 20px;
  padding:20px 10px;
}

.mainContent .greyline{
  margin-top:20px;
  background-color:lightgray;
  height:1px;
  border:none;
}

.mainContent .writerInfoArea{
  margin:0px 20px;
  padding:0px 10px;
  padding-bottom:20px;
  display: flex;
  flex-direction: row;
}

.mainContent .writerInfoArea .writerDescArea{
  display: flex;
  flex-direction: column;
  text-align: left;
}

.mainContent .writerInfoArea .writerDescArea .writerName{
  font-size: 20px;
  font-weight: bold;
  margin: 0px 15px;
}

.mainContent .writerInfoArea .writerDescArea .writerUpdateTime{
  color:gray;
  margin:0px 15px;
}
</style>