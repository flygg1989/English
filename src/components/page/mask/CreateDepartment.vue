<template>
    <div class="CreateDepartment">
        <el-dialog :title="title=='新建部门'?title='新建部门':title='修改部门'" :visible.sync="editVisible" :close-on-click-modal="false" width="560px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="100px" class="ms-content">
                <el-form-item label="部门名称" prop="department">
                    <el-input v-model.trim="ruleForm.department"></el-input>
                </el-form-item>
                <el-form-item label="责任人"  prop="Personliable" >
                    <el-input v-model.trim="ruleForm.Personliable"></el-input>
                </el-form-item>
                 <el-form-item label="手机号" prop="phone" >
                    <el-input v-model.trim="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱"  prop="email" >
                    <el-input v-model.trim="ruleForm.email"></el-input>
                </el-form-item>
                 <el-form-item label="部门分类" prop="branch" >
                    <el-select v-model="ruleForm.branch" clearable placeholder="请选择" class="select_department">
                        <el-option
                        v-for="item in departmentList"
                        :key="item.id"
                        :label="item.type_name"
                        :value="item.id" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行政级别" >
                    <el-select v-model="provinceId" clearable  placeholder="请选择" class="selsct_city">
                        <el-option
                        v-for="item in provinceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="cityId" clearable  placeholder="请选择"  class="selsct_city">
                        <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="areaId" clearable  placeholder="请选择"  class="selsct_city">
                        <el-option
                        v-for="item in areaList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="默认密码" prop="Defaultpassword" v-if="pagestate == 1">
                    <el-input v-model.trim="ruleForm.Defaultpassword" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="上传部门头像" >
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/png"
                        :action="uploadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                </el-form-item>
                <div class="line-top"></div>
                <div class="login-btn">
                    <el-button type="primary" v-if="pagestate==1" @click="submitForm('ruleForm')">提 交</el-button>
                    <el-button type="primary" v-if="pagestate == 2" @click="reviseForm('ruleForm')">修 改</el-button>
                </div>
            </el-form>

        </el-dialog>  
    </div>
</template>

<script>
import axios from 'axios';
import api from "@/utils/api";
import Bus from "@/components/common/bus.js";
export default {
    data() {
        return {
            API:domain.testUrl,   //全局接口
            editVisible: false,  //控制弹框显示隐藏
            pagestate:'',  //1创建 2修改
            user_id:'',
            title:'',
            ruleForm: {
                department: '',
                Personliable: '',
                phone:'',
                email: '',
                branch: '',
                Defaultpassword: '',
                options:'',
            },
            rules: {
                department: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                Personliable: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ],
                Defaultpassword: [
                    { required: true, message: '未填写', trigger: 'blur' }
                ]
            },
            
            departmentList:[],  //部门分类
            provinceId:'',  //省id
            provinceList:[],//省列表
            cityId:'',     //市id
            cityList:[],    //市列表
            areaId:'',      //区id
            areaList:[],    //区列表
            //图片上传
            imageUrl: '',
            uploadImg:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
        }
    }, 
    created(){
        //接受上级页面传过来的信息
        Bus.$on('sendstate',(data)=>{
            console.log(data)
            this.editVisible =data.state;
            this.title =data.value;
            this.ruleForm={
                department: data.value.dept_name,
                Personliable: data.value.uname,
                phone:data.value.mobile,
                email: data.value.email,
            }
            this.user_id =data.value.user_id;
            this.imageUrl =data.value.headimg;
            if(data.value.dept_name){
               this.pagestate = 2 
            }else{
                this.pagestate = 1
            }
            
            
        });
        this.getcategory();   //获取部门分类
        this.getProvince();   //获取省市区 /获取省
    },
    watch:{
        //根据省获取市
        provinceId(newid,oldid){
            var self =this;
            if(newid ==null || newid ==""){
                console.log('空')
            }else{
                self.cityId ='',
                self.areaId ='',
                //获取市
                api.request({
                    url: 'province?token='+localStorage.getItem('sk')+'&pid='+this.provinceId+'&type=2',
                    method: "GET"
                })
                .then(
                res => {
                    if (res.status == 200) {
                        self.cityList =res.data.data.common
                    }
                },
                res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                });
            }
        },
        //根据市获取区
        cityId(newedid,oldedid){
            var self =this;
            if(newedid ==null || newedid ==""){
                console.log('空')
            }else{
                self.areaId ='',
                //获取区
                api.request({
                    url: 'province?token='+localStorage.getItem('sk')+'&pid='+this.cityId+'&type=3',
                    method: "GET"
                })
                .then(
                res => {
                    if (res.status == 200) {
                        //console.log(res.data.data.common)
                        self.areaList =res.data.data.common
                        if(res.data.data.common == null || res.data.data.common == ''){
                            self.areaId = ''
                        }else{
                            self.areaList =res.data.data.common
                        }
                    }
                },
                res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                });
            }
        }
    },
    methods: {
        //获取部门分类
        getcategory(){
            var self =this;
            axios({
                url:this.API+ 'dept/category?token='+localStorage.getItem('sk'),
                method: 'GET',
                data: '',
            }).then(function (res) {
                //console.log(res);
                if (res.status == 200) {
                    self.departmentList =res.data.data.common
                }
            })
            .catch(function (err) {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
            })
        },
        //获取省市区  获取省
        getProvince(){
            var self =this;
            //获取省
            axios({
                url:this.API+ 'province?token='+localStorage.getItem('sk')+'&pid=0&type=1',
                method: 'GET',
                data: '',
            }).then(function (res) {
                //console.log(res);
                if (res.status == 200) {
                    self.provinceList =res.data.data.common;
                }
            })
            .catch(function (err) {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
            })
        },
        
        //图片上传 成功
        handleAvatarSuccess(res, file) {
            //console.log(res)
            if(res.state == true){
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                });
                this.imageUrl = res.data.common.src;
            }
            
        },
        //图片上传限制
        beforeAvatarUpload(file) {
            //console.log(file)
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (isJPG || isPNG) {
                
            }else{
                this.$notify.error({
                    title: "错误",
                    message: "上传头像图片只能是 JPG 或 PNG 格式!"
                });
                return false
            }
            if (!isLt2M) {
                this.$notify.error({
                    title: "错误",
                    message: "上传头像图片大小不能超过2MB!"
                });
            }
        },
        //提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                  if(this.cityid == '' || this.cityid == null){
                      this.cityid = 0;
                      console.log(this.cityid +'city')
                  };
                  if(this.areaId == '' || this.areaId == null){
                      this.areaId =0;
                      console.log(this.areaId +'area')
                  };
                //console.log(valid)
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");  // 邮箱正则表达式
                if (valid) {
                  if(!(/^1[34578]\d{9}$/.test(this.ruleForm.phone))){
                    this.$notify.error({
                        title: '错误',
                        message: '手机号码有误'
                    });
                  }else if(!reg.test(this.ruleForm.email)){
                    this.$notify.error({
                        title: '错误',
                        message: '邮箱格式错误'
                    });
                  }else if(this.ruleForm.branch == '' || this.ruleForm.branch == null){
                     this.$notify.error({
                        title: '错误',
                        message: '部门分类未选择'
                    }); 
                  }else if(this.provinceId == '' || this.provinceId == null){
                      this.$notify.error({
                        title: '错误',
                        message: '省份未选择'
                    });
                  }else if(this.imageUrl ==null || this.imageUrl ==''){
                      console.log(777)
                      this.$notify.error({
                        title: '错误',
                        message: '请上传头像'
                      });
                  }else{
                    var self =this;
                    axios({
                        url:this.API+ 'dept/save?token='+localStorage.getItem('sk'),
                        method: 'POST',
                        data:{
                            "dept_name":this.ruleForm.department,
                            "mobile":this.ruleForm.phone,
                            "email":this.ruleForm.email,
                            "pass":this.ruleForm.Defaultpassword,
                            "uname":this.ruleForm.Personliable,
                            "dtypeid":this.ruleForm.branch,
                            "province":this.provinceId,
                            "city":this.cityId,
                            "region":this.areaId,
                            "headimg":this.imageUrl,
                        },
                    }).then(function (res) {
                        // console.log(res);
                        if (res.status == 200) {
                            if(res.data.state ==false){
                                self.$notify.error({
                                    title: '错误',
                                    message: res.data.message
                                });
                            }else{
                                self.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success'
                                }); 
                                self.editVisible =false;
                                Bus.$emit('detailChange',true);
                            }
                            
                        }
                    })
                    .catch(function (err) {
                        self.$notify.error({
                            title: "错误",
                            message: "数据请求失败"
                        });
                    })
                  } 
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '创建部门失败'
                    });
                    return false;
                }
            });
        },

        //修改
        reviseForm(formName){
             this.$refs[formName].validate((valid) => {
                  if(this.cityid == '' || this.cityid == null){
                      this.cityid = 0;
                      console.log(this.cityid +'city')
                  };
                  if(this.areaId == '' || this.areaId == null){
                      this.areaId =0;
                      console.log(this.areaId +'area')
                  };
                //console.log(valid)
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");  // 邮箱正则表达式
                if (valid) {
                  if(!(/^1[34578]\d{9}$/.test(this.ruleForm.phone))){
                    this.$notify.error({
                        title: '错误',
                        message: '手机号码有误'
                    });
                  }else if(!reg.test(this.ruleForm.email)){
                    this.$notify.error({
                        title: '错误',
                        message: '邮箱格式错误'
                    });
                  }else if(this.ruleForm.branch == '' || this.ruleForm.branch == null){
                     this.$notify.error({
                        title: '错误',
                        message: '部门分类未选择'
                    }); 
                  }else if(this.provinceId == '' || this.provinceId == null){
                      this.$notify.error({
                        title: '错误',
                        message: '省份未选择'
                    });
                  }else if(this.imageUrl ==null || this.imageUrl ==''){
                      console.log(777)
                      this.$notify.error({
                        title: '错误',
                        message: '请上传头像'
                      });
                  }else{
                    var self =this;
                    axios({
                        url:this.API+ 'dept/save?token='+localStorage.getItem('sk'),
                        method: 'POST',
                        data:{
                            "id":this.user_id,
                            "dept_name":this.ruleForm.department,
                            "mobile":this.ruleForm.phone,
                            "email":this.ruleForm.email,
                            "pass":this.ruleForm.Defaultpassword,
                            "uname":this.ruleForm.Personliable,
                            "dtypeid":this.ruleForm.branch,
                            "province":this.provinceId,
                            "city":this.cityId,
                            "region":this.areaId,
                            "headimg":this.imageUrl,
                        },
                    }).then(function (res) {
                        //console.log(res);
                        if (res.status == 200) {
                            if(res.data.state ==false){
                                self.$notify.error({
                                    title: '错误',
                                    message: res.data.message
                                });
                            }else{
                                self.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success'
                                }); 
                                self.editVisible =false;
                                Bus.$emit('detailChange',true);
                            }
                            
                        }
                    })
                    .catch(function (err) {
                        self.$notify.error({
                            title: "错误",
                            message: "数据请求失败"
                        });
                    })
                  } 
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '修改部门失败'
                    });
                    return false;
                }
            });
        },

        
    } 
}
</script>

<style scoped>
   .CreateDepartment .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .CreateDepartment .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .CreateDepartment .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .CreateDepartment .avatar {
    width: 178px;
    height: 178px;
    display: block;
  } 
</style>


