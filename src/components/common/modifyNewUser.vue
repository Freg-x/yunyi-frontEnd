<template>
    <div id="modifyNewUser">
        <el-dialog
        title="新用户信息更新"
        :visible.sync="dialogVisible"
        width="25%"
        center
        :before-close="emitCloseEvent"
        >
            <p class="note">您看起来是第一次使用，先来完善您的信息吧！</p>
            <el-form :model="newUserInfo">
                <el-form-item label="您的年龄:">
                    <el-input 
                    v-model="newUserInfo.age"
                    type="number"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="您的邮箱:">
                    <el-input 
                    v-model="newUserInfo.email"
                    type="email"
                    placeholder="您的常用邮箱，选填"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="您的昵称:">
                    <el-input 
                    v-model="newUserInfo.nickName"
                    type="text"
                    maxlength="12"
                    show-word-limit
                    clearable
                    placeholder="您在本网站内的称呼，允许重名"
                    >
                    </el-input>
                </el-form-item>
                <div style="margin:25px 0px -10px 0px">
                    <el-button type="success" id="submitButton" @click="sendModifyRequest">提交信息</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

export default {
  name: 'modifyNewUser',
  //父组件告诉你显不显示
  props:{
      dialogVisible:{
          type:Boolean,
          default:false
      }
  },
  data(){
      return {
         newUserInfo:{
             age:18,
             email:"",
             nickName:""
         }
      }
  },
  methods:{
      emitCloseEvent:function(){
          this.$emit('childrenClose');
      },
      sendModifyRequest:function(){
          //确保你登录了
          var token = this.GLOBAL.getCookie("jwt");
          var userId = this.GLOBAL.getCookie("userId");
          if(token){
              var data = {
                  "age":this.newUserInfo.age,
                  "email":this.newUserInfo.email,
                  "nickName":this.newUserInfo.nickName
              };
              var modifyURL = this.GLOBAL.requestURL +
              this.GLOBAL.apiController.user.prefix + this.GLOBAL.apiController.user.modify;

              this.$axios.post(modifyURL,data,{
                  params:{
                      token:token
                  }
              }).then(
                  res=>{
                    console.log(res);
                    this.$message({
                        message:"修改成功",
                        type:'success'
                        }); 
                    this.$emit('updateSuccess', userId);
                    this.emitCloseEvent();
                  }
              ).catch(
                  error=>{
                      console.log(error)
                  }
              );
          }
          else{
              this.$message({
                  message:"没有登录或登录过期",
                  type:'warning'
              });
          }
      }
  },
  components:{
  }
}

</script>

<style scoped>
#modifyNewUser {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #909399;
}

.note{
    font-size: 12px;
    width: 100%;
    text-align: center;
    margin-top:-20px;
}

#submitButton{
    width: 100%;
}

</style>