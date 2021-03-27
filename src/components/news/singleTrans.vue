<template>
  <div id="singleTrans">
      <el-row type="flex">
        <el-col :span="8" class="topArea" id="top">
            <div class>
                <div class="titleText" >
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
                <div class="titleText" >
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
            <div>
                test3
            </div>
        </el-col>
      </el-row>
      <!-- 下半部分 -->
      <el-row>
          <el-col :span="16" :style="commentHeight" class="transArea">
              <div class="verticalLine"></div>
              <div v-if="transSegMode">
                  seg
              </div>
              <div v-else>
                  article
              </div>
          </el-col>
          <!-- 评论区 -->
          <el-col :span="8" class="commentArea" :style="commentHeight">
              <el-input
              type="textarea"
              v-model="commentMsg"
              :autosize="{minRows:4}"
              id="commentInput"
              >
              </el-input>
              <el-button @click="handleCommentSubmit">
                  发表你的评论
              </el-button>
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
          commentMsg:"",
      }
  },
  computed:{
  },
  watch:{
      $route(){
          this.initPage();
      }
  },
  methods:{
      initPage:function(){

          this.transId = this.$route.params.transId;     
          var detailInfoUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + "/" + this.transId +this.GLOBAL.apiController.translation.detail.prefix;
          this.$axios.get(
              detailInfoUrl
          ).then(
              res => {
                  this.processDetailInfo(res.data.result);
              }
          ).catch(
              error => {
                  console.log(error);
              }
          );
      },
      processDetailInfo:function(res){
        console.log(res);
        this.newsInfo.title = res.article.title;
        this.newsInfo.newsUploaderName = res.article.name;
        this.newsInfo.newsTime = this.GLOBAL.seconds2String(res.article.createTime);
        this.newsInfo.transTitle = res.trans.transTitle;
        this.newsInfo.transTime = this.GLOBAL.seconds2String(res.trans.transTime);
        this.newsInfo.transUploaderName = res.trans.uploaderName;
      },
      updateCommentHeight:function(){
        this.commentHeight.height = window.innerHeight - document.getElementById("top").offsetHeight 
        - 95 + "px";
        console.log(this.commentHeight.height);
      },
      handleCommentSubmit:function(){

      }
  },
  created:function(){
    window.addEventListener("resize", this.updateCommentHeight);
    this.initPage();  
  },
  mounted:function() {
    setTimeout(this.updateCommentHeight, 100);
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
#singleTrans .commentArea{
    border-left: 1px solid rgb(230, 230, 230);
    position: relative;
    background-color: white;
}

#singleTrans .commentArea >>> .el-textarea__inner{
    border-left: none;
    width: 100%;
    resize: none;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    border-radius: 0px;
}

#singleTrans .commentArea .el-button{
    border-top:none;
    border-left: none;
    transition: 0.5s;
    width: 100%;
    border-radius: 0px;
}
</style>