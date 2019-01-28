<template>
  <div class="personal-center">
    <div class="box">
      <div class="box-left">
        <div class="img-box">
          <img :src="form.headimg">
        </div>
        <el-upload
          class="upload-box"
          :action='url'
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <div class="box-inline">
            <img src="static/img/icon-photo.png">
            <div class="el-upload__text">点击上传部门头像</div>
          </div>
        </el-upload>
      </div>
      <div class="box-right">
        <el-form ref="form" :model="form"  label-width="72px">
          <el-form-item label="部门名称">
            <el-input v-model="form.dept_name" disabled>
              <span slot="suffix">修改请联系平台相关工作人员</span>
            </el-input>
          </el-form-item>
            <div style="position: relative">
                <el-form-item label="责任人" >
                    <el-input v-model.trim="form.uname" :disabled="!edit1"></el-input>
                </el-form-item>
                <i @click="modifyName()" :class="{'el-icon-edit':!edit1,'el-icon-circle-check':edit1}" style="font-size:20px;position: absolute;right: -30px;top:10px"></i>
            </div>
            <div style="position: relative">
                <el-form-item label="手机号" >
                    <el-input v-model.number="form.mobile" :disabled="!edit2" ></el-input>
                </el-form-item>
                <i @click="modifyMobile()" :class="{'el-icon-edit':!edit2,'el-icon-circle-check':edit2}" style="font-size:20px;position: absolute;right: -30px;top:10px"></i>
            </div>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门分类">
            <el-input v-if="form.dtypeid==1" value="省直厅局" disabled></el-input>
             <el-input v-else value="地市区县" disabled></el-input>
          </el-form-item>
          <el-form-item label="行政级别">
            <el-input v-model="form.address" disabled></el-input>
          </el-form-item>
          <div class="form-footer">
            <el-button type="text" @click="editVisible=true">修改密码</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="ChangePassword">
        <el-dialog title="修改密码" :visible.sync="editVisible" :close-on-click-modal="false"  width="560px">
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

import api from '@/utils/api'

const modifyUserInfo='dept/edit';
const userInfo = 'user';
import Bus from "@/components/common/bus.js";

export default {
  data(){

    return {
      imgUrl:'',
      base64:'',
      API:domain.testUrl, //全局接口
      url:domain.testUrl+'upload?token='+localStorage.getItem('sk'),  //upload图片转src
      dialogFormVisible: false,
      dialogPassword:false,
        edit1:false,
        edit2:false,
        tip1:{
          show:false,
          content:''
        },
      form:{
        uname:'',
        mobile:"",
        email:"",
        dept_name:"",
        headimg:'static/img/headimg.png',
        address:'',
        dtypeid:''
      },
        code:{
          oldpassword:'',
          newpasswoed1:'',
          newpasswoed2:''
        },

        editVisible: false,  //控制弹框显示隐藏
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
    initData(){
          api.request({
              url:userInfo,
              method:'get'
          }).then(res=>{
              //console.log(res.data.data.common)
              if(res.status == 200){
                  this.form.uname = res.data.data.common.uname
                  this.form.mobile = res.data.data.common.mobile
                  this.form.email = res.data.data.common.email
                  this.form.dept_name = res.data.data.common.dept_name
                  this.form.headimg = res.data.data.common.headimg
                  this.form.address =res.data.data.common.address?res.data.data.common.address.join(''):''
                  this.form.dtypeid = res.data.data.common.dtypeid
              }else {
                  this.$notify.error({
                      title: "错误",
                      message: "数据请求失败"
                  })
              }
          }).catch(err=>{
              console.log(err)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          })
      },
    //用户名修改
      modifyName(formName){

          if (this.edit1==false) {
              this.edit1=true
          }else {

              if(this.form.uname.length != null){
                  api.request({
                      url: modifyUserInfo,
                      method: "post",
                      data:{
                          uname:this.form.uname
                      }
                  }).then(res=>{
                      if(res.status == 200){
                          localStorage.setItem('uname',this.form.uname);
                          Bus.$emit('senduserinfo', true)//-------发送信息到头部
                          this.$notify({
                              title: "成功",
                              message: "责任人修改成功",
                              type: 'success'
                          });
                          this.edit1=false
                          this.initData()
                      }else {
                          this.$notify.error({
                              title: "错误",
                              message: "数据请求失败"
                          })
                      }
                  }).catch(err=>{
                      this.$notify.error({
                          title: "错误",
                          message: "数据请求失败"
                      })
                  })
              }else {
                  this.$notify.error({
                      title: "错误",
                      message: "只能是6-12位字母，数字，下划线"
                  })
              }
          }

      },
      //手机号修改
      modifyMobile(formName){

          if (this.edit2==false) {
              this.edit2=true
          }else {

                if(/^1[34578]\d{9}$/.test(this.form.mobile)&&this.form.mobile){
                    api.request({
                        url: modifyUserInfo,
                        method: "post",
                        data:{
                            mobile:this.form.mobile
                        }
                    }).then(res=>{
                        if(res.status == 200){
                            localStorage.setItem('mobile',this.form.mobile);
                            this.$notify({
                                title: "成功",
                                message: "手机号修改成功",
                                type: 'success'
                            });
                            this.edit2=false
                            this.initData()
                        }else {
                            this.$notify.error({
                                title: "错误",
                                message: "数据请求失败"
                            })
                        }
                    }).catch(err=>{
                        this.$notify.error({
                            title: "错误",
                            message: "数据请求失败"
                        })
                    })
                }else {
                    this.$notify.error({
                                    title: "错误",
                                    message: "请输入正确的手机号码"
                     })
                }
          }
      },
    //上传成功
    handleAvatarSuccess(result,file) {
        this.form.headimg = URL.createObjectURL(file.raw)
        api.request({
            url:modifyUserInfo,
            method:'post',
            data:{
              headimg:result.data.common.src
            }
        }).then((res)=>{
            localStorage.setItem('headimg',result.data.common.src);
            Bus.$emit('senduserinfo', true)//-------发送信息到头部
            this.$notify({
               title: "成功",
               message: "头像更换成功",
               type: 'success'
             });
        }).catch(err=>{
            this.$notify.error({
                title: "错误",
                message: "头像上传失败"
            });
        })
    },

    //上传之前检查文件
    beforeAvatarUpload(file) {
      let isJPG =['image/jpg','image/png','image/jpeg'].includes(file.type)
      let isLt300K = file.size / 1024 / 1024 < 0.3;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,JPEG,PNG 格式!');
      }
      if (!isLt300K) {
        this.$message.error('上传头像图片大小不能超过 300K!');
      }
      return isJPG && isLt300K;
    },

    //手机号，用户名更改
    toServer(){

        api.request({
           url: modifyUserInfo,
           method: "post", 
           data:{
              uname:this.send.uname,
              mobile:this.send.mobile
           }
        }).then(res=>{
            if(res.status == 200){
               this.$notify({
                  title: "成功",
                  message: "更换成功",
                  type: 'success'
                });
                this.initData()
              }else {
                this.$notify.error({
                title: "错误",
                message: "数据请求失败"
                })
             }
        }).catch(err=>{
            this.$notify.error({
                title: "错误",
                message: "数据请求失败"
            })
        }).finally(()=>{
            this.dialogFormVisible=false
        })
    },

    //修改密码
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.ruleForm.Newpassword == this.ruleForm.Repeatpassword){
                    api.request({
                        url: 'dept/edit',
                        method: "post",
                        data:{
                        "old_pwd":this.ruleForm.Oldpassword,
                            "new_pwd":this.ruleForm.Newpassword,
                            "new_pwd2":this.ruleForm.Repeatpassword,
                        }
                    })
                    .then(
                    res => {
                        if (res.status == 200) {
                            if(res.data.state == false){
                                this.$notify.error({
                                    title: "错误",
                                    message: res.data.message
                                });  
                            }else{
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.editVisible = false;
                            }
                        }
                    },
                    res => {
                        this.$notify.error({
                            title: "错误",
                            message: "数据请求失败2"
                        });
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
  },
  mounted(){
     this.initData()

  }
}
</script>
<style scoped>

.el-icon-edit:hover,.el-icon-circle-check:hover{
    color: #4D84FF;
    cursor: pointer;
}
.personal-center{
  height:100%;
  box-sizing:border-box;
  padding-top:24px;
  overflow:auto;
}
.box{
  width:1136px;
  height:464px;
  box-sizing:border-box;
  margin:0 auto;
  background:#fff;
  border-radius:8px;
}
.box-left,.box-right{
  box-sizing:border-box;
  height:464px;
  float:left;
}
/* 左边头像展示区 */
.box-left{
  padding-top:116px;
  width:576px;
}
.box-left .img-box{
  width:98px;
  height:98px;
  margin:0 auto;
  margin-bottom:64px;
  overflow: hidden;
  border-radius:50px;
  border:1px solid #DFE5EB;
}
.box-left .img-box img{
  width:98px;
  height:98px;
  object-fit: cover;
}
.box-left .upload-box{
  width:320px;
  height:104px;
  margin:0 auto;
}
  /* 右部表单区 */
.box-right{
  width:560px;
}
.box-right .el-form{
  padding:64px 64px 0 0;
}
.btn-container{
  text-align: center;
}
.btn{
  margin-top:50px
  
}
.btn{
  width:120px;
  color:#4D84FF;
  border-color:#4D84FF;
  background:rgba(255,255,255,0);
}
.btn:hover,.modify-box .btn:focus{
  color:#fff;
  background:#4D84FF;
}
.btn:active{
  color:#fff;
  background:rgba(77,132,255,0.8);
}

</style>


