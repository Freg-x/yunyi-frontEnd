<template>
  <div id="singleTrans">
      <el-row type="flex">
        <el-col :span="8" class="topArea" id="top">
            <div class>
                <div class="titleText" @click="handleTransSelected">
                    {{newsInfo.title}}
                </div>
                <div class="secondLine">
                    <el-row>
                        <el-col :span="3" >
                            <el-avatar :src="newsInfo.avatar"></el-avatar>
                        </el-col>
                        <el-col :span="12" style="text-align:left;">
                            <span class="uploaderName">{{newsInfo.newsUploaderName}}</span>
                            <br>
                            <span class="uploadTime">上传于 {{newsInfo.newsTime}}</span>
                        </el-col>
                        <el-col :span="9">
                        </el-col>
                    </el-row>
                </div>

            </div>
        </el-col>
        <el-col :span="8" class="topArea">
            <div>
                <div class="titleText" @click="handleTransSelected">
                    {{newsInfo.transTitle}}
                </div>
                <div class="secondLine">
                    <el-row>
                        <el-col :span="3" >
                            <el-avatar :src="newsInfo.avatar"></el-avatar>
                        </el-col>
                        <el-col :span="12" style="text-align:left;">
                            <span class="uploaderName">{{newsInfo.transUploaderName}}</span>
                            <br>
                            <span class="uploadTime">上传于 {{newsInfo.transTime}}</span>
                        </el-col>
                        <el-col :span="9">
                            <br>
                            <el-switch
                            v-model="transSegMode"
                            active-text="审阅模式"
                            inactive-text="浏览模式"
                            ></el-switch>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-col>
        <el-col :span="8" class="topArea">
            <div class="likeTitle">
                <div>
                    将
                    <b> 
                    {{
                        curSelTrans == -1?
                        segString(newsInfo.title):
                        segString(concatString(segInfo[curSelTrans].originText))
                    }}
                    </b>
                </div>
                 <div>
                    译作
                    <b> 
                    {{
                        curSelTrans == -1?
                        segString(newsInfo.transTitle):
                        segString(segInfo[curSelTrans].transContent)
                    }}
                    </b>
                </div>
            </div>
            <div :class="{likeArea:true, gold:liked}" @click="handleLike">
                <div>
                    <i class="el-icon-sunny"></i>
                    {{transLikeNum}} 人觉得{{curSelTrans==-1?"这篇文章":"这句话"}}翻译的很棒
                </div>
            </div>

        </el-col>
      </el-row>
      <!-- 下半部分 -->
      <el-row>
          <el-col :span="16" class="transArea">
              <div class="verticalLine"></div>
              <div v-if="transSegMode" :style="commentHeight" class="segWrapper">
                <div 
                class="singleSegLine"
                v-for="(seg, index) in segInfo"
                :key="index"
                @click="handleSegSelected(index)"
                >   
                    <div class="connectLine" v-if="curSelTrans == index"></div>
                    <div :class="{segBlock:true, blackBorder:curSelTrans == index}">
                        <div>
                            <span
                            v-for="(text,textIndex) in seg.originText"
                            :key="textIndex"
                            :class="textClass(index, textIndex)"
                            >
                            {{text}}
                            </span>
                        </div>
                     </div>
                    <div :class="{segBlock:true, blackBorder:curSelTrans == index}">
                        <div>
                            {{seg.transContent}}
                        </div>
                    </div>
                </div>
              </div>
              <div class="articleWrapper" v-else :style="commentHeight">
                  <div class="articleMode">
                     {{originArticle}}
                  </div>
                  <div class="articleMode">
                     {{transArticle}}
                  </div>
              </div>
          </el-col>


          <!-- 评论区 -->
          <el-col :span="8" class="commentArea">
              <div class="commentWrapper" :style="commentHeight">
                <div class="firstLine">
                    <div class="greenIcon"></div>
                    <div class="commentTitle">全部评论 <span style="font-weigth:500">{{totalComments}}</span></div>
                </div>

                <div class="mainArea">
                    <div 
                    class="singleComment"
                    v-for="(comment,index) in commentList"
                    :key="index"
                    >
                        <el-row>
                            <el-col :span="3" class="avatarCol">
                            <div class="avatarWrapper">
                                <el-avatar :size="30" :src="newsInfo.avatar"></el-avatar>
                            </div>
                            <div class="floor">{{comment.floor}}楼</div>
                            </el-col>
                            <el-col :span="21" class="commentCol">

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
                            :disabled="curSelTrans != -1"
                            >
                                回复
                            </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                
                <el-row>
                    <el-col :span="3">
                       <div class="avatarWrapper">
                        <el-avatar :size="30" :src="newsInfo.avatar"></el-avatar>
                        <div class="floor">{{totalComments+1}}楼</div>
                      </div>
                    </el-col>
                    <el-col :span="21">
                        <div class="refComment" v-if="replyingComment" @click="replyingComment=null" title="点击取消回复">
                            @{{replyingComment.senderName}}({{replyingComment.floor}}楼):{{replyingComment.content}}
                        </div>
                        <el-input
                        type="textarea"
                        v-model="commentMsg"
                        :autosize="{minRows:4}"
                        id="commentInput"
                        :placeholder="commentPlaceHolder"
                        >
                        </el-input>
                        <el-button @click="handleCommentSubmit" icon="el-icon-s-comment">
                            发表你的评论
                        </el-button>
                    </el-col>
                </el-row>

                <el-pagination
                layout="prev, pager, next"
                :total="totalComments"
                @current-change="handleCurrentPageChange"
                ></el-pagination>
              </div>
          </el-col>
      </el-row>
  </div>
</template>

<script>

export default {
  name: 'singleTrans',
  data(){
      return {
          transId : -1,
          transSegMode:false,
          curSelTrans:-1,
          curPage:1,

          transLikeNum:0,
          liked:false,

          newsInfo:{
              title:"",
              transTitle:"",
              newsUploaderName:"",
              transUploaderName:"",
              newsTime:"",
              transTime:"",
              avatar:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          },
          segInfo:[
          ],
          commentHeight:{
              height:""
          },
          totalComments:0,
          commentList:[],
          commentMsg:"",
          replyingComment:null,
          logging:true
      }
  },
  computed:{
      originArticle:function(){
          var res = "";
          for(let seg of this.segInfo){
              for(let text of seg.originText){
                  res += text;
              }
          }
          return res;
      },
      transArticle:function(){
          var res = "";
          for(let seg of this.segInfo){
              res += seg.transContent;
          }
          return res;
      },
      commentPlaceHolder:function(){
          if(this.totalComments == 0)return "还没有人评论，快来抢占沙发吧！"
          else if(this.curSelTrans == -1)return "这篇翻译怎么样？评论交流一下吧！"
          else return "这句翻译的怎么样？评论交流一下吧！"
      }
  },
  watch:{
      $route(){
          this.initPage();
      }
  },
  methods:{
      textClass:function(index, textIndex){
          return{
              transition: true,
              red: (textIndex+index)%7 == 0 && this.curSelTrans == index,
              orange:(textIndex+index)%7 == 1 && this.curSelTrans == index,
              yellow:(textIndex+index)%7 == 2 && this.curSelTrans == index,
              green:(textIndex+index)%7 == 3 && this.curSelTrans == index,
              teal:(textIndex+index)%7 == 4 && this.curSelTrans == index,
              blue:(textIndex+index)%7 == 5 && this.curSelTrans == index,
              purple:(textIndex+index)%7 == 6 && this.curSelTrans == index,
          }
      },
      initPage:function(){

          this.transId = this.$route.params.transId;    
          this.transSegMode = false;
          this.curSelTrans = -1;
          this.curPage = 1;
          this.segInfo = [];
          this.totalComments = 0;
          this.commentList = [];
          this.commentMsg = "";
          this.replyingComment = null;
          if(this.GLOBAL.getCookie("jwt")){
              this.logging = true;
          }
          else{
              this.logging = false;
          }

          var detailInfoUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + "/" + this.transId +this.GLOBAL.apiController.translation.detail.prefix;
          this.$axios.get(
              detailInfoUrl
          ).then(
              res => {
                  this.processDetailInfo(res.data.result);
                  this.updateLikeInfo();
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );

          this.updateTransComment(this.curPage);
      },
      processDetailInfo:function(res){
        //init newsInfo
        this.newsInfo.title = res.article.title;
        this.newsInfo.newsUploaderName = res.article.name;
        this.newsInfo.newsTime = this.GLOBAL.seconds2String(res.article.createTime);
        this.newsInfo.transTitle = res.trans.transTitle;
        this.newsInfo.transTime = this.GLOBAL.seconds2String(res.trans.transTime);
        this.newsInfo.transUploaderName = res.trans.uploaderName;
        this.transLikeNum = res.trans.likeNum;

        //init segInfo
        for(let seg of res.translations){
            var newSeg = {
                originText:[],
                transContent:seg.trans.content,
                transId:seg.trans.id
            }
            for(let origin of seg.segments){
                newSeg.originText.push(origin.content);
            }
            this.segInfo.push(newSeg);
        }
      },
      segString:function(str){
          if(str.length > 25){
              return str.slice(0,25) + "...";
          }
          else return str;
      },
      concatString:function(arr){
          var res = ""
          for(let str of arr){
              res += str;
          }
          return res;
      },
      updateCommentHeight:function(){
        this.commentHeight.height = window.innerHeight - document.getElementById("top").offsetHeight 
        - 90 + "px";
      },
      updateTransComment:function(pageId){
          var transCommentUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + '/' + this.transId + this.GLOBAL.apiController.translation.comments;

          var params = {
              "pageId": pageId,
              "pageSize": 10,
          };

          this.$axios.get(
              transCommentUrl,{params}
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
              }
          );
      },
      handleCommentReply:function(id){
        for(let refComment of this.commentList){
        if(refComment.id == id){
          this.replyingComment = refComment;
          break;
            }
        }
      },
      updateSegComment:function(pageId, segId){
          var segCommentUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + this.GLOBAL.apiController.translation.detail.prefix + "/" + segId + this.GLOBAL.apiController.translation.detail.comments;

          var params = {
              "pageId": pageId,
              "pageSize": 10
          };

          this.$axios.get(
              segCommentUrl, {params}
          ).then(
              res => {
                  this.commentList = [];
                  this.totalComments = res.data.result.commentCount;
                  for(let resComment of res.data.result.comments){
                    var newComment = {};

                    newComment.content = resComment.content;
                    newComment.floor = resComment.floor;
                    newComment.hasRefComment = null;
                    newComment.id = resComment.id;
                    newComment.sendTime = this.GLOBAL.seconds2String(resComment.sendTime);
                    newComment.senderName = resComment.senderName;
                    newComment.senderId = resComment.sender_id;

                    this.commentList.push(newComment)
                  }
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );
      },
      handleCommentSubmit:function(){
          if(this.commentMsg == ""){
              this.$message({
                  message:"评论不能为空！",
                  type:"warning"
              });
              return;
          }
          var token = this.GLOBAL.getCookie("jwt");
          if(token){
              if(this.curSelTrans == -1)this.addTransComment(token);
              else this.addSegComment(token, this.segInfo[this.curSelTrans].transId);
          }
          else{
              this.$message({
                  message:"登录过期！",
                  type:"warning"
              });
          }
      },
      addTransComment:function(token){
        var addTransUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
        + this.GLOBAL.apiController.translation.comment.prefix + this.GLOBAL.apiController.translation.comment.add;

        var data = {
            "content":this.commentMsg,
            "hasRefComment":false,
            "transId":this.transId
        };
        if(this.replyingComment){
            data.hasRefComment = true;
            data.refCommentId = this.replyingComment.id;
        }

        this.$axios.post(addTransUrl, data,{
            params:{
                token:token
            }
        }).then(
            res => {
                if(res.data.code == 200){
                    this.$message({
                        message:"评论成功！",
                        type:"success"
                    });
                }
                this.commentMsg = "";
                this.replyingComment = null;
                this.updateTransComment(this.curPage);
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
      },
      addSegComment:function(token, segId){
          var addSegUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + this.GLOBAL.apiController.translation.detail.prefix + this.GLOBAL.apiController.translation.detail.add_comment;

          var data = {
              "content":this.commentMsg,
              "transSegId":segId
          };
          this.$axios.post(addSegUrl, data, {
              params:{
                  token:token
              }
          }).then(
              res => {
                  if(res.data.code == 200){
                      this.$message({
                          message:"评论成功！",
                          type:"success"
                      });
                  }
                  this.commentMsg = "";
                  this.replyingComment = null;
                  this.updateSegComment(this.curPage, segId);
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );
      },
      updateLikeInfo:function(){
          this.transLikeNum = 0;
          this.liked = false;

          var token = this.GLOBAL.getCookie("jwt");
          if(this.curSelTrans == -1){
              var statUrl = this.GLOBAL.requestURL + "/trans/" + this.transId + "/stats";
              this.$axios.get(statUrl,{
                  params:{
                      token:token
                  }
              }).then(
                  res => {
                      this.transLikeNum = res.data.result.likeNum;
                      this.liked = res.data.result.like;
                  }
              ).catch(
                  error => {
                      console.log(error);
                  }
              );
          }
          else{
            var segStatUrl = this.GLOBAL.requestURL + "/trans/seg/" + this.segInfo[this.curSelTrans].transId + "/stats";
            this.$axios.get(segStatUrl,{
                params:{
                    token:token
                }
            }).then(
                res => {
                    this.transLikeNum = res.data.result.likeNum;
                    this.liked = res.data.result.like;
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );            
          }
      },
      handleLike:function(){

          var token = this.GLOBAL.getCookie("jwt");

          if(!token){
              this.$message({
                  message:"请登录后进行操作",
                  type:"warning"
              });
              return;
          }
          if(this.curSelTrans == -1)this.handleTransLike(token);
          else this.handleSegLike(token, this.segInfo[this.curSelTrans].transId);
      },
      handleTransLike:function(token){
          var likeSuffix;
          if(this.liked){
            likeSuffix = this.GLOBAL.apiController.translation.cancel_like;
          }
          else{
            likeSuffix = this.GLOBAL.apiController.translation.like;
          }
          var likeUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + "/" + this.transId + likeSuffix;
          var data = {
              "transId": this.transId
          }

          this.$axios.post(likeUrl,data,{
              params:{
                  token:token
              }
          }).then(
              res => {
                  if(res.data.code == 200)this.updateLikeInfo();
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );
      },
      handleSegLike:function(token, segId){
          var likeSuffix;
          if(this.liked){
              likeSuffix = this.GLOBAL.apiController.translation.cancel_like;
          }
          else{
              likeSuffix = this.GLOBAL.apiController.translation.like;
          }
          var likeUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + this.GLOBAL.apiController.translation.detail.prefix + "/" + segId + likeSuffix;
          var data = {
              "transSegId": segId
          };

          this.$axios.post(likeUrl,data,{
              params:{
                  token:token
              }
          }).then(
              res => {
                  if(res.data.code == 200)this.updateLikeInfo();
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );

      },
      handleCurrentPageChange:function(newPage){
          this.curPage = newPage;
          //全部文章的翻译
          if(this.curSelTrans == -1)this.updateTransComment(newPage);
          else this.updateSegComment(newPage, this.curSelTrans);
      },
      handleSegSelected:function(index){
          this.curSelTrans = index;
          this.curPage = 1;
          this.replyingComment = null;
          this.commentMsg = "";
          this.updateSegComment(1, this.segInfo[index].transId);
          this.updateLikeInfo();
      },
      handleTransSelected:function(){
          this.curSelTrans = -1;
          this.curPage = 1;
          this.replyingComment= null;
          this.commentMsg = "";
          this.updateTransComment(1);
          this.updateLikeInfo();
      }
  },
  created:function(){
    window.addEventListener("resize", this.updateCommentHeight);
    this.initPage();  
  },
  mounted:function() {
    setTimeout(this.updateCommentHeight, 100);
    setTimeout(this.updateCommentHeight, 500);
  },
}

</script>

<style scoped>
#singleTrans {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#singleTrans .topArea{    
    border-bottom: 1px solid rgb(230, 230, 230);
    border-right: 1px solid rgb(230, 230, 230);
    border-top: 1px solid rgb(230, 230, 230);
    padding: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#singleTrans .titleText{
    margin-left: 15px;
    margin-bottom: 10px;
    text-align:left;
    font-weight: bold;
    color:black;
    font-size: 20px;
    transition: 0.5s;
}

#singleTrans .titleText:hover{
    cursor: pointer;
    color: teal;
}

#singleTrans .likeTitle{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 10px;
    height: 60%;
    font-size: 16px;
    color:black;
}

#singleTrans .likeArea{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
    font-size: 16px;
    justify-content: center;
    height: 40%;
    transition: 0.5s;
}

#singleTrans .likeArea:hover{
    cursor: pointer;
    color: gold;
}

#singleTrans .segWrapper{
    padding-bottom: 20px;
    overflow:scroll; 
    display: flex;
    flex-direction: column;
}

#singleTrans .segWrapper .singleSegLine{
    position: relative;
    display: flex;
    justify-content: space-around;
    transition: 0.5s;
}

#singleTrans .segWrapper .singleSegLine:hover{
    cursor: pointer;
    background-color: rgb(230,230,230);
}

#singleTrans .segWrapper .singleSegLine .connectLine{
    position:absolute;
    top:50%;
    left: 20%;
    width: 60%;
    height: 1px;
    background-color: black;
    z-index:1;
}

#singleTrans .segWrapper .singleSegLine .segBlock{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 2;
    margin:10px 0px;
    border:1px solid rgb(230,230,230);
    color:black;
    border-radius: 10px;
    padding:10px;
    font-size: 16px;
    width: 40%;
    background-color: white;
    z-index: 10;
}

.blackBorder{
    border: 1px solid black!important;
}

.uploaderName{
    font-size: 16px;
    color:black;
}

.uploadTime{
    font-size: 12px;
    color:rgb(150, 150, 150);
}

#singleTrans .transArea{
  position: relative;
  background-color: white;  
}

#singleTrans .transArea .verticalLine{
  position: absolute;
  background-color: rgb(230, 230, 230);
  left:50%;
  width: 1px;
  height: 100%;
}

#singleTrans .transArea .articleWrapper{
    display: flex;
    flex-direction: row;
}

#singleTrans .transArea .articleWrapper .articleMode{
    font-size: 16px;
    padding: 15px;
    line-height: 2;
    white-space: pre-line;
    text-align: left;
    width: 50%;
    color:black;
    overflow:scroll;
}

#singleTrans .commentArea{
    border-left: 1px solid rgb(230, 230, 230);
    position: relative;
    background-color: white;
}

#singleTrans .commentArea .commentWrapper{
    padding:10px;
    padding-bottom: 5px;
    overflow: scroll;
}

#singleTrans .commentArea .commentWrapper .firstLine{
  padding-top:10px;
  display: flex;
  flex-direction: row;
  align-content: left;
  width: 100%;
}

.commentArea .greenIcon{
  width: 5px;
  height: 23px;
  background-color: teal;
}

.commentArea .commentTitle{
  margin-left: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}

.commentArea .mainArea{
  margin-top:20px;
}

.commentArea .singleComment{
  width: 100%;
}

.commentArea .singleComment .avatarCol{
  display: flex;
  flex-direction:column;
  align-content: left;
}

.commentArea .singleComment .floor{
  width: 100%;
  margin-top:5px;
  color:rgb(50,50,50);
  text-align: center;
}

.commentArea .singleComment .commentCol{
  display: flex;
  flex-direction: column;
  align-content: left;
}

.commentArea .singleComment .avatarWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

.commentArea .singleComment .commentCol .senderName{
  font-size: 15px;
  font-weight: bold;
  color:black;
  width: 100%;
  text-align: left;
}

.commentArea .singleComment .commentCol .commentTime{
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

.commentArea .singleComment .commentCol .commentContent{
  width: 100%;
  text-align: left;
  font-size: 15px;
  margin-top:10px;
  color:rgb(80,80,80);
}

.commentArea .singleComment .commentCol .reply{
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(230,230,230);
  text-align: right;
  margin-bottom:20px;
}

#singleTrans .commentArea >>> .el-textarea__inner{
    margin-top:5px;
    width: 100%;
    resize: none;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#singleTrans .commentArea .el-button{
    border-top:none;
    transition: 0.5s;
    width: 100%;
}

.red{
    color:#e84e40;
}

.orange{
    color:#ef6c00;
}

.yellow{
    color:#ffb300;
}

.green{
    color:#9ccc65;
}

.teal{
    color: #26a96a;
}

.blue{
    color: #29b6f6;
}

.purple{
    color: #7e57c2;
}

.gold{
    color:gold;
}

.transition{
    transition: 0.5s;
}
</style>