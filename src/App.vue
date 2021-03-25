<template>
  <div id="app">

    <el-container >
      <el-header height = "35px" v-if="!isMobile">
        <el-row align="middle" type="flex">

          <!--左半部分banner-->
          <el-col :span="2" >
            <router-link to="/intro">
              <img src="./assets/logo-lrs.png" alt="logo" class="logo">
            </router-link>
          </el-col>
          <el-col 
          :span="1"
          v-for="(section,index) in sections"
          :key="index"
          >
            <router-link v-bind:to="section.url" :class="{disabled:section.disabled}">{{section.name}}</router-link>
          </el-col>

          <!--右半部分banner-->
          <el-col :span="1" :offset="rightOffset">
            <el-popover
              placement="bottom"
              title="来自森下下士的提示："
              width="200"
              trigger="click"
              content="好！很有精神！">
                <el-button slot="reference" type="text" icon="el-icon-bell" size="big">
                </el-button>
            </el-popover>
          </el-col>
          <el-col :span="2" v-if="!logging">
            <el-button type="text" size="small" @click="LoginFormVisible=true">登录｜注册</el-button>
          </el-col>
          <el-col :span="2" class="userCenterContainer" v-else >
            <el-avatar :size=22 :src="userInfo.avatarSrc"></el-avatar>
            <el-popover
            popper-class="userCenter"
            placement="bottom-end"
            width="300"
            trigger="click" 
            >
              <div class="userMain">
                <div class="userName">{{userInfo.nickName}}</div>
                <div class="phone">注册手机：{{userInfo.phone}}</div>
               </div>
               <div class="userOther">
                  <div class="userItem" @click="handleUploaderJump">
                    <i class="el-icon-folder-add" style="size:18px;margin-right:8px;font-weight:bold;"></i>
                    上传文章 
                  </div>
                 <div class="userItem" @click="newUserDialogVisible = true">
                    <i class="el-icon-edit" style="size:18px;margin-right:8px;font-weight:bold;"></i>
                    修改信息
                  </div>
                  <div class="userItem" @click="handleLogout">
                    <i class="el-icon-remove-outline" style="size:18px;margin-right:8px;font-weight:bold;"></i>
                    注销
                  </div>
                </div> 
              <el-button slot="reference" type="text" size="medium">{{userInfo.snickName}}</el-button>
            </el-popover>
          </el-col>

        </el-row>

      <!--登录框-->
      <el-dialog
      title="欢迎来到云译"
      :visible.sync="LoginFormVisible"
      width="30%"
      center>
        <el-form :model="LoginInfo">
            <el-form-item>
              <el-input v-model="LoginInfo.phoneNumber" placeholder="输入手机号" clearable size="medium" maxlength="11" show-word-limit>
                <el-select v-model="LoginInfo.areaNumber" slot="prepend" :value="areaList.areaNumber">
                  <el-option
                  v-for="(area,index) in areaList"
                  :key="index"
                  :label="area.value"
                  :value="area.areaNumber"
                  >
                    <span>{{area.desc}}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
            
            <el-form-item>
              <div style="margin:-10px 0px">
               <el-input v-model="LoginInfo.captcha" placeholder="输入验证码" size="medium" maxlength="6">
                 <el-button type="text" 
                 slot="suffix" 
                 class="getCaptchaText" 
                 :disabled="getCaptchaDisable" 
                 @click="handleCaptchaSend">
                 {{captchaWords}}
                 </el-button>
               </el-input>
              </div>
            </el-form-item>
            

            <div style="margin:25px 0px -10px 0px">
              <el-button type="success" id="submitButton" @click="sendRegisterRequest">登录/注册</el-button>
            </div>
           
        </el-form>

    </el-dialog>

    <!--后悔啊，为什么没把登录框抽象成一个组件，当我们来到现场时只能抽象modifyUser了-->
    <modify-new-user
    :dialogVisible="newUserDialogVisible"
    @childrenClose="handleChildrenClose"
    @updateSuccess="updateUserInfo"
    ></modify-new-user>

      
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>

      <el-footer height = "60px" v-if="!isMobile">
            &copy;CopyRight 同济大学创新项目
        </el-footer>
      
    </el-container> 

  </div>
</template>

<script>

import modifyNewUser from './components/common/modifyNewUser.vue'

export default {
  name: 'app',
  data(){
    return{
      logging:false,
      userInfo:{
        phone:"",
        email:"",
        age:"",
        nickName:"",
        snickName:"",
        avatarSrc:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      },

      isMobile:false,
      loginExpireMin:300,
      //由于加入新按钮所以局右的offset可能改变
      rightOffset:13,

      sections:[
        {
          name:'新闻',
          url:'/news',
          disabled:false
        },
        {
          name:'文章',
          url:'/articles',
          disabled:true
        },
        {
          name:'歌词',
          url:'/lyrics',
          disabled:true
        },
        {
          name:'视频',
          url:'/videos',
          disabled:true
        },
        {
          name:'教育',
          url:'/education',
          disabled:true
        }

      ],
      LoginFormVisible:false,
      newUserDialogVisible:false,
      areaList:[
        {
          desc:"中国大陆(+86)",
          value:"+86",
          areaNumber:86
        },
        {
          desc:"中国香港(+852)",
          value:"+852",
          areaNumber:852
        },
        {
          desc:"中国澳门(+853)",
          value:"+853",
          areaNumber:853
        },
        {
          desc:"中国台湾(+886)",
          value:"+886",
          areaNumber:886
        }   
      ],
      LoginInfo:{
        areaNumber:86,
        phoneNumber:'',
        captcha:''
      },
      //sms需要一个requestId
      requestId:"",
      CaptchaInterval:0,
    }
  },

  computed:{
    getCaptchaDisable:function(){
      return this.LoginInfo.phoneNumber.length != 11 || this.CaptchaInterval > 0;
    },

    //验证码一栏的显示字
    captchaWords:function(){
      return this.CaptchaInterval <= 0?"获取验证码":this.CaptchaInterval+"秒后重发";
    }
  },

  methods:{
    //发送验证码到用户手机
    handleCaptchaSend:function(){

      //发送sms，拿到requestId
      this.$axios.get(
        this.GLOBAL.requestURL+this.GLOBAL.apiController.sms,
        {
          params:{
            "phone":this.LoginInfo.phoneNumber
          }
        }
      ).then(
        //发送成功啦
        res => {
        //给个消息提示，发送进cd
        this.$message("验证码已发送");
        this.CaptchaInterval = 60;

        var Decounter = setInterval(()=>{

          this.CaptchaInterval--;
          if(this.CaptchaInterval <= 0){
            clearInterval(Decounter);
          }

        },1000);
        //处理数据
        this.requestId = res.data.result;
        }
      ).catch(
        error => {
          this.$message({
            message:'发送因为一些原因失败，请查看控制台',
            type:"warning"
          });
          console.log(error);
        }
      );
      },

    //用户提交注册信息
    sendRegisterRequest:function(){

      this.$axios.get(
        this.GLOBAL.requestURL + this.GLOBAL.apiController.login.prefix + this.GLOBAL.apiController.login.captcha,
        {
          params:{
            "requestId":this.requestId,
            "captcha":this.LoginInfo.captcha
          }
        }
      ).then(
        res=>{
          var loginStatus = res.data.code;
          var loginMessage = res.data.message;
          console.log(res);
          //验证码提交是否成功
          if(loginStatus == 200){
            var loginResult = res.data.result;

            this.GLOBAL.setCookie("jwt", loginResult.jwt, this.loginExpireMin);
            this.GLOBAL.setCookie("userId",loginResult.user.id, this.loginExpireMin);

            this.LoginFormVisible = false;

            //新用户修改信息
            if(res.data.result.newUser){
              this.newUserDialogVisible = true;
            }
            else{
              this.logging = true;
              this.updateUserInfo(loginResult.user.id);
              this.$message({
                message:"登录成功！",
                type:"success"
              });
            }
          }
          else{
            this.$message({
              message:loginMessage,
              type:'warning'
            });
          }
        }
      ).catch(
        error =>{
          this.$message({
          message:'因为一些原因登录失败，请查看控制台',
          type:'warning'
          });
          console.log(error);
        }
      );
   },
    //检测是否手机端访问
    _isMobile:function() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },

    //处理子组件传递的时间
    handleChildrenClose:function(){
      this.newUserDialogVisible = false;
    },

    //更新用户信息
    updateUserInfo:function(userId){
      this.$axios.get(
        this.GLOBAL.requestURL + this.GLOBAL.apiController.user.prefix
        + this.GLOBAL.apiController.user.info + userId
      ).then(
        res => {
          this.userInfo.age = res.data.result.age;
          this.userInfo.email = res.data.result.email;
          this.userInfo.nickName = res.data.result.name;
          if(this.userInfo.nickName.length <= 6){
            this.userInfo.snickName = this.userInfo.nickName;
          }
          else{
            this.userInfo.snickName = this.userInfo.nickName.slice(0,6)+"...";
          }
          this.userInfo.phone = res.data.result.phone;
        }
      ).catch(
       error =>{
          this.$message({
          message:'更新用户信息失败',
          type:'warning'
          });
          console.log(error);
        } 
      );
    },

    handleLogout:function(){
      var jwt = this.GLOBAL.getCookie("jwt");
      var userId = this.GLOBAL.getCookie("userId");
      if(jwt && userId){
        this.GLOBAL.delCookie("jwt");
        this.GLOBAL.delCookie("userId");
        this.logging = false;
        this.$message({
          message:"退出登录",
          type:"success"
        });
      }
    },

    //新页面上传
    handleUploaderJump:function(){
      var jwt = this.GLOBAL.getCookie("jwt");
      var userId = this.GLOBAL.getCookie("userId"); 
      if(jwt && userId){
        let routeUrl = this.$router.resolve(
          {
            name:"newsUploader"
          }
        );
      window.open(routeUrl.href, '_blank');
      }
    }
  },

  components: {
    modifyNewUser
  },

created:function(){
      //检测移动端
      this.isMobile = this._isMobile();
      if(this.isMobile){
        this.$router.push({name:'mobile'});
      }

      //更新用户信息
      var jwt = this.GLOBAL.getCookie("jwt");
      var userId = this.GLOBAL.getCookie("userId");
      if(jwt && userId){
        this.logging = true;
        this.updateUserInfo(userId);
      }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size:12px;
  color: #2c3e50;
}

.disabled{
  pointer-events: none;
  cursor: wait;
  color: rgb(180,180,180);
}

.el-header{
  width:100%;
  background-color:white;
}

.logo{
  width:80px;
  height:30px;
}

a{
  font-size: 12px;
  text-decoration: none;
  color: #2c3e50;
}

.el-button{
  color: #2c3e50;
  transition:0.5s;
}

.el-dialog__title{
  font-weight:bold;
  color:red;
}

.el-main{
  padding:0px;
}

.el-select{
  width: 80px;
}

.el-input{
  height:20px;
}

.getCaptchaText{
  margin-right: 4px;
  color:#67C23A;
}

#submitButton{
  width: 100%;
  color:white;
}

.el-footer{
  position:fixed;
  bottom:0px;
  color:white;
  width: 100%;
  background-color: #303133;
  display: flex;
  justify-content: center;
  align-items: center;
}

.userCenterContainer{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.userMain{
  padding: 16px;
  background-image: linear-gradient(to bottom right, rgb(245, 255, 242), rgb(219, 245, 219));
  border-bottom: 1px solid lightgray;
}

.userMain .userName{
  font-size:20px;
  font-weight: bold;
  width: 100%;
  margin-bottom: 15px;
  color:#008080;
}

.userMain .phone{
  color:#008080;
}

.userOther{
  padding:0px;
}

.userItem{
  display: flex;
  align-items: center;
  font-size: 16px;
  padding-left: 5%;
  width: 95%;
  height: 40px;
  transition: 0.4s;
}

.userItem:hover{
  cursor: pointer;
  background-color: rgb(240,240,240);
}
</style>
<style>
.userCenter{
  padding:0px!important;
}
</style>
