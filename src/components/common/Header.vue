<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">荆楚问政</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="static/img/headimg.png" v-if="utype == 1">
                    <img :src="headimg" v-if="utype == 2">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}<!--  <i class="el-icon-caret-bottom"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided v-if="utype == 1" command="ChangePassword">修改密码</el-dropdown-item>
                        <router-link to="/personalcenter" v-if="utype == 2"><el-dropdown-item>个人中心</el-dropdown-item></router-link>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <div class="ChangePassword">
            <el-dialog title="修改密码" :visible.sync="editVisible" :close-on-click-modal="false" width="560px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="100px" class="ms-content">
                    <el-form-item label="原密码" prop="Oldpassword" >
                        <el-input v-model="ruleForm.Oldpassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码"  prop="Newpassword" >
                        <el-input v-model="ruleForm.Newpassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码"  prop="Repeatpassword">
                        <el-input v-model="ruleForm.Repeatpassword" type="password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    </el-form-item>
                    <div class="line-top"></div>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
                    </div>
                </el-form>

            </el-dialog>  
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import bus from '../common/bus';
    import Bus from "@/components/common/bus.js";
    export default {
        data() {
            return {
                API:domain.testUrl,   //全局接口
                editVisible: false,  //控制弹框显示隐藏
                collapse: false,
                fullscreen: false,
                username: '',
                headimg:'static/img/headimg.png',  //头像
                utype:'',    //判断 平台还是部门

                ruleForm: {
                    Oldpassword: '',
                    Newpassword: '',
                    Repeatpassword:'',
                },
                rules: {
                    Oldpassword: [
                        { required: true, message: '未填写', trigger: 'blur' }
                    ],
                    Newpassword: [
                        { required: true, message: '未填写', trigger: 'blur' }
                    ],
                    Repeatpassword: [
                        { required: true, message: '未填写', trigger: 'blur' }
                    ]
                }
            }
        },
        
        
        computed:{
            
        },
        created(){
            Bus.$on('senduserinfo',(data)=>{
                if(data == true){
                  this.getuserinfo()  
                }
            });
            this.getuserinfo() //判断用户信息
        },
        methods:{
            //判断用户信息
            getuserinfo(){
                let headimg = localStorage.getItem('headimg'); //判断用户头像
                if(localStorage.getItem('headimg') != null){
                    this.headimg =headimg
                };
                let utype = localStorage.getItem('utype');  //判断是平台还是部门
                if(utype == 1){
                    this.utype = 1
                }else{
                    this.utype = 2
                };
                this.username =localStorage.getItem('uname');  //判断用户名称
            },

            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.clear();
                    this.$router.push('/login');
                }else if(command == 'ChangePassword'){
                    console.log('修改密码')
                    this.editVisible = true;
                }
            },

            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },

            //修改密码
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm.Newpassword == this.ruleForm.Repeatpassword){
                            var self =this;
                            axios({
                                url:this.API+ 'dept/edit?token='+localStorage.getItem('sk'),
                                method: 'POST',
                                data: {
                                    "old_pwd":this.ruleForm.Oldpassword,
                                    "new_pwd":this.ruleForm.Newpassword,
                                    "new_pwd2":this.ruleForm.Repeatpassword,
                                },
                            }).then(function (res) {
                                //console.log(res);
                                if (res.status == 200) {
                                    if(res.data.state == false){
                                        self.$notify.error({
                                            title: "错误",
                                            message: res.data.message
                                        });  
                                    }else{
                                        self.$notify({
                                            title: '成功',
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        self.editVisible = false;
                                    }
                                }
                            })
                            .catch(function (err) {
                                this.$notify.error({
                                    title: "错误",
                                    message: "数据请求失败"
                                });
                            })
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: '密码输入不一致'
                            });  
                        }
                    
                    } else {
                        //console.log('error submit!!');
                        this.$notify.error({
                            title: '错误',
                            message: '修改失败'
                        });
                        return false;
                    }
                });
            }
        },
        
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 64px;
        font-size: 22px;
        color: #fff;
        background: #2E313E;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 64px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 64px;
        font-size: 16px;
        font-weight: bold;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 64px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:32px;
        height:32px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
