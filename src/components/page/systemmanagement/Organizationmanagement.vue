<template>
  <div class="Menumanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">新建部门</el-button>
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
          label="id"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="pid"
          label="上级Id"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
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
      <!--创建 编辑弹窗--->
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="部门名称"  prop="name">
              <el-input v-model.trim="form.name" placeholder="部门名称"></el-input>
          </el-form-item>
          <el-form-item label="上级id"  prop="pid">
              <el-input v-model.trim="form.pid" placeholder="部门的上级id，第一级部门默认为0"></el-input>
          </el-form-item>
          <el-form-item label="备注"  prop="remark">
              <el-input v-model.trim="form.remark" placeholder="该部门的备注"></el-input>
          </el-form-item>
         <el-form-item label="是否禁用" prop="status" v-if="submitstate==2">
            <el-select v-model="form.status"  placeholder="请选择">
                <el-option key="1" label="是" value="1"></el-option>
                <el-option key="2" label="否" value="2"></el-option>
            </el-select>
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

      editVisible:false,
      title:'',
      submitstate:1,
      
      //新建
      form:{
        id:'',
        name:'',
        pid:'',
        status:1,
        remark:'',
      },
      
      rules:{
        name:[
          {required: true, message: '请输入部门名称', trigger: 'blur'},
          {min:2, message: '名称长度最低为2位', trigger: 'blur'}
        ],
        pid:[
          {required: true, message: '请输入父级ID', trigger: 'blur'},
        ],
        status:[
          {required: true, message: '请选择是否禁用', trigger: 'change'},
        ],
      },
    }
  },
  
  created() {
      this.gettableList();
  },

  methods: {
    //获取表格数据
    gettableList(){
      api.request({
          url: "getDepartmentInfo",
          method: "POST"
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            this.tableList =res.data.data
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //判断状态
    formatter(row, column) {
        return row.status == 1 ? '否' : row.status == 2 ? '是' : '未知';
    },

      //打开创建窗口
      handlefound(){
        this.title="新建部门";
        this.submitstate=1,
        this.form={
          id:'',
          name:'',
          pid:'',
          status:1,
          remark:'',
        }
        this.editVisible=true;
      },

      //创建提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              api.request({
                  url: "createDepartment",
                  method: "POST",
                  data:{
                    name:this.form.name,
                    pid:this.form.pid,
                    status:this.form.status,
                    remark:this.form.remark
                  },
              }).then(res=>{
                  //console.log(res)
                  if(res.data.state ==true){
                    this.$notify({
                        title: "成功",
                        message:res.data.message,
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
            this.editVisible =false;
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },

      //编辑
      handleedit(row){
        this.title="编辑部门";
        this.submitstate=2;
        this.form=row
        console.log(this.form)
        this.editVisible=true;
      },

      //编辑提交
      submitedit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              api.request({
                  url: "editDepartment",
                  method: "POST",
                  data:{
                    department_id:this.form.id,
                    name:this.form.name,
                    pid:this.form.pid,
                    status:this.form.status,
                    remark:this.form.remark
                  },
              }).then(res=>{
                  console.log(res)
                  if(res.data.state ==true){
                    this.$notify({
                        title: "成功",
                        message:res.data.message,
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
            this.editVisible =false;
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },

      //删除
      handleDelete(index,row){
        //console.log(row.id)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            api.request({
                  url: "deleteDepartment",
                  method: "POST",
                  data:{
                    department_id:row.id,
                  },
              }).then(res=>{
                  //console.log(res)
                  if(res.data.state ==true){
                    this.$notify({
                        title: "成功",
                        message:res.data.message,
                        type: 'success'
                    });
                    this.gettableList();
                  }else{
                     this.$notify({
                      title: '警告',
                      message: res.data.message,
                      type: 'warning'
                    });
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
      
  },
 
}
</script>
<style>
.Menumanagement{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
.Menumanagement .operation{
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
