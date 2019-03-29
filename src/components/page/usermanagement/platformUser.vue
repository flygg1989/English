<template>
  <div class="usermanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">创建平台用户</el-button>
        </div>
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入要查询的用户名"
            prefix-icon="el-icon-search"
            v-model="searchValue">
          </el-input>
          <el-button type="primary" @click="handleSreach" class="search-btn">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        height="100%"
        empty-text="没有更多数据了"
        header-row-class-name="table-header"
        style="width:100%;">
        <el-table-column
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="id"
          label="用户ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名称"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="department"
          label="所属部门"
          min-width="144">
          <template slot-scope="scope">
            <div v-if="scope.row.department">{{ scope.row.department.name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_group"
          label="所属角色"
          min-width="144">
          <template slot-scope="scope">
            <div v-if="scope.row.user_group">{{ scope.row.user_group.name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否禁用"
          :formatter="formatter"
          min-width="144">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="150">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div class="table-footer">
        <!--<div class="footer-left">-->
          <!--<el-button plain type="primary">刷新</el-button>-->
          <!--<el-button plain type="primary" @click="handleShield">屏蔽</el-button>-->
          <!--<el-button plain type="primary">取消屏蔽</el-button>-->
        <!--</div>-->
        <div class="footer-right">
          <el-pagination
            background
            v-show="tableList.length!==0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <!--创建 编辑弹窗--->
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="35%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名称"  prop="name">
              <el-input v-model.trim="form.name" clearable @change="handlenane"></el-input>
          </el-form-item>
          <el-form-item label="登录密码"  prop="password">
              <el-input v-model.trim="form.password" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系方式"  prop="phone">
              <el-input v-model.trim="form.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别"  prop="sex">
              <el-select v-model="form.sex" :label="form.sex ==1 ?'男':'女'" placeholder="请选择">
                  <el-option key="1" label="男" value="1"></el-option>
                  <el-option key="2" label="女" value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="组织架构"  prop="department_id">
              <el-select v-model="form.department_id"  placeholder="请选择">
                  <el-option v-for="(item,index) in departmentlist" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="角色"  prop="user_group_id">
              <el-select v-model="form.user_group_id"  placeholder="请选择">
                  <el-option v-for="(item,index) in userRoleslist" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="是否禁用"  prop="status">
              <el-select v-model="form.status" :label="form.status ==1 ?'否':'是'" placeholder="请选择">
                  <el-option key="1" label="否" value="1"></el-option>
                  <el-option key="2" label="是" value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="头像" >
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              accept="image/jpeg,image/png"
              name="upload_resource"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.headimg" :src="form.headimg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="editVisible = false">取消</el-button>
            <el-button type="primary" v-if="submitstate==1" @click="submitForm('form')">创建</el-button>
            <el-button type="primary" v-if="submitstate==2" @click="submitedit('form')">编辑</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from '@/utils/api'
import axios from 'axios';   
export default {
  data(){
    return {
      searchValue:"",
      tableList:[],
      currentPage:1,
      total:0,
      pageSize:5,

      departmentlist:[], //组织列表
      userRoleslist:[], //角色列表

      editVisible:false,
      title:'',
      submitstate:1,
      
      //新建
      form:{
        headimg:'',
        id:'',
        user_id:'',
        name:'',
        password: '',
        new_password:'',
        phone: '',
        sex: '',
        status: '',
        user_group_id:'',
        department_id:'',
        user_group:{
          id: '',
          name: '',
        }
      },

      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=headimg',
      
      rules:{
        name:[
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        password:[
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min:6,  message: '密码长度不能少于6位', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {min: 11, max: 11, message: '长度为11位', trigger: 'blur'}
        ],
        user_group_id:[
          {required: true, message: '请选择角色', trigger: 'change'},
        ],
        department_id:[
          {required: true, message: '请选择组织', trigger: 'change'},
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
      this.gettableList(); // 获取表格数据
      this.getdepartmentlist(); //获取组织架构
      this.getuserRoleslist(); //获取角色列表
  },

  methods: {
    //获取表格数据
    gettableList(){
      api.request({
          url: "getUserList",
          method: "POST",
          data:{
            page_size:this.pageSize,
            page_num:this.currentPage,
          }
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            this.tableList =res.data.data.list;
            this.total=res.data.data.current_page_num;
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //获取组织架构
    getdepartmentlist(){
      api.request({
          url: "getDepartmentInfo",
          method: "POST"
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            this.departmentlist =res.data.data
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //获取角色列表
    getuserRoleslist(){
      api.request({
          url: "getAllUserGroups",
          method: "POST",
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            this.userRoleslist =res.data.data;
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

      async getSreach(){
          try{
              let res =  await api.request({
                  url:'getUserList',
                  method:'POST',
                  data:{
                      name:this.searchValue,
                      page_size:this.pageSize,
                      page_num:this.currentPage,
                  }
              });
              console.log(res)
              this.tableList=res.data.data.list;
              this.total=res.data.data.current_page_num;
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },

      //判断状态
      formatter(row, column) {
          return row.status == 1 ? '否' : row.status == 2 ? '是' : '未知';
      },

      //判断用户名是否重名
      handlenane(){
        api.request({
            url: "checkUserName",
            method: "POST",
            data:{
              user_type:1,
              name:this.form.name,
            }
        }).then(res=>{
            //console.log(res)
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
            }
        },res => {
            this.$notify.error({
            title: "错误",
            message: "数据请求失败"
            });
        })
      },

      //打开创建窗口
      handlefound(){
        this.title="创建用户";
        this.submitstate=1,
        this.form={
          headimg:'',
          id:'',
          user_id:'',
          name:'',
          password: '',
          new_password:'',
          phone: '',
          sex: '',
          status: '',
          user_group_id:'',
          department_id:'',
        }
        this.editVisible=true;
      },

      //图片上传前
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$notify.error({
              title: "错误",
              message: "上传头像图片大小不能超过 2MB!！"
          })
        }
        return isLt2M;
      },
      
      //上传成功
      handleAvatarSuccess(res, file) {
       // console.log(res)
        this.form.headimg = res.data.src
      },
      

      //创建提交
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.form.headimg ==null || this.form.headimg==""){
                  this.$notify.error({
                      title: "错误",
                      message: "头像不能为空！"
                  })
                  return false;
                }else{
                  api.request({
                      url: "createUser",
                      method: "POST",
                      data:this.form,
                  }).then(res=>{
                      //console.log(res)
                      if(res.data.state ==true){
                         this.$notify({
                            title: "成功",
                            message: res.data.message,
                            type: 'success'
                          });
                          this.gettableList();
                          this.editVisible =false;
                      }
                  },res => {
                      this.$notify.error({
                      title: "错误",
                      message: "数据请求失败"
                      });
                  })
                }
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },

      //打开编辑弹窗
      handleedit(row){
        this.title="编辑用户";
        this.submitstate=2;
        this.form=row;
        this.form.user_id=row.id;
        this.form.new_password = this.form.password;
        this.editVisible=true;
      },

      //编辑
      submitedit(formName){
        this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.form.headimg ==null || this.form.headimg==""){
                  this.$notify.error({
                      title: "错误",
                      message: "头像不能为空！"
                  })
                  return false;
                }else{
                  api.request({
                      url: "editUserInfo",
                      method: "POST",
                      data:this.form,
                  }).then(res=>{
                      //console.log(res)
                      if(res.data.state ==true){
                         this.$notify({
                            title: "成功",
                            message: res.data.message,
                            type: 'success'
                          });
                          this.gettableList();
                          this.editVisible =false;
                      }
                  },res => {
                      this.$notify.error({
                      title: "错误",
                      message: "数据请求失败"
                      });
                  })
                }
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      
      //删除
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.request({
              url: "deleteUser",
              method: "POST",
              data:{
                user_id:row.id
              }
          }).then(res=>{
              //console.log(res)
              if(res.data.state ==true){
                this.$notify({
                  title: "成功",
                  message: res.data.message,
                  type: 'success'
                });
                this.gettableList();
              }
          },res => {
              this.$notify.error({
              title: "错误",
              message: "数据请求失败"
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //搜索
      handleSreach(){
          this.searchValue? this.getSreach():this.$notify.error({
              title: "错误",
              message: "请输入关键字"
          })
      },

      //每页数量
    handleSizeChange(val) {
        this.pageSize=val
        this.currentPage=1
        this.gettableList();
    },
      //当前选择页
    handleCurrentChange(val) {
      this.pageSize = val;
      this.gettableList();
    }
  },
}
</script>
<style>
.usermanagement{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
