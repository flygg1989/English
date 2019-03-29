<template>
  <div class="Menumanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">新建角色</el-button>
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
          label="ID"
          min-width="50">
        </el-table-column>
        <el-table-column
          prop="pid"
          label="上级ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
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
        min-width="220">
        <template slot-scope="scope">
          <el-button type="success" @click="authorize(scope.$index, scope.row)">授权</el-button>
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      
      <!--创建 编辑弹窗--->
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色名称"  prop="name">
              <el-input v-model.trim="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item label="上级id"  prop="pid">
              <el-input v-model.trim="form.pid" placeholder="组织的上级id，第一级组织默认为0"></el-input>
          </el-form-item>
          <el-form-item label="排序"  prop="sort">
              <el-input v-model.trim="form.sort" placeholder="排序"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="role_ids">
            <el-select v-model="form.role_ids" multiple placeholder="请选择">
              <el-option
                v-for="item in funlist"
                :key="item.id"
                :label="item.role_name"
                :value="item.id">
              </el-option>
            </el-select>
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
      <!-- 授权 弹出框 -->
        <el-dialog title="用户权限" :visible.sync="seteditVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="formset" :model="formset" label-width="80px">
                <el-tree
                  :data="functionlist"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :default-checked-keys="formset.roleIds"
                  ref="tree"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="seteditVisible = false">取 消</el-button>
                <el-button type="primary" @click="setEdit">确 定</el-button>
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
      functionlist:[], //权限列表
      currentPage:1,
      total:0,
      pageSize:5,

      editVisible:false,
      title:'',
      submitstate:1,
      
      //新建
      form:{
        name:'',
        pid:'',
        status:1,
        sort:'',
        role_ids:[],
      },

      seteditVisible:false, //权限弹窗
      functionlist:[], //树形权限列表
      funlist:[], //字符串权限列表
      //权限
      defaultProps: {
        children: 'children',
        label: 'role_name'
      },
      //角色的权限
      formset:{
          functionIds:[],
          roleIds:[],
      },
      user_group_id:'', //角色id
      pid:'',
      status:'',
      
      rules:{
        name:[
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        pid:[
          {required: true, message: '请输入上级id', trigger: 'blur'},
        ],
        role_ids:[
          {required: true, message: '请选择权限', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
      this.gettableList(); //获取表格数据
      this.getfunctionlist(); //获取权限列表
  },

  methods: {
    //获取表格数据
    gettableList(){
      api.request({
          url: "getAllUserGroups",
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

    //获取权限列表
    getfunctionlist(){
      api.request({
          url: "getAllRoles",
          method: "POST"
      }).then(res=>{
          // console.log(res.data.data)
          if(res.data.state ==true){
            this.funlist=res.data.data,
            // console.log(this.funlist)
            //将json串转换成树形结构
            function transData(a, idStr, pidStr, childrenStr) {
                var r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;
                for (; i < len; i++) {
                    hash[a[i][id]] = a[i];
                }
                for (; j < len; j++) {
                    var aVal = a[j], hashVP = hash[aVal[pid]];
                    if (hashVP) {
                        !hashVP[children] && (hashVP[children] = []);
                        hashVP[children].push(aVal);
                    } else {
                        r.push(aVal);
                    }
                }
                return r;
            }
            this.functionlist =transData(res.data.data , 'id', 'pid', 'children');
            //console.log(this.functionlist);
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

    //获取角色权限列表
    authorize(index, row) {
      console.log(row)
      this.formset.roleIds=[];
      this.user_group_id=row.id;
      this.pid=row.pid;
      this.status=row.status;
      this.seteditVisible =true
      //获取所有权限
      api.request({
          url: "getAllRoles",
          method: "POST"
      }).then(res=>{
          // console.log(res.data.data)
          if(res.data.state ==true){
            //将json串转换成树形结构
            function transData(a, idStr, pidStr, childrenStr) {
                var r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;
                for (; i < len; i++) {
                    hash[a[i][id]] = a[i];
                }
                for (; j < len; j++) {
                    var aVal = a[j], hashVP = hash[aVal[pid]];
                    if (hashVP) {
                        !hashVP[children] && (hashVP[children] = []);
                        hashVP[children].push(aVal);
                    } else {
                        r.push(aVal);
                    }
                }
                return r;
            }
            this.functionlist =transData(res.data.data , 'id', 'pid', 'children');
            // console.log(this.functionlist);
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })

      //获取角色权限
      api.request({
          url: "getUserGroupRoleById",
          method: "POST",
          data:{
            user_group_id:row.id,
          }
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
            for (var i = 0;res.data.data.length >= i; i++) {
              this.formset.roleIds =this.formset.roleIds.concat(res.data.data[i].id);
            }
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //选择角色权限 确定
    setEdit(){
        this.formset.functionIds=this.$refs.tree.getCheckedKeys();
        api.request({
          url: "editUserGroupRole",
          method: "POST",
          data:{
            role_ids:this.formset.functionIds.join(','),
            pid:this.pid,
            status:this.status,
            user_group_id:this.user_group_id,
          }
      }).then(res=>{
          //console.log(res)
          if(res.data.state ==true){
            this.$notify({
                title: "成功",
                message: res.data.message,
                type: 'success'
            });
            this.seteditVisible = false;
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
        this.title="新建角色";
        this.submitstate=1,
        this.form={
          name:'',
          pid:'',
          status:1,
          sort:'',
          role_ids:[],
        }
        this.editVisible=true;
      },

      //创建提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              api.request({
                url: "createUserGroupRole",
                method: "POST",
                data:{
                  pid:this.form.pid,
                  status:this.form.status,
                  sort:this.form.sort,
                  role_ids:this.form.role_ids.join(','),
                  name:this.form.name,
                },
            }).then(res=>{
                console.log(res)
                if(res.data.state ==true){
                  this.gettableList();
                  this.$notify({
                    title: "成功",
                    message:res.data.message,
                    type: 'success'
                });
                this.editVisible =false;
                }
            },res => {
                this.$notify.error({
                title: "错误",
                message: "数据请求失败"
                });
            })  
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },

      //编辑
      handleedit(row){
        this.title="编辑角色";
        this.submitstate=2;
        this.form=row;
        this.user_group_id=row.id,
        this.form.role_ids=[],
        this.editVisible=true;
      },

      //编辑提交
      submitedit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              api.request({
                url: "editUserGroupRole",
                method: "POST",
                data:{
                  user_group_id:this.user_group_id,
                  pid:this.form.pid,
                  status:this.form.status,
                  sort:this.form.sort,
                  role_ids:this.form.role_ids.join(','),
                  name:this.form.name,
                },
            }).then(res=>{
                console.log(res)
                if(res.data.state ==true){
                  this.gettableList();
                  this.$notify({
                    title: "成功",
                    message:res.data.message,
                    type: 'success'
                });
                this.editVisible =false;
                }
            },res => {
                this.$notify.error({
                title: "错误",
                message: "数据请求失败"
                });
            })  
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
              url: "deleteUserGroup",
              method: "POST",
              data:{
                user_group_id:row.id
              },
          }).then(res=>{
              //console.log(res.data.data)
              if(res.data.state ==true){
                this.gettableList();
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
