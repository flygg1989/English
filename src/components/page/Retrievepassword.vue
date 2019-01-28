<template>
   <div class="login">
       <div class="login_left">
            <div>
                <img src="static/img/icon-logo.png">
                <p>荆楚问政</p>
            </div>
       </div>
       <div class="login_right">
            <p class="back-tips"><router-link to="/login">返回登录</router-link></p>
            <div class="login_right_con">
                
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="" class="ms-content-psw">
                    <div class="login_right_con_title">找回密码</div>
                    <el-form-item label="" prop="phone">
                        <el-input v-model="ruleForm.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="code" class="code_div">
                        <el-input v-model="ruleForm.code" placeholder="" maxlength="4"></el-input>
                        <el-button type="primary" @click="Obtaincode()">{{code_text}}</el-button>
                    </el-form-item>
                    <el-form-item label="" prop="Newpassword" >
                        <el-input v-model="ruleForm.Newpassword" type="password" placeholder="新密码"></el-input>
                    </el-form-item>
                    <el-form-item label=""  prop="Repeatpassword" >
                        <el-input v-model="ruleForm.Repeatpassword" type="password" placeholder="重复新密码"></el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
                    </div>
                </el-form>
              
            </div>
       </div>
   </div> 
</template>

<script>
    import axios from 'axios';
    export default {
    data() {
      return {
            ruleForm: {
                phone: '',
                code:'',
                Newpassword: '',
                Repeatpassword: '',
            },
            rules: {
                phone: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                Newpassword: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                Repeatpassword: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
            },
            code_text:'获取验证码',  //验证码文字
      };
    },
    methods: {
       //获取验证码
       Obtaincode(){
           var self =this;
           if(!(/^1[34578]\d{9}$/.test(this.ruleForm.phone))){
                this.$notify.error({
                    title: '错误',
                    message: '手机号错误'
                });
            }else{
                axios({
                    url: 'http://api.politics.com/api/member/getSmsCode',
                    method: 'post',
                    data: {
                        "user_type":2,
                        "mobile":this.ruleForm.phone,
                    },
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (res) {
                    console.log(res);
                    if(res.status == 200){
                        if(res.data.state == false){
                            self.$notify.error({
                                title: '错误',
                                message: res.data.message
                            });
                        }else{
                            self.$notify({
                                title: '成功',
                                message: '验证码已发送',
                                type: 'success'
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                    self.$notify.error({
                        title: '错误',
                        message: '数据请求失败',
                    });
                })
            }
       },
       
       //确认提交
       submitForm(formName){
           var self =this;
           this.$refs[formName].validate((valid) => {
                if (valid ==true ) {
                    if(!(/^1[34578]\d{9}$/.test(this.ruleForm.phone))){
                        this.$notify.error({
                            title: '错误',
                            message: '手机号错误'
                        });
                        return false;
                    }else if(this.ruleForm.code.length == 0 || this.ruleForm.code.length != 4){
                        this.$notify.error({
                            title: '错误',
                            message: '验证码错误'
                        });
                        return false;
                    }else if(this.ruleForm.Newpassword !=this.ruleForm.Repeatpassword ){
                        this.$notify.error({
                            title: '错误',
                            message: '两次输入的密码不一致'
                        });
                        return false;
                    }else {
                        axios({
                            url: 'http://api.politics.com/api/member/resetPassword',
                            method: 'post',
                            data: {
                                "user_type":2,
                                "mobile":this.ruleForm.phone,
                                "sms_code":this.ruleForm.code,
                                "new_password":this.ruleForm.Newpassword,
                                "new_password_confirmation":this.ruleForm.Repeatpassword,
                            },
                            headers: {'Content-Type': 'application/json;charset=UTF-8'}
                        }).then(function (res) {
                            //console.log(res);
                            if(res.status == 200){
                                if(res.data.state == false){
                                    self.$notify.error({
                                        title: '错误',
                                        message: res.data.message
                                    });
                                    return false;
                                }else{
                                    self.$notify({
                                        title: '成功',
                                        message: '密码已重置',
                                        type: 'success'
                                    });
                                }
                            }
                        }).catch(function (err) {
                            console.log(err);
                            self.$notify.error({
                                title: '错误',
                                message: '数据请求失败',
                            });
                            return false;
                        })
                    }
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '输入不完整',
                    });
                    return false; 
                }
            });
       },
       
    }

  };
</script>

<style >
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
    .back-tips{
        margin: 40px;
    }
    .back-tips a{
        color:rgba(45,53,87,.3);
        font-size: 24px;
    }
    .login_right_con_title{
        text-align: left;
        font-size:30px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:#4D84FF;
        line-height:40px;
    }

    .ms-content-psw{
        width: 500px;
        margin: 0 auto;
    }
    .ms-content-psw .el-input__inner{
        height: 64px;
        line-break: 64px;
        font-size: 18px;
        margin: 20px 0;
    }
    .ms-content-psw .el-form-item__error{
        display: none;
    }
    .ms-content-psw .el-input__suffix{
        right: -40px;
        font-size: 24px;
    }
    .ms-content-psw .login-btn .el-button{
        width: 100%;
        height: 64px;
        font-size: 20px;
        font-weight: bold;
        background: #4D84FF !important;
        
    }
    .ms-content-psw .el-form-item{
        margin-bottom: 0;
    }

    /**验证码**/
    .code_div{
        overflow: hidden;
    }
    .code_div .el-input{
        width:316px;
        float: left;
    }
    .code_div .el-button{
        float: right;
        width: 160px;
        height: 64px;
        margin: 20px 0;
        background: #2CD696;
        font-size: 18px;
        border-color:#2CD696;
    }
</style>