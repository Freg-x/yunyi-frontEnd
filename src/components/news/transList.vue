<template>
  <div id="transList">
      <div class="transMain">
        <div class="firstLine">
          <div class="greenIcon"></div>
          <div class="transTitle">全部翻译 <span style="font-weight:500;">{{totalTrans}}</span></div>
        </div>
        <div class="mainArea">
          <div 
          class="singleTrans"
          v-for="(trans,index) in transList"
          :key="index"
          >
            <el-row>
              <el-col :span="1" class="avatarWrapper">
                <el-avatar :size="30" :src="trans.uploaderAvatar"></el-avatar>
              </el-col>
              <el-col :span="23" class="InfoWrapper">
                <div class="singleTransTitle" @click="handleJumpTrans(trans.transId)">
                  <span v-if="trans.transId == bestTransId" class="bestTransColor">
                    <i class="el-icon-medal-1"></i>[最佳翻译] 
                  </span>
                  {{trans.transTitle}}
                  </div>
                <div class="transInfo">由 {{trans.uploaderName}} 上传，共收获 {{trans.likeNum}} 个赞同</div>
              </el-col>
            </el-row>
            <div class="transContent">
              {{trans.content}}
            </div>
          </div>

          <div class="bottomArea">
            <el-button
            icon="el-icon-upload"
            :disabled="!logging"
            @click="handleUploadTrans"
            >
              {{buttonText}}
            </el-button>
          </div>

          <el-pagination
          layout="prev, pager, next"
          :total="totalTrans"
          @current-change="handleCurrentPageChange"
          ></el-pagination>

        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'transList',
  data(){
      return {
          newsId:-1,
          logging:false,

          curPage:1,
          totalTrans:0,

          bestTransId:-1,

          transList:[
          ]
      }
  },
  watch:{
    $route(){
      this.initPage();
    }
  },
  computed:{
    buttonText:function(){
      if(!this.logging)return "登录后，你可以在这里上传你的翻译";
      if(this.totalTrans == 0)return "做第一个上传翻译的人吧！"
      return "我也来上传翻译！"
    }
  },
  methods:{
    updateTransList:function(){

      var articleTransUrl = this.GLOBAL.requestURL + this.GLOBAL.apiController.article.prefix
      + "/" + this.newsId + this.GLOBAL.apiController.article.trans;
      var params={
        "pageId":this.curPage,
        "pageSize":10
      }

      this.$axios.get(
        articleTransUrl,{params}
      ).then(
        res => {
          if(!res.data.result){
            this.totalTrans = 0;
            return;
          }
          this.totalTrans = res.data.result.transCount;
          if(this.totalTrans != 0){
            this.bestTransId = res.data.result.bestTranslation.transId;
            for(let resTrans of res.data.result.translations){
              var newTrans = {};
              newTrans.content = resTrans.content;
              newTrans.likeNum = resTrans.likeNum;
              newTrans.transId = resTrans.transId;
              newTrans.transTitle = resTrans.transTitle;
              newTrans.uploaderId= resTrans.uploaderId;
              newTrans.uploaderName = resTrans.uploaderName;
              newTrans.uploaderAvatar = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
              this.transList.push(newTrans);
            }
          }

        }
      ).catch(
        error => {
          console.log(error);
        }
      );

    },
    handleCurrentPageChange:function(newPage){
      this.curPage = newPage;
      this.updateTransList();
    },
    handleUploadTrans:function(){
      if(this.GLOBAL.getCookie("jwt")){
        this.$router.push({path:'/news/'+this.newsId+"/transUpload"});
      }else{
        this.$message({
          message:"登录失效！",
          type:"warning"
        });
      }
    },
    handleJumpTrans:function(transId){
      this.$router.push({path:"/news/"+this.newsId+"/"+transId});
    },
    initPage:function(){
      this.curPage = 1;
      this.bestTransId = -1;
      this.transList = [];
      if(this.GLOBAL.getCookie("jwt")){
        this.logging = true;
      }
      this.newsId = this.$route.params.newsId;
      this.updateTransList();
    }
  },
  components:{
  },
  created:function(){
    this.initPage();
  }
}

</script>

<style scoped>

#transList{
  margin-left: 10px;
  margin-right:10px;
  margin-bottom: 20px;
  padding:20px;
  color:black;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#transList .firstLine{
  padding-top:10px;
  display: flex;
  flex-direction: row;
  align-content: left;
  width: 100%;
}

#transList .greenIcon{
  width: 5px;
  height: 23px;
  background-color: teal;
}

#transList .transTitle{
  margin-left: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}

#transList .mainArea{
  margin-top:20px;
}

#transList .singleTrans{
  width:100%;
  margin-bottom: 20px;
  border-bottom: 1px solid rgb(230,230,230);
}

#transList .singleTrans .avatarWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

#transList .singleTrans .InfoWrapper{
  display: flex;
  flex-direction: column;
  align-content: left;
}

#transList .singleTrans .InfoWrapper .singleTransTitle{
  font-size: 15px;
  font-weight: bold;
  color:black;
  width: 100%;
  text-align: left;
  transition: 0.5s;
}

#transList .singleTrans .InfoWrapper .singleTransTitle:hover{
  color:teal;
  cursor: pointer;
}

#transList .singleTrans .InfoWrapper .singleTransTitle .bestTransColor{
color:gold;
}

#transList .singleTrans .InfoWrapper .transInfo{
  width: 100%;
  text-align: left;
  font-size: 10px;
  color:rgb(100,100,100);
}

#transList .singleTrans .transContent{
  widows: 100%;
  text-align: left;
  font-size: 12px;
  margin:10px 3px;
  color:rgb(80,80,80);
}

#transList .bottomArea{
  margin: 10px 0px;
  width: 100%;
}

#transList .bottomArea .el-button{
  transition: 0.5s;
  width: 100%;
}
</style>