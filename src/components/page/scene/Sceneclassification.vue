<template>
  <div class="usermanagement">
    <div v-loading="isLoad" class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">创建分类</el-button>
        </div>
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入要查询的内容"
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
          label="场景分类ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="场景分类名称"
          min-width="144">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="220">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          <el-switch
            :value="scope.row.status==1?true:false"
            inactive-text="启用禁用"
            active-color="#3CD970"
            @change="switchList(scope.row)"
            inactive-color="#DFE5EB">
          </el-switch>
        </template>
      </el-table-column>
      </el-table>
      <div class="table-footer">
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
        <el-form v-if="editVisible" v-loading="formLoad" ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="分类名称"  prop="type_name">
              <el-input v-model.trim="form.type_name" clearable></el-input>
          </el-form-item>
          <el-form-item label="排序"  prop="sorts">
              <el-input v-model.trim="form.sorts" clearable></el-input>
          </el-form-item>
          <el-form-item label="缩略图" prop="thumb">
            <el-input v-show="false" v-model.trim="form.thumb" clearable></el-input>
             <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              accept="image/jpeg,image/png"
              name="upload_resource"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.thumb" :src="form.thumb" class="avatar">
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
      isLoad:false,
      formLoad:false,
      searchValue:"",
      tableList:[],
      page:1,
      total:0,
      pageSize:5,

      editVisible:false,
      title:'',
      submitstate:1,

      departmentlist:[], //组织列表
      
      //新建编辑
      form:{
        thumb: null,
        sorts:'',
        type_name:'',
        type_id:null,
      },

      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=pictures',
      
      rules:{
        type_name:[
          {required: true, message: '请输入场景名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ]
      },
    }
  },
  watch:{
    searchValue(val){
      console.log(val)
      if(val ==null && val ==''){
        this.gettableList();
      }
    },
  },
  created() {
      this.gettableList(); // 获取表格数据
  },

  methods: { 
    //获取表格数据
    gettableList(){
      this.isLoad = true
      api.request({
          url: "sceneTypeList",
          method: "get",
          data:{
            pageSize:this.pageSize,
            page:this.page,
          }
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            this.tableList =res.data.data.list;
            this.total=res.data.data.total;
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
      //console.log(res)
      this.formLoad = true
      if(res.state){
        this.form.thumb = res.data.src
        this.formLoad = false
      }
      
    },

    //是否禁用
    switchList(val){
      if(val.status == 1){
        val.status =2
      }else{
        val.status =1
      }
      api.request({
        url: "opSceneTypeStatus",
        method: "get",
        data:{
          status:val.status,
          type_id:val.id,
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
          }else{
            this.$notify.error({
              title: "错误",
              message: res.data.message
            });
            this.gettableList();
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
      this.title="创建场景分类";
      this.submitstate=1,
      this.form={
        thumb: null,
        sorts:'',
        type_name:'',
      }
      this.editVisible=true;
    },

    //创建提交
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.formLoad = true
                api.request({
                    url: "createSceneType",
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
                        this.formLoad = false
                    }
                },res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                    this.formLoad = false
                })
            } else {
                console.log('error submit!!');
                this.formLoad = false
                return false;
            }
        });
    },

    //编辑
    handleedit(row){
      //console.log(row)
      this.formLoad = true;
      this.editVisible=true;
      this.title="编辑场景分类";
      this.submitstate=2;
      this.$api.request({
					url: "sceneTypeDetail",
					method: "GET",
					data:{
            type_id:row.id
          }
				}).then(res => {
					if(res.data.state){
						res = res.data.data
            console.log(res)
            this.form =res;
            this.form.type_id=res.id;
						this.formLoad = false
					}else{
						this.dialogVisible = false
						this.formLoad = false
					}
				}).catch(err => {
					this.dialogVisible = false
					this.formLoad = false
				})
     
      
    },

    //编辑
    submitedit(formName){
      this.$refs[formName].validate((valid) => {
            if (valid) {
              this.formLoad = true
                api.request({
                    url: "modifySceneType",
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
                        this.formLoad = false
                    }
                },res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                    this.formLoad = false
                })
            } else {
                console.log('error submit!!');
                this.formLoad = false
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
        this.isLoad = true
        api.request({
            url: "delSceneType",
            method: "get",
            data:{
              type_id:row.id
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
              this.isLoad = false
            }
        },res => {
            this.$notify.error({
            title: "错误",
            message: "数据请求失败"
            });
            this.isLoad = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });   
        this.isLoad = false       
      });
    },
    //搜索
    handleSreach(){
      this.page = 1;
      if(this.searchValue !=null && this.searchValue !=''){
        this.getSreach()
      }else{
        this.gettableList();
      }
    },

    async getSreach(){
      api.request({
        url: "sceneTypeList",
        method: "GET",
        data:{
          pageSize:this.pageSize,
          page:this.page,
          type_name:this.searchValue,
        }
      }).then(res=>{
          //console.log(res)
          if(res.data.state ==true){
            this.tableList =res.data.data.list;
            this.total=res.data.data.total;
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //每页数量
    handleSizeChange(val) {
        this.pageSize=val;
        this.page =1;
        if(this.searchValue !=null && this.searchValue !=''){
          this.getSreach()
        }else{
          this.gettableList();
        }

    },
      //当前选择页
    handleCurrentChange(val) {
      this.page =val;
      if(this.searchValue !=null && this.searchValue !=''){
        this.getSreach()
      }else{
        this.gettableList();
      }
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
