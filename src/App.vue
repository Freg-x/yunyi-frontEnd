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
            <router-link v-bind:to="section.url">{{section.name}}</router-link>
          </el-col>

          <!--右半部分banner-->
          <el-col :span="1" :offset="rightOffset">
            <el-popover
              placement="bottom"
              title="来自森下下士的提示："
              width="200"
              trigger="click"
              content="好！很有精神！">
                <el-button slot="reference" type="text" icon="el-icon-bell" size="medium">
                </el-button>
            </el-popover>
          </el-col>
          <el-col :span="2">
            <el-button type="text" size="small" @click="LoginFormVisible=true">登录｜注册</el-button>
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

export default {
  name: 'app',
  data(){
    return{
      isMobile:true,
      rightOffset:14,
      sections:[
        {
          name:'新闻',
          url:'/news'
        },
        {
          name:'文章',
          url:'/articles'
        },
        {
          name:'歌词',
          url:'/lyrics'
        },
        {
          name:'视频',
          url:'/videos'
        },
        {
          name:'教育',
          url:'/education'
        }

      ],
      LoginFormVisible:false,
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
      CaptchaInterval:0,
    }
  },

  computed:{
    getCaptchaDisable:function(){
      return this.LoginInfo.phoneNumber.length != 11 || this.CaptchaInterval > 0;
    },
    captchaWords:function(){
      return this.CaptchaInterval <= 0?"获取验证码":this.CaptchaInterval+"秒后重发";
    }
  },

  methods:{
    handleCaptchaSend:function(){

      this.$message("验证码已发送");
      this.CaptchaInterval = 60;
      
      var Decounter = setInterval(()=>{

        this.CaptchaInterval--;
        if(this.CaptchaInterval <= 0){
          clearInterval(Decounter);
        }

      },1000);

    },
    sendRegisterRequest:function(){
      alert("等待域名备案中。。。");
    },
    _isMobile:function() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    }
  },

  components: {
  },

created:function(){
      this.isMobile = this._isMobile();
      if(this.isMobile){
        this.$router.push({name:'mobile'});
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
  color:white;
  width: 100%;
  background-color: #303133;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
