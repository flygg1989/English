<template>
  <div class="personal-center">
    <div class="box" v-loading="isLoad">
      <div class="box-left">
        <div class="img-box">
          <img :src="form.headimg">
        </div>
        <el-upload
          v-show="!editingstatus"
          class="upload-box"
          :action="uploadImg"
          accept="image/jpeg,image/png"
          name="upload_resource"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <div class="box-inline">
            <img src="static/img/icon-photo.png">
            <div class="el-upload__text">点击上传个人头像</div>
          </div>
        </el-upload>
      </div>
      <div class="box-right">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model.trim="form.name" :disabled="editingstatus">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
              <el-input v-model.number="form.phone" :disabled="editingstatus"></el-input>
          </el-form-item>
          <el-form-item label="性别"  prop="sex">
              <el-select v-model="form.sex" :disabled="editingstatus" placeholder="请选择">
                  <el-option :key="1" label="男" :value="1"></el-option>
                  <el-option :key="2" label="女" :value="2"></el-option>
              </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否禁用"  prop="status">
              <el-select v-model="form.status" :disabled="editingstatus" placeholder="请选择">
                  <el-option :key="1" label="否" :value="1"></el-option>
                  <el-option :key="2" label="是" :value="2"></el-option>
              </el-select>
          </el-form-item> -->
        </el-form>

        <div class="el-dialog__footer editPersonal">
          <span slot="footer" class="dialog-footer">
              <el-button type="" v-show="!editingstatus" @click="handlecancel">取消</el-button>
              <el-button type="primary" v-show="editingstatus" @click="handleedit">修改</el-button>
              <el-button type="primary" v-show="!editingstatus" @click="submitedit('form')">提交</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import api from '@/utils/api'

import Bus from "@/components/common/bus.js";

export default {
  data(){
    var checkPhone = (rule, value, callback) => {
      if (value ==null && value =='') {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        //console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      isLoad:false,
      imgUrl:'',
      base64:'',
      API:domain.testUrl, //全局接口
      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=headimg',
      dialogFormVisible: false,
      dialogPassword:false,
        edit1:false,
        edit2:false,
        tip1:{
          show:false,
          content:''
        },
      form:{
        name:'',
        phone:"",
        headimg:'static/img/headimg.png',
        sex:null,
        status:null,
      },
      
      editingstatus: true,  //控制弹框显示隐藏
      rules:{
        name:[
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        sex:[
          {required: true, message: '请选择性别', trigger: 'change'},
        ],
        status:[
          {required: true, message: '请选择是否禁用', trigger: 'change'},
        ],
      },
    }
  },
  created() {
      this.getPersonal(); // 获取个人数据
  },
  methods: {
    // 获取个人数据
    getPersonal(){
      this.isLoad = true
      api.request({
          url: "getUserDetail",
          method: "POST",
          data:{
            user_id:localStorage.getItem('user_id'),
          }
      }).then(res=>{
          //console.log(res)
          if(res.data.state ==true){
            this.form=res.data.data
            this.isLoad = false
          }
      },res => {
          this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
          this.isLoad = false
      })
    },
    
     
    //上传成功
    handleAvatarSuccess(res,file) {
      //console.log(res)
      this.isLoad = true
      if(res.state ==true){
        this.$notify({
          title: "成功",
          message: res.message,
          type: 'success'
        });
        this.form.headimg = res.data.src;
        this.isLoad = false
      }
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

    //点击修改
    handleedit(){
      this.editingstatus=false;
    },

    //提交新的修改
    submitedit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.isLoad = true
                api.request({
                    url: "editUserOwnerInfo",
                    method: "POST",
                    // data:this.form,
                    data:{
                      name:this.form.name,
                      phone:this.form.phone,
                      headimg:this.form.headimg,
                      sex:this.form.sex,
                      status:this.form.status,
                    }
                }).then(res=>{
                    //console.log(res)
                    if(res.data.state ==true){
                        this.$notify({
                          title: "成功",
                          message: res.data.message,
                          type: 'success'
                        });
                        this.isLoad = false
                        localStorage.removeItem('headimg')
                        localStorage.setItem('headimg',this.form.headimg);
                        Bus.$emit('sendPersonal', true)
                        this.getPersonal();
                        this.editingstatus =true;
                    }
                },res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                    this.isLoad = false
                })
            } else {
                console.log('error submit!!');
                this.isLoad = false
                return false;
            }
        });
    },

    //点击取消
    handlecancel(){
      this.getPersonal();
      this.editingstatus =true;
      this.$refs['form'].clearValidate()
    },
  },
 
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
  /* padding-top:24px; */
  overflow:auto;
}
.box{
  /* width:1136px; */
  width:100%;
  height:100%;
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
.box-left .el-upload{
    line-height: auto;
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
.editPersonal{
  padding: 20px 70px 20px;
  text-align: center;
}
.personal-center .el-form .el-form-item{
  margin-top:25px;
}
</style>


