<template>
  <div id="transUploader" :style="defaultHeight">
    <el-row>
      <el-col :span="4">
        <div class="leftInfo">
          <div class="infoTitle">使用说明</div>
          <div class="infoLine">* 本页面允许您根据实际翻译需求对上传者的原始文章切分进行自由合并和重组</div>
          <div class="infoLine">* 当前待合并语句：{{curClickedIndex == -1?"暂无":curClickedIndex+1}}</div>
          <div class="infoLine">* 在所有切分完成翻译后方可提交，请认真对待您的翻译，保证翻译质量</div>
          <div class="infoLine">* 点击下方按钮可以切换显示模式(用于检查换行等格式)</div>
          <el-switch 
          v-model="articleView" 
          active-text="阅读模式" 
          inactive-text="切分模式"
          ></el-switch>
          <div class="submitBottom">
              <el-button
              @click="handleTransSubmit"
              >提交翻译</el-button>
          </div>

        </div>
      </el-col>
      <el-col :span="20" class="rightContent">
        <div class="titleWrapper">
          <!-- 原文标题竟然也是一个input，节省排版时间 -->
          <el-input
          v-model="newsInfo.title"
          disabled
          >
            <template slot="prepend">原文标题</template>
          </el-input>
          <el-input
          v-model="newsInfo.transTitle"
          >
            <template slot="prepend">翻译标题</template>
          </el-input>
        </div>
        <div class="mainArea" :style="defaultHeight">
          <!-- 不分栏的分割线 -->
          <div class="verticalLine"></div>

          <!-- 文章模式 -->
          <div v-if="articleView" class="articleMain">
              <div class="articleMode">
                <div class="innerArticle">{{originArticle}}</div>
              </div>
              <div class="articleMode">
                <div class="innerArticle">{{transArticle}}</div>
              </div>
          </div>
          <!-- 切分模式 -->
          <div v-else class="segMain">
            <div 
            class="singleSegLine"
            v-for="(seg,index) in newsInfo.segInfo"
            :key="index"
            >
              <div class="segArticle">
                <div class="articleMargin" @click="handleSegClicked(index)" :id="addSegId(index)">
                  <div class="articleBlock"><div>{{concatId(seg.Id)}}</div></div>
                  <div class="articleBlock"><div class="articleContent">{{concatContent(seg.newsContent)}}</div></div>
                </div>
              </div>
              <div class="segTrans">
                <div class="segTransItem">
                  <div class="transIndex" @click="handleSepTrans(index)">
                    {{isMultiElement(seg.Id)?"[已合并，点击拆分] ":""}} 第 {{concatId(seg.Id)}} 条切分的翻译
                  </div>
                  <el-input
                  v-model="seg.transContent"
                  class="singleInput"
                  type="textarea"
                  :autosize="{minRows: 1}"
                  ></el-input>
                </div>
              </div>

            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'transUploader',
  data(){
      return {
        newsId:-1,

        //0代表分割展示模式，1代表文本展示模式
        articleView:false,
        curClickedIndex:-1,

        newsInfo:{
          title:"",
          transTitle:"",
          segInfo:[
          ]
        },

        defaultHeight:{
          height:"",
        }
      }
  },
  computed:{
    originArticle:function(){
      var returnValue = "";
      for(let seg of this.newsInfo.segInfo){
        for(let news of seg.newsContent){
          returnValue += news;
        }
      }
      return returnValue;
    },
    transArticle:function(){
      var returnValue = "";
      for(let seg of this.newsInfo.segInfo){
        returnValue += seg.transContent;
      }
      return returnValue;
    }
  },
  methods:{
    isMultiElement:function(arr){
      return arr.length != 1;
    },
    concatId:function(arr){
      var returnValue = "";
      for(let Id of arr){
        returnValue += Id+",";
      }
      //去掉一个多余的逗号
      return returnValue.slice(0, -1);
    },
    concatContent:function(arr){
      var returnValue = "";
      for(let el of arr){
        returnValue += el;
      }
      return returnValue;
    },
    addSegId:function(index){
      return "seg"+index;
    },
    getHeight:function(){
      this.defaultHeight.height = window.innerHeight - 95 + "px";
    },

    handleSegClicked:function(index){

      var seg = document.getElementById("seg"+index);
      if(this.curClickedIndex == -1){
        seg.classList.add("fullOpacity");
        this.curClickedIndex = index;
      }else if(this.curClickedIndex == index){
        seg.classList.remove("fullOpacity");
        this.curClickedIndex = -1;
      }else{
        //合并
       let bigIndex = index > this.curClickedIndex?index:this.curClickedIndex;
       let smallIndex = index > this.curClickedIndex?this.curClickedIndex:index;
       var newSegInfo = [];
       var newSeg = {
         innerId:[],
         Id:[],
         newsContent:[],
         transContent:""
       };

       for(let i = 0;i < this.newsInfo.segInfo.length;i++){
         if(i < smallIndex || i > bigIndex){
           newSegInfo.push(this.newsInfo.segInfo[i]);
         }
         else if(i == bigIndex){
          newSeg.innerId = newSeg.innerId.concat(this.newsInfo.segInfo[i].innerId);
          newSeg.Id = newSeg.Id.concat(this.newsInfo.segInfo[i].Id);
          newSeg.newsContent = newSeg.newsContent.concat(this.newsInfo.segInfo[i].newsContent);
          newSeg.transContent += this.newsInfo.segInfo[i].transContent;
          newSegInfo.push(newSeg);
         }else{
          newSeg.innerId = newSeg.innerId.concat(this.newsInfo.segInfo[i].innerId);
          newSeg.Id = newSeg.Id.concat(this.newsInfo.segInfo[i].Id);
          newSeg.newsContent = newSeg.newsContent.concat(this.newsInfo.segInfo[i].newsContent);
          newSeg.transContent += this.newsInfo.segInfo[i].transContent;
         }
       }

       this.newsInfo.segInfo = newSegInfo;
       this.curClickedIndex = -1;
       var segs = document.getElementsByClassName("articleMargin");
       for(let seg of segs){
         seg.classList.remove("fullOpacity");
       }
      }
    },
    handleSepTrans:function(index){
      var segInfo = this.newsInfo.segInfo;
      if(segInfo[index].Id.length == 1)return;

      var newSegInfo = [];
      for(let i = 0; i < segInfo.length;i++){
        if(i != index){
          newSegInfo.push(segInfo[i]);
        }
        else{
          for(var j = 0; j < segInfo[index].Id.length;j++){
            var newSeg = {
              innerId:[segInfo[index].innerId[j]],
              Id:[segInfo[index].Id[j]],
              newsContent:[segInfo[index].newsContent[j]],
              transContent:"",
            }
            newSegInfo.push(newSeg);
          }
        }
      }
      this.newsInfo.segInfo = newSegInfo;
    },
    initPage:function(){
      window.addEventListener("resize", this.getHeight);
      this.getHeight();

      this.newsInfo.title = "";
      this.newsInfo.transTitle="";
      this.newsInfo.segInfo = [];
      this.curClickedIndex = -1;

      this.newsId = this.$route.params.newsId;
      var segmentUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
      + "/" + this.newsId + this.GLOBAL.apiController.article.segs;

      this.$axios.get(
        segmentUrl
      ).then(
        res => {
          this.newsInfo.title = res.data.result.title;
          for(let seg of res.data.result.segments){
            var newSeg = {
              innerId:[seg.id],
              Id:[seg.sequenceNumber+1],
              newsContent:[seg.content],
              transContent:""
            }
            this.newsInfo.segInfo.push(newSeg);
          }
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
      
    },
    checkAllTranslated:function(){
      for(let i = 0;i < this.newsInfo.segInfo.length;i++){
        if(this.newsInfo.segInfo[i].transContent == "")return i+1;
      }
      return -1;
    },
    handleTransSubmit:function(){
      var token = this.GLOBAL.getCookie("jwt");
      if(token){

        if(this.newsInfo.transTitle == ""){
          this.$message({
            message:"翻译标题不能为空！",
            type:"warning"
          });
        }
        else if(this.checkAllTranslated() != -1){
          this.$message({
            message:"第"+this.checkAllTranslated() + "句仍未被翻译！",
            type:"warning"
          });
        }else{
          var uploadUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.translation.prefix
          + this.GLOBAL.apiController.translation.upload;

          var segmentList = [];
          for(let seg of this.newsInfo.segInfo){
            var newSeg = {
              "refSegIds": seg.innerId,
              "translationContent": seg.transContent
            }
            segmentList.push(newSeg);
          }
          var data = {
            "articleId": this.newsId,
            "segmentList": segmentList,
            "transTitle": this.newsInfo.transTitle
          };

          this.$axios.post(uploadUrl,data,{
            params:{
              token:token
            }
          }).then(
            res => {
              if(res.data.code == 200){
                this.$message({
                  message:"上传翻译成功！",
                  type:"success"
                });
              }
            }
          ).catch(
            error => {
              console.log(error);
            }
          );
        }
      }else{
        this.$message({
          message:"登录已过期",
          type:"warning"
        });
      }
    }
  },
  watch:{
    $route(){
      this.initPage();
    }
  },
  created:function(){
    this.initPage();
  }
}

</script>

<style scoped>
#transUploader {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-row{
  height: 100%;
}

.el-col{
  height: 100%;
  background-color: white;
  overflow-y: scroll;
}

.leftInfo{
  height: 100%;
  background-color: #404040;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.leftInfo .infoTitle{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:white;
    font-weight: bold;
    font-size: 20px;
}

.leftInfo .infoLine{
    text-align: left;
    line-height: 2;
    display: flex;
    flex-direction: row;
    padding: 15px;
    font-size: 14px;
    color:rgb(150,150,150);
    transition: 0.5s;
}

.leftInfo .infoLine:hover{
    color:white;
    cursor: pointer;
    background-color: rgb(100,100,100);
}

.submitBottom >>> .el-button{
    margin-top: 100px;
    background-color: #404040;
    border-radius: 20px;
    border: 1px solid rgb(201, 252, 204);
    color:rgb(201, 252, 204);
    width: 160px;
    transition: 0.5s;
}

.leftInfo >>> .el-switch__label{
  color:rgb(100,100,100);
}

.leftInfo >>> .el-switch__label.is-active{
  color: teal;
}

.submitBottom >>> .el-button:hover{
    color:white;
    border: 1px solid white;
}

.rightContent .titleWrapper{
  display: flex;
}

.rightContent .titleWrapper >>> .el-input__inner{
  border-right: none;
  border-radius: none;
}

.rightContent .titleWrapper >>> .el-input-group__prepend{
  border-radius: 0px;
}

.rightContent .mainArea{
  position: relative;
}

.rightContent .mainArea .articleMain{
  display: flex;
  flex-direction: row;
  widows: 100%;
}

.rightContent .mainArea .articleMain .articleMode{
  width: 50%;
  word-wrap: break-word;
  font-size: 20px;
  text-align: left;
  white-space: pre-line;
  line-height: 2;
  color:black;
}
.rightContent .mainArea .articleMain .articleMode .innerArticle{
  margin:20px;
}


.rightContent .mainArea .verticalLine{
  position: absolute;
  background-color: rgb(230, 230, 230);
  left:50%;
  width: 1px;
  height: 100%;
}

.rightContent .mainArea .segMain .singleSegLine{
  width: 100%;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  align-items: center;
}

.rightContent .mainArea .segMain .singleSegLine .segArticle{
  width: 50%;
  display: flex;
  justify-content: center;
}

.rightContent .mainArea .segMain .singleSegLine .segArticle .articleMargin{
  margin-top:20px;
  width: 95%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  opacity: 0.4;
  transition: 0.5s;
}

.rightContent .mainArea .segMain .singleSegLine .segArticle .articleMargin:hover{
  opacity: 1;
  cursor: pointer;
}

.rightContent .mainArea .segMain .singleSegLine .segArticle .articleBlock{
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(230,230,230);
  overflow-x: scroll;
  vertical-align: middle;
}

.rightContent .mainArea .segMain .singleSegLine .segArticle .articleBlock .articleContent{
  white-space: pre-line;
  text-align: left;
}

.rightContent .mainArea .segMain .singleSegLine .segTrans{
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.rightContent .mainArea .segMain .singleSegLine .segTransItem{
  margin-top:20px;
  width: 90%;
}

.segTransItem >>> .el-textarea__inner{
    resize: none;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.rightContent .mainArea .segMain .singleSegLine .segTransItem .transIndex{
  text-align: left;
  padding-left: 15px;
  background-color: #404040;
  color:white;
  width: 80%;
  font-size: 12px;
  transition: 0.5s;
}

.rightContent .mainArea .segMain .singleSegLine .segTransItem .transIndex:hover{
  cursor: pointer;
  background-color: rgb(200,200,200);
}

.fullOpacity{
  opacity: 1!important;
}
</style>