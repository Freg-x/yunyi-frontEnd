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
                      <div class="avatarWrapper">
                        <el-avatar :size="30" :src="avatar"></el-avatar>
                      </div>
                      <div class="floor">{{comment.floor}}楼</div>
                    </el-col>
                    <el-col :span="23" class="commentCol">

                     <div class="senderName">{{comment.senderName}}</div>
                      <div class="commentTime">{{comment.sendTime}}</div>

                      <div class="refComment" v-if="comment.hasRefComment">
                        @{{comment.refComment.senderName}}({{comment.refComment.floor}}楼):{{comment.refComment.content}}
                      </div>
                      <div class="commentContent">{{comment.content}}</div>
                      <el-button 
                      class="reply"
                      type="text"
                      @click="handleCommentReply(comment.id)"
                      icon="el-icon-s-comment"
                      >
                        回复
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>



              <div class="addCommentArea">
                <el-row>
                  <el-col :span="1">
                      <div class="avatarWrapper">
                        <el-avatar :size="30" :src="avatar"></el-avatar>
                      </div>
                      <div class="floor">{{curFloor}}楼</div> 
                  </el-col>
                  <el-col :span="23" class="textareaOuter">
                    <div class="refComment" v-if="replyingComment" @click="replyingComment=null" title="点击取消回复">
                      @{{replyingComment.senderName}}({{replyingComment.floor}}楼):{{replyingComment.content}}
                    </div>

                    <el-input
                    type="textarea"
                    class="commentInput"
                    :autosize="{minRows:3}"
                    :placeholder="addCommentPlaceHolder"
                    :disabled="!logging"
                    v-model="addCommentContent"
                    ></el-input>

                    <el-button
                    class="addCommentButton"
                    icon="el-icon-s-comment"
                    :disabled="!logging"
                    @click="handleAddComment"
                    >
                      发表你的评论
                    </el-button>
                  </el-col>
                </el-row>
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
          logging:false,

          curPage:1,

          totalComments:0,

          avatar:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          commentList:[
          ],

          replyingComment:null,
          
          addCommentContent:""
      }
  },
  computed:{
    curFloor:function(){
      return this.totalComments + 1;
    },
    addCommentPlaceHolder:function(){
      if(!this.logging){
        return "登录后才可以发表评论哦"
      }
      else if(this.totalComments == 0){
        return "还没有评论，快来抢占沙发吧！"
      }
      else{
        return "对这篇新闻发表一下看法吧！"
      }
    }
  },
  watch:{
    $route(to){
      this.curPage = 1;
      this.replyingComment = null;
      this.newsId = to.params.newsId;
      this.updateCommentList();
    }
  },
  methods:{
    handleCurrentPageChange:function(newPage){
      this.curPage = newPage;
      this.updateCommentList();
    },
    handleCommentReply:function(id){
      for(let refComment of this.commentList){
        if(refComment.id == id){
          this.replyingComment = refComment;
          break;
        }
      }
    },
    handleAddComment:function(){
      var token = this.GLOBAL.getCookie("jwt");
      if(token){
        var data = {
          "articleId":this.newsId,
          "content":this.addCommentContent,
          "hasRefComment":false
        };
        if(this.replyingComment){
          data.hasRefComment = true;
          data.refCommentId = this.replyingComment.id;
        }

        var addCommentUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
        + this.GLOBAL.apiController.article.comment.prefix + this.GLOBAL.apiController.article.comment.add;

        this.$axios.post(addCommentUrl, data, {
          params:{
            token:token
          }
        }).then(
          res => {
            if(res.data.code == 200){
              this.$message({
                message:"回复成功！",
                type:"success"
              });
            }
            this.addCommentContent = "";
            this.replyingComment = null;
            this.updateCommentList();
          }
        ).catch(
          error => {
            console.log(error);
          }
        );
      }else{
        this.$message({
          message:"评论失败，登录过期",
          type:"warning"
        });
      }
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
          this.commentList = [];
          this.totalComments = res.data.result.commentCount;
          if(this.totalComments > 0){
            for(let i = 0; i < res.data.result.comments.length; i++){
              var newComment = {};
              var resComment = res.data.result.comments[i];

              newComment.content = resComment.content;
              newComment.floor = resComment.floor;
              newComment.hasRefComment = resComment.hasRefComment;
              newComment.id = resComment.id;
              newComment.sendTime = this.GLOBAL.seconds2String(resComment.sendTime);
              newComment.senderName = resComment.senderName;
              newComment.senderId = resComment.sender_id;
              if(newComment.hasRefComment){
                newComment.refComment = {};
                newComment.refComment.content = resComment.refComment.content;
                newComment.refComment.floor = resComment.refComment.floor;
                newComment.refComment.sendTime = this.GLOBAL.seconds2String(resComment.refComment.sendTime);
                newComment.refComment.id = resComment.refComment.id;
                newComment.refComment.senderId = resComment.refComment.senderId;
                newComment.refComment.senderName = resComment.refComment.senderName;
              }
              this.commentList.push(newComment);
            }
          }
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
    this.curPage = 1;
    this.replyingComment = null;
    this.newsId = this.$route.params.newsId;
    this.logging = this.GLOBAL.getCookie("jwt");
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
  flex-direction:column;
  align-content: left;
}

#commentArea .singleComment .floor{
  width: 100%;
  margin-top:5px;
  color:rgb(50,50,50);
  text-align: center;
}

#commentArea .singleComment .commentCol{
  display: flex;
  flex-direction: column;
  align-content: left;
}

#commentArea .singleComment .avatarWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
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

.refComment{
  margin-top:10px;
  text-align: left;
  font-size: 15px;
  background-color:rgb(220, 226, 226);
  border:1px solid rgb(230,230,230);
  border-radius:10px;
  opacity: 0.5;
  color:black;
  padding:10px;
  transition: 0.5s;
}

.refComment:hover{
  opacity: 0.3;
  cursor: pointer;
}


#commentArea .singleComment .commentCol .commentContent{
  width: 100%;
  text-align: left;
  font-size: 15px;
  margin-top:10px;
  color:rgb(80,80,80);
}

#commentArea .singleComment .commentCol .reply{
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(230,230,230);
  text-align: right;
  margin-bottom:20px;
}

#commentArea .addCommentArea .commentInput{
  margin-top:10px;
}

#commentArea .textareaOuter >>> .el-textarea__inner{
  resize: none;
  font-size: 15px;
  padding:10px;
}
#commentArea .addCommentButton{
  margin-top:10px;
  float: right;
  transition: 0.5s;
}

</style>