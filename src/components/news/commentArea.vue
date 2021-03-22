<template>
  <div id="commentArea">
      <div>
          <div class="commentMain">
              <div class="firstLine">
                <div class="greenIcon"></div>
                <div class="commentTitle">全部评论 <span style="font-weight:500;">{{totalComments}}</span></div>
              </div>
              <div class="mainArea">
                <div 
                class="singleComment"
                v-for="(comment,index) in commentList"
                :key="index"
                >
                  <el-row>
                    <el-col :span="1" class="avatarCol">
                      <el-avatar :size="30" :src="avatar"></el-avatar>
                    </el-col>
                    <el-col :span="23" class="commentCol">
                      <div class="senderName">{{comment.senderName}}</div>
                      <div class="commentTime">{{comment.sendTime}}</div>
                      <div class="commentContent">{{comment.content}}</div>
                    </el-col>
                  </el-row>
                </div>
              </div>
             <el-pagination
              layout="prev, pager, next"
              :total="totalComments"
              @current-change="handleCurrentPageChange"
              ></el-pagination>
          </div>
      </div>

  </div>
</template>

<script>

export default {
  name: 'commentArea',
  data(){
      return {
          newsId:-1,

          curPage:1,

          curRefComment:-1,

          totalComments:30,

          avatar:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          commentList:[
            {
              content:"一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧一般吧",
              floor:2,
              hasRefComment:true,
              id:2,
              sendTime:"2012-22-11 22:44:11",
              senderName:"sdasda",
              senderId:0,
              refComment:{
                content:"??",
                floor:1,
                sendTime:"2020-02-11 22:23:22",
                id:1,
                senderId:0,
                senderName:"stream2000"
              },
            },
          ],

      }
  },
  components:{

  },
  methods:{
    handleCurrentPageChange:function(newPage){
      this.curPage = newPage;
    },
    updateCommentList:function(){
      var commentsUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
      +"/" + this.newsId + this.GLOBAL.apiController.article.comments;

      var params = {
        "pageId":this.curPage,
        "pageSize":10
      }
      this.$axios.get(
        commentsUrl,{
          params
        }
      ).then(
        res => {
          console.log(res);
       }
      ).catch(
        error => {
          console.log(error);
          this.$message({
            message:"更新评论区失败",
            type:"warning"
          });
        }
      );
    }
  },
  // watch:{
  //   $route(to,from){

  //   }
  // },
  created:function(){
    this.newsId = this.$route.params.newsId;
    this.updateCommentList();
  },
}

</script>

<style scoped>
#commentArea .commentMain{
  margin-left: 10px;
  margin-right:10px;
  margin-bottom: 20px;
  padding: 20px;
  color:black;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#commentArea .firstLine{
  padding-top:10px;
  display: flex;
  flex-direction: row;
  align-content: left;
  width: 100%;
}

#commentArea .greenIcon{
  width: 5px;
  height: 23px;
  background-color: teal;
}

#commentArea .commentTitle{
  margin-left: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}

#commentArea .mainArea{
  margin-top:20px;
}

#commentArea .singleComment{
  width: 100%;
}

#commentArea .singleComment .avatarCol{
  display: flex;
  align-content: left;
}

#commentArea .singleComment .commentCol{
  display: flex;
  flex-direction: column;
  align-content: left;
}

#commentArea .singleComment .commentCol .senderName{
  font-size: 15px;
  font-weight: bold;
  color:black;
  width: 100%;
  text-align: left;
}

#commentArea .singleComment .commentCol .commentTime{
  width: 100%;
  text-align: left;
  font-size: 10px;
  color:rgb(150,150,150);
}

#commentArea .singleComment .commentCol .commentContent{
  width: 100%;
  text-align: left;
  font-size: 15px;
  margin-top:10px;
  color:rgb(80,80,80);
}
</style>