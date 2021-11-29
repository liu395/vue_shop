<template>
    <div class="login_container">
        <div class="login_box">
            <div class="login_logo">
                <img src="../assets/logo.jpeg" alt="">
            </div>

            <el-form class="login_form" :model="loginForm" 
            :rules="loginFormRule"
            ref="loginFormRef">
                <!-- 用户名 -->
               <el-form-item prop="username">
                  <el-input prefix-icon="iconfont icon-user"
                  v-model="loginForm.username"></el-input>
               </el-form-item>

                <!-- 密码 -->
               <el-form-item prop="password">
                  <el-input prefix-icon="iconfont icon-3702mima" 
                  type="password" v-model="loginForm.password">
                  </el-input>
               </el-form-item>
               <!-- 按钮 -->
               <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginFormRef">重置</el-button>
               </el-form-item>
            </el-form>
            
        </div>
    </div>
</template>

<script>
export default {
    name:'Login',
    data(){
        return{
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginFormRule:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 16, message: '长度在 3 到 16个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        loginFormRef(){
        //    console.log(this);
           this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                // console.log(valid);
                if(!valid) return 
                const {data:res}=await this.$http.post('login',this.loginForm)
                // console.log(res); 
                if(res.meta.status!==200) return this.$message.error('登录失败！');
                this.$message.success('登录成功！');
                // 保存token到sesionStorage中
                // 项目中出现了登录之外的其他API接口，必须在登录之后才能访问
                // Token只应该在当前会话期间生效
                // console.log(res);
                window.sessionStorage.setItem("token",res.data.token)
                this.$router.push("/home")
            })
        }
    }
}
</script>

<style lang="less" scoped>
   .login_container{
       background-color: #2b4b6b;
       height: 100%;
   }
   .login_box{
       position: absolute;
       width: 450px;
       height: 350px;
       background-color: #fff;
       left: 50%;
       top: 50%;
       transform: translate(-50%,-50%);
   }
   .login_logo{
       height: 130px;
       width: 130px;
       border: 1px solid #eee;
       border-radius: 50%;
       padding: 10px;
       box-shadow: 0 0 10px #ddd;
       position: absolute;
       left: 50%;
       transform: translate(-50%,-50%);
       background-color: #fff;
       img{
           width: 100%;
           height: 100%;
           border-radius: 50%;
           background-color: #eee;
       }
   }
   .login_form{
       position: absolute;
       width: 100%;
       bottom: 0;
       padding: 0 20px;
       box-sizing: border-box;
   }
   .btns{
       display: flex;
       justify-content: flex-end;
   }
</style>