<template>
    <div class="ChangePassword">
        <el-dialog title="修改密码" :visible.sync="editVisible" :close-on-click-modal="false" width="560px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="100px" class="ms-content">
                <el-form-item label="原密码" prop="Oldpassword" >
                    <el-input v-model.trim="ruleForm.Oldpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码"  prop="Newpassword" >
                    <el-input v-model.trim="ruleForm.Newpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码"  prop="Repeatpassword">
                    <el-input v-model.trim="ruleForm.Repeatpassword" type="password"  @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="line-top"></div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
                </div>
            </el-form>

        </el-dialog>  
    </div>
</template>

<script>
import Bus from '@/components/common/bus.js';
export default {
    data() {
        return {
            editVisible: true,  //控制弹框显示隐藏
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
    
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                //console.log(valid)
                if (valid) {
                    if(this.ruleForm.Newpassword == this.ruleForm.Repeatpassword){
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        });
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
    } 
}
</script>

<style>
    .ChangePassword .el-dialog__header{
        text-align: center ;
        
    }
    .ChangePassword .el-dialog__title{
        color: #4D84FF !important;
        font-size: 24px !important;
    }

    .ChangePassword .ms-content{
        padding: 0px 60px 0 30px;
    }
    .ChangePassword .login-btn{
        text-align: right;
    }
    .ChangePassword .login-btn button{
        margin-bottom: 10px;
        width: 104px;
        height: 40px;
        font-size: 14px;
    }
    .ChangePassword .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
        display: none;
    }
    .ChangePassword .el-form-item__error{
        position: absolute;
        top: 25%;
        right:10px;
        left: 85%;
    }
    .ChangePassword .el-input__suffix{
        right: -40px;
        font-size: 24px;
    }
    /**线**/
    .ChangePassword .line-top{
        border-top: 1px solid #ddd;
        margin-bottom: 24px;
        width: 352px;
        margin-left: 78px;
    }
</style>


