<template>
    <div id="newsUploader" :style="defaultHeight">
        <el-row>
            <el-col :span="4">
                <div class="leftInfo">
                    <div class="infoTitle">使用说明</div>
                    <div class="infoLine">* 上传的文章会按照标点符号进行自动切分，自动切分可能存在不准确的现象</div>
                    <div class="infoLine">* 点击切分好的内容可以进行自由合并，操作后可点击标题右侧按钮重新自动切分</div>
                    <div class="infoLine">* 当前选中内容：{{curClicked == -1?"暂无":curClicked}}</div>
                    <div class="submitBottom">
                        <el-button
                        @click="handleArticleSubmit"
                        >提交内容</el-button>
                    </div>

                </div>
            </el-col>
            <el-col :span="14">
                <div class="mainInput">
                    <el-input 
                    placeholder="输入文章标题"
                    v-model="articleInfo.title"
                    class="titleInput"
                    >
                        <el-select v-model="articleInfo.genre" slot="prepend" class="genreSelect">
                            <el-option label="政治" value="政治"></el-option>
                            <el-option label="影视" value="影视"></el-option>
                            <el-option label="游戏" value="游戏"></el-option>
                            <el-option label="科技" value="科技"></el-option>
                            <el-option label="体育" value="体育"></el-option>  
                        </el-select>
                         <el-button slot="append" 
                         icon="el-icon-refresh"
                         @click="handleSeg"
                         >重新自动切分</el-button>
                    </el-input>
                    <el-input
                    type="textarea"
                    :autosize="{minRows: 25}"
                    v-model="articleInfo.content"
                    class="contentInput"
                    @change="handleSeg"
                    ></el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="segInput">
                    <div class="segTitle">语句分割结果</div>
                    <div class="segArea">
                        <div
                        class="segLine"
                        v-for="(seg,index) in segContent"
                        :key="index"
                        :id="addSegId(index)"
                        @click="handleSegClick(index)"
                        >
                            <div class="segments">{{index}}</div>
                            <div class="segments">{{seg.content}}</div>
                            <div class="segments mark">{{seg.mark}}</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
  name: 'newUploader',
  //父组件告诉你显不显示
  props:{
  },
  data(){
      return {
          defaultHeight:{
              height:""
          },
          articleInfo:{
              title:"",
              genre:"政治",
              content:""
          },
          curClicked:-1,
          resetValue:[],
          resetSeg:false
      }
  },
  computed:{
      segContent:{
          get:function(){
            if(!this.resetSeg){
                var rerturnValue = [];
                var content = "";
                for(let char of this.articleInfo.content){
                    if(char == "," ||char == "." ||char == ";" ||char == "!"|| char == "?"||char=="。"||char=="/"){
                        var newObj = {};
                        newObj.content = content;
                        newObj.mark = char;
                        content="";
                        rerturnValue.push(newObj);
                    }
                    else{
                        content = content + char;
                    }
                }
                if(content!=""&&content!="\n"){
                    rerturnValue.push({
                    'content':content,
                    'mark':""
                    });
                }
                return rerturnValue; 
            }
            else{
                return this.resetValue;
            }
            
          },
          set:function(){

          }
      }
  },
  methods:{
      getHeight:function(){
        this.defaultHeight.height = window.innerHeight - 90 + "px"
      },
      addSegId:function(index){
          return "seg"+index;
      },
      handleSeg:function(){
          this.resetSeg = false;
      },
      handleSegClick:function(index){
          var seg = document.getElementById("seg"+index);
          if(this.curClicked == -1){
            seg.classList.add("black");
            this.curClicked = index;
          }
          else if(this.curClicked == index){
            seg.classList.remove("black");
            this.curClicked = -1;
          }
          else{
              let bigIndex = index > this.curClicked?index:this.curClicked;
              let smallIndex = index > this.curClicked?this.curClicked:index;
              var newSeg = [];
              var newEl = {
                  content:"",
                  mark:"",
              };
              for(let i = 0; i < this.segContent.length; i++){
                  if(i < smallIndex || i > bigIndex){
                      newSeg.push(this.segContent[i]);
                  }
                  else if(i == bigIndex){
                      newEl.content = newEl.content + newEl.mark + this.segContent[i].content;
                      newEl.mark = this.segContent[i].mark;
                      newSeg.push(newEl);
                  }
                  else{
                      newEl.content = newEl.content + newEl.mark + this.segContent[i].content;
                      newEl.mark = this.segContent[i].mark;
                  }
              }
              this.resetSeg = true;
              this.resetValue = newSeg;
              this.curClicked = -1;

              var lines = document.getElementsByClassName("segLine");
              for(let line of lines){
                  line.classList.remove("black");
              }
          }

      },
      handleArticleSubmit:function(){
          var curSeg = [];
          var sendingSeg = [];

          if(this.resetSeg)curSeg = this.resetValue;
          else curSeg = this.segContent;

          for(let obj of curSeg){
              var curStr = obj.content + obj.mark;
              sendingSeg.push(curStr);
          }

          var token = this.GLOBAL.getCookie("jwt");
          if(token){

              var data = {
                  "title":this.articleInfo.title,
                  "genre":this.articleInfo.genre,
                  "segments":sendingSeg
              };
              var uploadUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
              + this.GLOBAL.apiController.article.upload;

              this.$axios.post(uploadUrl,data,{
                  params:{
                      token:token
                  }
              }).then(
                  res =>{
                      if(res.data.code == 200){
                          this.$message({
                              message:"提交新闻成功！",
                              type:"success"
                          });
                      }
                      else{
                          this.$message({
                              message:res.data.message,
                              type:"warning"
                          });
                      }
                  }
              ).catch(
                  error =>{
                      console.log(error);
                  }
              );

          }else{
              this.$message({
                  message:"没有登录或登录过期",
                  type:"warning"
              });
          }
      }
  },
  components:{
  },
  created:function(){
    //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  }
}

</script>

<style scoped>
#newsUploader {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #909399;
    overflow: scroll;
}

.el-row{
    height: 100%;
}

.el-col{
    height: 100%;
    overflow: scroll;
    background-color: white;
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
    margin-top:200px;
    background-color: #404040;
    border-radius: 20px;
    border: 1px solid rgb(201, 252, 204);
    color:rgb(201, 252, 204);
    width: 160px;
    transition: 0.5s;
}

.submitBottom >>> .el-button:hover{
    color:white;
    border: 1px solid white;
}

.mainInput{
    height: 100%;
    background-color: white;
    border-right: 1px solid rgb(230,230,230);
}

.mainInput >>> .el-input__inner{
    border-radius: 0px;
    height: 50px;
    background-color: white;
    font-weight: bold;
    color:black;
}

.mainInput >>> .el-textarea__inner{
    border:none;
    resize: none;
    padding: 20px;
    font-size: 20px;
}

.mainInput .genreSelect{
    width:100px;
}

.segInput{
    border-top:1px solid rgb(230,230,230);
    background-color: white;
    height: 100%;
}

.segInput .segTitle{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: 48px;
    border-bottom:1px solid rgb(230,230,230);
}

.segInput .segArea{
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.segInput .segLine{
    display: flex;
    flex-direction: row;
    transition: 0.4s;
}

.segInput .segLine:hover{
    cursor: pointer;
}

.segInput .segLine .segments{
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-top:10px;
    margin-left: 5px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid rgb(230,230,230);
}

.segInput .segLine .mark{
    font-weight: bold;
    background-color: rgb(230,230,230);
}

.black{
    color:black;
}

</style>