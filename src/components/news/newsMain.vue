<template>
  <div id="newsMain">

      <!--类别选择器-->
      <el-row>
          <el-col 
          :span="4"
          v-for="(genre,index) in genres"
          :key="index"
          >
          <div>
            <div 
            :class="{genreSelect:curGenre == genre.id}" 
            class="genreWrapper"
            :id="genre.id"
            @click="handleGenreChange(genre.id)"
            >
                <i :class="genre.icon" 
                style="font-size:20px"
                >
                </i>
                {{genre.name}}
            </div>
          </div>
            
          </el-col>
          
      </el-row>
    
    <!--查询和模式选择器-->
      <el-row>
          <el-col :span="14">
            <el-menu
            :default-active="defaultMode"
            id="modeChangeMenu"
            mode="horizontal"
            @select="handleModeChange"
            background-color="#EEEEEE"
            >
                <el-menu-item index="1">全部内容</el-menu-item>
                <el-menu-item index="2">已翻译内容</el-menu-item>
                <el-menu-item index="3">未翻译内容</el-menu-item>
            </el-menu>
          </el-col>

          <el-col :span="8">
              <el-input
              v-model="searchText" 
              placeholder="按关键词检索新闻"
              id="newsSearchInput"
              >
                <i class="el-icon-search newsSearchIcon"
                slot="suffix"
                >
                </i>
              </el-input>
          </el-col>

          <el-col :span="2" >
              <el-select v-model="displayMode" id="sortMethod">
                  <el-option value="1" label="最热"></el-option>
                  <el-option value="2" label="最新"></el-option>
              </el-select>
              
          </el-col>
      </el-row>

        <!--所有新闻的列表-->
      <div class="allNews">
        <div
        class="newsCell"
        v-for="(news,index) in newsList"
        :key="index"
        >

            <div class="firstLine">
                <div class="left">
                    <el-avatar :size="25" :src="news.writerAvatar"></el-avatar>
                    <div class="newsTitle" @click="handleNewsClick(news.newsId)">{{news.curMode == 0?news.title:news.transTitle}}</div>
                </div>
                <el-switch
                v-model="news.curMode"
                active-text="翻译模式"
                inactive-text="原文模式"
                :disabled="!news.hasTrans"
                :title="news.switchTitle"
                >
                </el-switch>
            </div>

            <div class="secondLine">
                <div>
                    <a>{{news.writerName}}</a>发布到了<a>{{news.genre}}</a>板块     
                </div>
                <i class="el-icon-view">{{news.viewNum}} 次阅读</i>  
                
            </div>

            <div class="thirdLine">
                {{news.curMode==0?news.summary+"...":news.transSummary+"..."}}
            </div>
            <div class="lastLine">
                <div>
                    <i class="el-icon-sunny"></i>
                    {{news.likeNum}}人喜欢
                </div>
                <div>
                    <i class="el-icon-chat-dot-square"></i>
                    {{news.commentNum}}条评论
                </div>
                <div>
                    <i class="el-icon-user"></i>
                    {{news.transRequestNum}}人求翻译
                </div>
            </div>

        </div>
      </div>

    <el-pagination
    id="newsPagination"
    layout="prev, pager, next"
    :total="newsPageCount"
    @current-change="handleCurrentPageChange"
    ></el-pagination>
      
        
  </div>
</template>

<script>

export default {
  name: 'newsMain',
  data(){
      return {

          genres:[
              {
                  id:"genre1",
                  name:"全部",
                  icon:"el-icon-s-home"
              },
              {
                  id:"genre2",
                  name:"政治",
                  icon:"el-icon-s-management"
              },
              {
                  id:"genre3",
                  name:"影视",
                  icon:"el-icon-video-camera-solid"
              },
              {
                  id:"genre4",
                  name:"游戏",
                  icon:"el-icon-s-promotion"
              },
              {
                  id:"genre5",
                  name:"科技",
                  icon:"el-icon-cpu"
              },
              {
                  id:"genre6",
                  name:"体育",
                  icon:"el-icon-basketball"
              }
          ],

          curGenre:"genre1", //科技、体育等种类

          defaultMode:"1", //已翻译、未翻译等模式

          searchText:"",

          displayMode:"1",

          newsList:[
              {   newsId:"1",
                  title:"「每日 1 题」9 月热题来袭！",
                  transTitle:" 原文的翻译原文的翻译原文的翻译",
                  writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                  writerName:"Freakx",
                  genre:"科技",
                  viewNum:"16.4k",
                  hasTrans:true,
                  switchTitle:"显示最高赞翻译",
                  curMode:0,
                  likeNum:23,
                  commentNum:5,
                  transRequestNum:6,
                  summary:"前几天看了一份鹅场的面试题，算法部分大半是动态规划，最后一题就是写一个计算编辑距离的函数，今天就专门写一篇文章来探讨一下这个问题。我个人很喜欢编辑距离这个问题，因为它看起来十分困难，解法却出奇得简单漂亮，而且它是少有的比较实用的算法（是的，我承认很多算法问题都不太实用)",
                  transSummary:"原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译原文的翻译"
              },
              {     
                  newsId:"2",
                  title:"「每日 1 题」10 月热题来袭！",
                  transTitle:"",
                  writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                  writerName:"Freakx",
                  genre:"科技",
                  viewNum:"233.4k",
                  hasTrans:false,
                  switchTitle:"该文章目前没有翻译",
                  curMode:0,
                  likeNum:23,
                  commentNum:5,
                  transRequestNum:6,
                  summary:"前几天看了一份鹅场的面试题，算法部分大半是动态规划，最后一题就是写一个计算编辑距离的函数，今天就专门写一篇文章来探讨一下这个问题。我个人很喜欢编辑距离这个问题，因为它看起来十分困难，解法却出奇得简单漂亮，而且它是少有的比较实用的算法（是的，我承认很多算法问题都不太实用)",
                  transSummary:""
              },
              {
                  newsId:"3",
                  title:"「每日 1 题」10 月热题来袭！",
                  transTitle:"",
                  writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                  writerName:"Freakx",
                  genre:"科技",
                  viewNum:"233.4k",
                  hasTrans:false,
                  switchTitle:"该文章目前没有翻译",
                  curMode:0,
                  likeNum:23,
                  commentNum:5,
                  transRequestNum:6,
                  summary:"前几天看了一份鹅场的面试题，算法部分大半是动态规划，最后一题就是写一个计算编辑距离的函数，今天就专门写一篇文章来探讨一下这个问题。我个人很喜欢编辑距离这个问题，因为它看起来十分困难，解法却出奇得简单漂亮，而且它是少有的比较实用的算法（是的，我承认很多算法问题都不太实用)",
                  transSummary:""
              },
              {
                  newsId:"4",
                  title:"「每日 1 题」10 月热题来袭！",
                  transTitle:"",
                  writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                  writerName:"Freakx",
                  genre:"科技",
                  viewNum:"233.4k",
                  hasTrans:false,
                  switchTitle:"该文章目前没有翻译",
                  curMode:0,
                  likeNum:23,
                  commentNum:5,
                  transRequestNum:6,
                  summary:"前几天看了一份鹅场的面试题，算法部分大半是动态规划，最后一题就是写一个计算编辑距离的函数，今天就专门写一篇文章来探讨一下这个问题。我个人很喜欢编辑距离这个问题，因为它看起来十分困难，解法却出奇得简单漂亮，而且它是少有的比较实用的算法（是的，我承认很多算法问题都不太实用)",
                  transSummary:""
              },
              {
                  newsId:"5",
                  title:"「每日 1 题」10 月热题来袭！",
                  transTitle:"",
                  writerAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                  writerName:"Freakx",
                  genre:"科技",
                  viewNum:"233.4k",
                  hasTrans:false,
                  switchTitle:"该文章目前没有翻译",
                  curMode:0,
                  likeNum:23,
                  commentNum:5,
                  transRequestNum:6,
                  summary:"前几天看了一份鹅场的面试题，算法部分大半是动态规划，最后一题就是写一个计算编辑距离的函数，今天就专门写一篇文章来探讨一下这个问题。我个人很喜欢编辑距离这个问题，因为它看起来十分困难，解法却出奇得简单漂亮，而且它是少有的比较实用的算法（是的，我承认很多算法问题都不太实用)",
                  transSummary:""
              }
          ],

          newsPageCount:900
      }
  },
  computed:{
      
  },
  components:{
  },
  methods:{
      handleGenreChange:function(id){
          console.log(id);
          if(id!="")this.curGenre = id;
          

      },

      handleModeChange:function(key){

          console.log(key);

      },

      handleNewsClick:function(_newsId){
          this.$router.push({name:'singleNews',params:{newsId:_newsId}});
      },
      handleCurrentPageChange(newPage){
          console.log(newPage);
      }

  }
}

</script>

<style>
#newsMain {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #909399;
}

#newsMain .genreSelect{
    color:#303133;
}

#newsMain .genreWrapper{
    background-color: white;
    height: 70px;
    font-size: 14px;
    border-radius: 10px;
    margin:0px 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction:column;
    justify-content: space-around;

    transition:0.2s;
}

#newsMain .genreWrapper:hover{
    cursor: pointer;
}

#newsMain #modeChangeMenu{
    margin:10px 10px;
}

#newsMain #newsSearchInput{
    border:none;
    border-radius: 0px;
    margin-top:31px;
    padding: 1px 0px;
    font-size: 12px;
    color:#303133;
    border-bottom:1px solid #DDDDDD;
    background-color: #EEEEEE;
}

#newsMain #newsSearchInput:focus{
    border-bottom:1px solid #909399;
}

#newsMain .newsSearchIcon{
    margin-top:45px;
}

 #newsMain .newsSearchIcon:hover{
    cursor: pointer;
}

#newsMain #sortMethod{
    font-size: 12px;
    border:none;
    background-color:#EEEEEE;
    margin-top:33px;
    color:#444444;
    transition: 0.3s;
}

#newsMain .el-row .el-col .el-select .el-input .el-input__suffix .el-input__suffix-inner .el-icon-arrow-up{
    margin-top:16px;
}

#sortMethod:hover{
    color:teal;
}

.allNews{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:10px 10px;
}

.allNews .newsCell{
    border-top:1px solid #EEEEEE;
    margin:0px 10px;
    padding:10px 10px;
    background-color: white;
}

.allNews .newsCell .firstLine{
    margin:10px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.allNews .newsCell .firstLine .left{
    display:flex;
}

.allNews .newsCell .firstLine .left .newsTitle{
    margin-left: 10px;
    font-size:16px;
    font-weight: bold;
    color:black;
    transition: 0.3s;
}

.allNews .newsCell .firstLine .left .newsTitle:hover{
    color:teal;
    cursor: pointer;
}

.allNews .newsCell .secondLine{
    margin:10px 0px;
    display: flex;
    align-items: center;
    width: 30%;
    justify-content: space-between;
    color:black;
    letter-spacing: 0.8px;
}

.allNews .newsCell .secondLine a{
    color:grey;
}

.allNews .newsCell .thirdLine{
    text-align: left;
    color:#444444;
    font-size: 14px;
}

.allNews .newsCell .lastLine{
    margin:10px 0px;
    font-size: 14px;
    color:#444444;
    display: flex;
    width: 40%;
    justify-content: space-between;

}

#newsMain .el-pagination .btn-next{
    background-color: #EEEEEE;
}

#newsMain .el-pagination .btn-prev{
    background-color: #EEEEEE;
}

#newsMain .el-pager li{
    background-color: #EEEEEE;
}
</style>
