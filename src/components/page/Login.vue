<template>
   <div class="login">
       <div class="login_left">
            <div>
                <img src="static/img/icon-logo.png">
                <p>飞行英语</p>
            </div>
       </div>
       <div class="login_right">
            <div class="login_right_con">
                <el-form :model="platForm" :rules="platrules" ref="platForm" status-icon label-width="0px" class="ms-content-psw">
                    <el-form-item prop="name" :show-header="true">
                        <el-input v-model.trim="platForm.name"  placeholder="账号">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model.trim="platForm.password">
                        </el-input>
                    </el-form-item>

                    <p class="login-tips"><router-link to="/Retrievepassword">忘记密码？</router-link></p>
                    <br/>
                    <div class="login-btn">
                        <el-button type="primary" @click="platsubmitForm('platForm')">确认登录</el-button>
                    </div>
                </el-form>
            </div>
       </div>
   </div> 
</template>

<script>
    import axios from 'axios';
    import dragVerify from 'vue-drag-verify';
    import api from "@/utils/api";
    
    export default {
        components:{
            dragVerify
        },
    data() {
      return {
        API:domain.testUrl,   //全局接口
        //平台 邮箱密码
        platForm: {
            name: '',
            password: ''
        }, 
        //平台 验证
        platrules: {
            name: [
                { required: true, message: '请输入账号', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ]
        },
      };
    },
    methods: {
        //平台提交
        platsubmitForm(formName) {
            let self = this;
            this.$refs[formName].validate((valid) => {
               
                if (valid) {
                    axios({
                        url: this.API +'login',
                        method: 'POST',
                        data: {
                            "name":this.platForm.name,
                            "password":this.platForm.password,
                        },
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }).then(function (res) {
                        //console.log(res);
                        if(res.data.state ==false){
                            self.$notify.error({
                                 title: '错误',
                                 message: res.data.message,
                            });
                        }else{
                            var token =res.data.data.token;
                            localStorage.setItem('sk',token);
                            var n = token.split(".");
                            var m =window.atob(n[1])
                            var b =eval('(' + m + ')');;
                            //console.log(b);
                            localStorage.setItem('user_id',b.sub.id);
                            localStorage.setItem('uname',b.sub.name);
                            localStorage.setItem('headimg',b.sub.headimg);
                            localStorage.setItem('expTime',b.exp);
                            self.$notify({
                                 title: '成功',
                                 message:res.data.message,
                                 type: 'success'
                            });
                            self.$router.push('/Welcome'); 
                        }
                        })
                        .catch(function (err) {
                            self.$notify.error({
                                title: '错误',
                                message: '数据请求失败',
                            });
                         return false;
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }

  };
</script>

<style>
    .login{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .login_left{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width:30%;
        height: 100%;
        background: #4D84FF;
    }
    .login_left div{
        position: absolute;
        top:50%;
        left:50%;
        width:100%;
        transform:translate(-50%,-50%);
        text-align: center;
    }
    .login_left div p{
        font-size: 18px;
        color: #fff;
        font-weight: bold;
        line-height: 24px;
    }
    .login_right{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width:70%;
        height: 100%;
    }
    .login_right_con{
        position: absolute;
        top:50%;
        left:50%;
        width:100%;
        transform:translate(-50%,-50%);
        text-align: center;
    }
    .login .ms-content-psw{
        width: 500px;
        margin:0 auto;
    }
    .login .ms-content-psw .el-input{
        margin-bottom: 0;
    }
    .login .ms-content-psw .el-form-item__error{
        display: none;
    }

    .login .el-tabs__nav-wrap::after{
        position:static;
    }
    .login .el-tabs__nav, .login .is-top{
        float: none;
        color: #4D84FF;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 68px;
        
    }
    .login #tab-first{
       border: 1px solid #4D84FF; 
       border-radius: 3px 0  0 3px;
       border-right: none;
    }
    .login #tab-second{
       border: 1px solid #4D84FF; 
       border-radius: 0 3px 3px 0;
       border-left: none;
    }
    .login .el-tabs__item{
        width: 180px;
        padding: 10px 0;
        height: auto;
        line-height: auto;
    }
    .login .el-tabs__item.is-active{
        border-bottom: none;
        background: #4D84FF;
        color: #fff;
    }
    .login .el-tabs__active-bar{
        background: none;
    }
    .login .el-input__inner{
        height: 64px !important;
        line-height: 64px !important;
        margin: 10px 0;
        font-size: 20px;
    }
    .login .login-btn .el-button--small, .login .el-button--small.is-round{
        width: 100%;
        background:#4D84FF;
        height: 64px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        background: #4D84FF !important;
    }
    .login .el-input__suffix{
        right: -40px;
        font-size: 24px;
    }
    .login-tips{
        text-align: right;
        color: #4D84FF;
        font-size: 16px;
    }
    .login-tips a{
        color: #4D84FF;
    }

    .login .drag_verify{
        border-radius: 0 !important;
        background: #F2F3F7 !important;
        margin: 32px 0 48px 0;
    }
    .login .drag_verify .dv_handler{
        border-radius: 0 !important;
    }
    .login .dv_progress_bar{
       border-radius: 0 !important; 
    }
</style>