<template>
  <div class="usermanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">创建场景</el-button>
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
          label="场景ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="name"
          label="场景名称"
          min-width="144">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="150">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          <div class="table2-2">
            <el-switch
              :value="scope.row.status==2?true:false"
              inactive-text="禁用启用"
              active-color="#3CD970"
              @change="switchList(scope.row)"
              inactive-color="#DFE5EB">
            </el-switch>
          </div>
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
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="场景名称"  prop="name">
              <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="场景图片" >
             <el-upload
              class="avatar-uploader"
              :action="uploadimg"
              :show-file-list="false"
              accept="jpg,png,jpeg"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
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
    const memberList ='member'
    const changMeberStaut='member/save'
export default {
  data(){
    return {
      uploadimg:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
      searchValue:"",
      tableList:[
        {
          id:1,
          name:'张三',
          mobile:'1380008000',
          sex:'1',
          imageUrl: 'http://c.hiphotos.baidu.com/image/pic/item/a8773912b31bb0516a13ec1d387adab44aede0d4.jpg', 
        }
      ],
      currentPage:1,
      total:0,
      pageSize:5,

      editVisible:false,
      title:'',
      submitstate:1,
      
      //新建
      form:{
        name:'',
        loginpassword:'',
        mobile:'',
        sex:'',
        imageUrl: '', //头像
      },
      
      rules:{
        name:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        loginpassword:[
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min:6,  message: '密码长度不能少于6位', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {min: 11, max: 11, message: '长度为11位', trigger: 'blur'}
        ],
        sex:[
          {required: true, message: '请选择性别', trigger: 'change'},
        ],
      },
    }
  },
  methods: {
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
          return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '未知';
      },

      //上传成功后
      handleAvatarSuccess(res, file) {
          console.log(res)
        this.form.imageUrl = res.data.common.src;
      },

      //上传之前
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },

      //打开创建窗口
      handlefound(){
        this.title="创建场景";
        this.submitstate=1,
        this.form={
          name:'',
          loginpassword:'',
          email:'',
          mobile:'',
          sex:'',
          imageUrl:'',
        }
        this.editVisible=true;
      },

      //创建提交
      submitForm(formName) {
        if(this.form.imageUrl ==null || this.form.imageUrl==""){
          this.$notify.error({
              title: "错误",
              message: "头像不能为空！"
          })
          return false;
        }else{
          this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: 'success'
                });
                this.editVisible =false;
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
        }
      },

      //编辑
      handleedit(row){
        this.title="编辑场景";
        this.submitstate=2;
        this.form=row
        this.editVisible=true;
      },

      //删除
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableList.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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


      // handleSelectionChange(val){
      //     this.switchList=val
      //     console.log(this.switchList)
      // },
      //列表切换
      async switchList(item){
        console.log(item)
          item.status==1?item.status=2:item.status=1
          try{
              let postTime = await api.request({
                  url:changMeberStaut,
                  method:'GET',
                    data:{
                      id:item.m_id
                    }
              });
              this.$notify({
                  title: "成功",
                  message: "用户屏蔽切换成功",
                  type: 'success'
              });
              //this.initList()
          }catch (e) {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
      //初始化
      async initList(page,limit){
          console.log('init')
          try{
              let get = await api.request({
                  url:memberList,
                  method:'GET',
                  data:{
                      page:page,
                      limit: limit,
                  }
              })
              let arr=get.data.data.common.data
              this.tableList=arr
              this.total=get.data.data.common.total;
              console.log(  this.tableList)
          }catch (e) {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    async handleClick(row) {

    },
      //每页数量
    async handleSizeChange(val) {
        this.pageSize=val
        this.currentPage=1
      this.initList(this.currentPage,this.pageSize)

    },
      //当前选择页
    async handleCurrentChange(val) {

        this.initList(val,this.pageSize)
    }
  },
  mounted(){
    this.initList(this.currentPage,this.pageSize)
  }
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
