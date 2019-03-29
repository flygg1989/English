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
                    <img :src="headimg">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <!-- <i class="el-icon-caret-bottom"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided  command="PersonalCenter">个人中心</el-dropdown-item>
                        <el-dropdown-item command="ChangePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-dialog title="修改密码" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="100px" class="ms-content">
                <el-form-item label="原密码" prop="old_password" >
                    <el-input v-model="ruleForm.old_password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码"  prop="new_password" >
                    <el-input v-model="ruleForm.new_password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码"  prop="new_password_confirmation">
                    <el-input v-model="ruleForm.new_password_confirmation" type="password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
            </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button type="" @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            </span>
        </el-dialog>  
    </div>
</template>
<script>
    import api from '@/utils/api'
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
                    old_password: '',
                    new_password: '',
                    new_password_confirmation:'',
                },
                rules: {
                    old_password: [
                        { required: true, message: '未填写', trigger: 'blur' }
                    ],
                    new_password: [
                        { required: true, message: '未填写', trigger: 'blur' }
                    ],
                    new_password_confirmation: [
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
                if(headimg != null){
                    this.headimg =headimg
                }else{
                    this.headimg='static/img/headimg.png'
                };
                this.username =localStorage.getItem('uname');  //判断用户名称
            },

            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.clear();
                    this.$router.push('/login');
                }else if(command == 'ChangePassword'){
                    this.editVisible = true;
                }else if(command =='PersonalCenter'){
                    this.$router.push('/PersonalCenter');
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
                        if(this.ruleForm.new_password === this.ruleForm.new_password_confirmation){
                            api.request({
                                url: "editPassword",
                                method: "POST",
                                data:{
                                    old_password:this.ruleForm.old_password,
                                    new_password:this.ruleForm.new_password,
                                    new_password_confirmation:this.ruleForm.new_password_confirmation,
                                }
                            }).then(res=>{
                                //console.log(res.data.data)
                                if(res.data.state ==false){
                                    this.$notify.error({
                                        title: "错误",
                                        message: res.data.message
                                    });
                                    }else{
                                    this.$notify({
                                        title: "成功",
                                        message:res.data.message,
                                        type: 'success'
                                    });
                                    this.editVisible = false;
                                }
                            },res => {
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
