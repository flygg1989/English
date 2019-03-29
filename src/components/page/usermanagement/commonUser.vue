<template>
  <div class="usermanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">创建普通用户</el-button>
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
          prop="account"
          label="名称"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="144">
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
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名称"  prop="account">
              <el-input v-model.trim="form.account" clearable @change="handlenane"></el-input>
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
export default {
  data(){
    return {
      searchValue:"",
      tableList:[],
      currentPage:1,
      total:0,
      pageSize:5,

      editVisible:false,
      title:'',
      submitstate:1,
      
      //新建
      form:{
        headimg: '',
        id:'',
        account:'',
        password: '',
        phone: '',
        sex: '',
        name:'',
        user_id:'',
        new_password:'',
      },

      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=headimg',
      
      rules:{
        account:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
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
        sex:[
          {required: true, message: '请选择性别', trigger: 'change'},
        ],
      },
    }
  },
  created() {
      this.gettableList(); // 获取表格数据
  },

  methods: { 
    //获取表格数据
    gettableList(){
      api.request({
          url: "getMemberList",
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
    
      async getSreach(){
          try{
              let res =  await api.request({
                  url:memberList,
                  method:'GET',
                  data:{
                      wd:this.searchValue
                  }
              });
              this.tableList=res.data.data.common.data
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },

      //判断男女
      formatter(row, column) {
          return row.sex == 1 ? '是' : row.sex == 2 ? '否' : '未知';
      },

      //判断用户名是否重名
      handlenane(){
        api.request({
            url: "checkUserName",
            method: "POST",
            data:{
              user_type:2,
              name:this.form.account,
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

      //打开创建窗口
      handlefound(){
        this.title="创建用户";
        this.submitstate=1,
        this.form={
          headimg: '',
          id:'',
          account:'',
          password: '',
          phone: '',
          sex: '',
          name:'',
          user_id:'',
          new_password:'',
          }
        this.editVisible=true;
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
                      url: "createMember",
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

      //编辑
      handleedit(row){
        //console.log(row)
        this.title="编辑用户";
        this.submitstate=2;
        this.form=row
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
                      data:{
                        name:this.form.account,
                        headimg:this.form.headimg,
                        phone:this.form.phone,
                        sex:this.form.sex,
                        user_id:this.form.id,
                        new_password:this.form.password
                      }
                  }).then(res=>{
                      console.log(res)
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
              url: "deleteMember",
              method: "POST",
              data:{
                member_id:row.id
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


      
      
      //初始化
    //   async initList(page,limit){
    //       console.log('init')
    //       try{
    //           let get = await api.request({
    //               url:memberList,
    //               method:'GET',
    //               data:{
    //                   page:page,
    //                   limit: limit,
    //               }
    //           })
    //           let arr=get.data.data.common.data
    //           this.tableList=arr
    //           this.total=get.data.data.common.total;
    //           console.log(  this.tableList)
    //       }catch (e) {
    //           this.$notify.error({
    //               title: "错误",
    //               message: "数据请求失败"
    //           })
    //       }
    //   },
    // filterHandler(value, row, column) {
    //   const property = column['property'];
    //   return row[property] === value;
    // },
    
      //每页数量
    handleSizeChange(val) {
        this.pageSize=val
        this.currentPage=1
      this.gettableList();

    },
      //当前选择页
    handleCurrentChange(val) {
      this.pageSize =val;
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
.usermanagement .operation{
  justify-content:flex-between;
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
