<template>
  <div id="app">

    <el-container>
      <el-header height = "40px">
        <el-row align="middle" type="flex">
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

          <el-col :span="1" offset="14">
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

      <el-dialog
      title="欢迎来到云译"
      :visible.sync="LoginFormVisible"
      width="30%"
      center>
        <el-form :model="LoginInfo">
            <el-input v-model="LoginInfo.phoneNumber" placeholder="输入手机号" clearable=true size="medium" maxlength="11" show-word-limit>
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
            
            <div style="margin:15px 0px">
               <el-input v-model="LoginInfo.captcha" placeholder="输入验证码" size="medium" maxlength="6">
                 <el-button type="text" slot="suffix" class="getCaptchaText" :disabled="getCaptchaDisable">获取验证码</el-button>
               </el-input>
            </div>
           
        </el-form>

    </el-dialog>

      
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container> 

  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return{
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
      }
    }
  },

  computed:{
    getCaptchaDisable:function(){
      return this.LoginInfo.phoneNumber.length != 11;
    }
  },

  components: {
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

</style>
