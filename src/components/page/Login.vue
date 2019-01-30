<template>
   <div class="login">
       <div class="login_left">
            <div>
                <img src="static/img/icon-logo.png">
                <p>荆楚问政</p>
            </div>
       </div>
       <div class="login_right">
            <div class="login_right_con">
                 <el-tabs v-model="message">
                    <el-tab-pane :label="`平台`" name="first">
                        <el-form :model="platForm" :rules="platrules" ref="platForm" status-icon label-width="0px" class="ms-content-psw">
                            <el-form-item prop="username" :show-header="true">
                                <el-input v-model="platForm.username" placeholder="账号">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" placeholder="密码" v-model="platForm.password">
                                </el-input>
                            </el-form-item>

                            <p class="login-tips"><router-link to="/Retrievepassword">忘记密码？</router-link></p>

                            <drag-verify 
                                :width="width" 
                                :height="height" 
                                :text="text" 
                                :success-text="successText" 
                                :background="background" 
                                :progress-bar-bg="progressBarBg" 
                                :completed-bg="completedBg" 
                                :handler-bg="handlerBg" 
                                :handler-icon="handlerIcon" 
                                :text-size="textSize" 
                                :success-icon="successIcon"
                                ref="Verify"
                            >     
                            </drag-verify>

                            <div class="login-btn">
                                <el-button type="primary" @click="platsubmitForm('platForm')">确认登录</el-button>
                            </div>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane :label="`部门`" name="second">
                        <template v-if="message === 'second'">
                                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="0px" class="ms-content-psw">
                                    <el-form-item prop="email" :show-header="false">
                                        <el-input v-model="ruleForm.email" placeholder="邮箱">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                                        </el-input>
                                    </el-form-item>
                                    <p class="login-tips"><router-link to="/Retrievepassword">忘记密码？</router-link></p>

                                    <drag-verify 
                                        :width="width" 
                                        :height="height" 
                                        :text="text" 
                                        :success-text="successText" 
                                        :background="background" 
                                        :progress-bar-bg="progressBarBg" 
                                        :completed-bg="completedBg" 
                                        :handler-bg="handlerBg" 
                                        :handler-icon="handlerIcon" 
                                        :text-size="textSize" 
                                        :success-icon="successIcon"
                                        ref="Verify"
                                    >     
                                    </drag-verify>
                                    <div class="login-btn">
                                        <el-button type="primary" @click="submitForm('ruleForm')">确认登录</el-button>
                                    </div>
                                </el-form>
                        </template>
                    </el-tab-pane>
                </el-tabs>
              
            </div>
       </div>
   </div> 
</template>

<script>
    import axios from 'axios';
    import dragVerify from 'vue-drag-verify'
    
    export default {
        components:{
            dragVerify
        },
    data() {
      return {
        API:domain.testUrl,   //全局接口
        //tabs切换
        message: 'first',
        showHeader: false,
        //平台 邮箱密码
        platForm: {
            username: '',
            password: ''
        }, 
        //平台 验证
        platrules: {
            username: [
                { required: true, message: '请输入账号', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ]
        },
        //部门 邮箱密码 
        ruleForm: {
            email: '',
            password: ''
        },
        
        //部门 验证
        rules: {
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ]
        },
        //滑动
        handlerIcon: "el-icon-lx-right",
        successIcon: "el-icon-lx-roundcheck",
        background: "#cccccc",
        progressBarBg: "#F2F3F7",
        completedBg: "#66cc66",
        handlerBg: "#fff",
        text: "请将滑块拖动到右侧",
        successText: "验证成功",
        width: 500,
        height: 64,
        textSize: "18px",
        isCircle:'true'

        
      };
    },
    methods: {
        //平台提交
        platsubmitForm(formName) {
            let self = this;
            this.$refs[formName].validate((valid) => {
               
                if (valid ==true && this.$refs.Verify.isPassing ==true ) {
                    axios({
                        url: this.API +'auth/login',
                        method: 'POST',
                        data:{
                            "username":this.platForm.username,
                            "password":this.platForm.password,
                        },
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }).then(function (res) {
                        //console.log(res.data);
                        if(res.status == 200){
                            if(res.data.state == false){
                                self.$notify.error({
                                    title: '错误',
                                    message: res.data.message,
                                });
                            }else{
                                var common =res.data.data.common;

                                localStorage.setItem('account',common.account);
                                localStorage.setItem('email',common.email);
                                localStorage.setItem('mobile',common.mobile);
                                localStorage.setItem('sk',common.sk);
                                localStorage.setItem('status',common.status);
                                localStorage.setItem('uname',common.uname);
                                localStorage.setItem('user_id',common.user_id);
                                localStorage.setItem('dept_name',common.dept_name);
                                localStorage.setItem('headimg',common.headimg);
                                localStorage.setItem('utype',common.utype);
                                self.$notify({
                                    title: '成功',
                                    message: '登录成功',
                                    type: 'success'
                                });
                                self.$router.push('/audit'); 
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                        self.$notify.error({
                            title: '错误',
                            message: '数据请求失败',
                        });
                    })
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '账号密码有误'
                    });
                    return false;
                }
            });
        },
        //部门验证
        submitForm(formName) {
            let self = this;
            this.$refs[formName].validate((valid) => {
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");  // 邮箱正则表达式  
                   
                if (valid ==true && this.$refs.Verify.isPassing ==true ) {
                    if(!reg.test(this.ruleForm.email)){
                        this.$notify.error({
                            title: '错误',
                            message: '邮箱格式错误'
                        });
                    }else{
                        axios({
                        url: this.API +'auth/login',
                        method: 'POST',
                        data:{
                            "username":this.ruleForm.email,
                            "password":this.ruleForm.password,
                        },
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }).then(function (res) {
                        console.log(res);
                        if(res.status == 200){
                            if(res.data.state == false){
                                self.$notify.error({
                                    title: '错误',
                                    message: res.data.message,
                                });
                            }else{
                                var common =res.data.data.common;

                                localStorage.setItem('account',common.account);
                                localStorage.setItem('email',common.email);
                                localStorage.setItem('mobile',common.mobile);
                                localStorage.setItem('sk',common.sk);
                                localStorage.setItem('status',common.status);
                                localStorage.setItem('uname',common.uname);
                                localStorage.setItem('user_id',common.user_id);
                                localStorage.setItem('dept_name',common.dept_name);
                                localStorage.setItem('headimg',common.headimg);
                                localStorage.setItem('utype',common.utype);
                                self.$notify({
                                    title: '成功',
                                    message: '登录成功',
                                    type: 'success'
                                });
                                self.$router.push('/politicshandle'); 
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                        self.$notify.error({
                            title: '错误',
                            message: '数据请求失败',
                        });
                    })
                        // localStorage.setItem('email',this.ruleForm.email);
                        // this.$notify({
                        //     title: '成功',
                        //     message: '登录成功',
                        //     type: 'success'
                        // });
                        // self.$router.push('/'); 
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '账号密码有误'
                    });
                    return false;
                }
            });
        }
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