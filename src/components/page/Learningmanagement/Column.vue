<template>
  <div class="usermanagement">
    <div class="notabs-content">
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
          label="栏目ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="栏目名称"
          min-width="144">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="150">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
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
      <!--创建 编辑弹窗--->
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
        <el-form v-if="editVisible" ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="栏目名称"  prop="type_name">
              <el-input v-model.trim="form.type_name"></el-input>
          </el-form-item>
          <el-form-item label="排序"  prop="sorts">
              <el-input v-model.trim="form.sorts" placeholder="排序号，小的排在前"></el-input>
          </el-form-item>
          <el-form-item label="缩略图"  prop="thumb">
              <el-input v-show="false" v-model.trim="form.thumb"></el-input>
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
          <el-form-item label="轮播图"  prop="scroll_pic">
              <el-input v-show="false" v-model.trim="form.scroll_pic"></el-input>
              <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              accept="image/jpeg,image/png"
              name="upload_resource"
              :show-file-list="false"
              :on-success="handleAvatarSuccessscroll"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.scroll_pic" :src="form.scroll_pic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="editVisible = false">取消</el-button>
            <el-button type="primary" v-if="submitstate==1" @click="submitForm('form')">创建</el-button>
            <el-button type="primary" v-if="submitstate==2" @click="submitedit('form')">保存</el-button>
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
        type_id:'',
        type_name:'',
        sorts:'',
        thumb:'',
        scroll_pic:'',
      },
      
      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=pictures',

      rules:{
        type_name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        thumb:[
          {required: true, message: '请上传缩略图', trigger: 'blur'},
        ],
        scroll_pic:[
          {required: true, message: '请上传轮播图', trigger: 'blur'},
        ],
      },
    }
  },
  created() {
      this.gettableList(); // 获取表格数据

  },
  methods: {
    // 获取表格数据
    gettableList(){
        api.request({
          url: "learnTypeList",
          method: "get",
      }).then(res=>{
          //console.log(res)
          if(res.data.state ==true){
            this.tableList =res.data.data;
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //是否禁用
    switchList(val){
        console.log(val)
        if(val.status == 1){
          val.status =2
        }else{
          val.status =1
        }
        
        api.request({
          url: "changeStatus",
          method: "get",
          data:{
            status:val.status,
            type_id:val.id,
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
          }else{
            this.$notify.error({
            title: "错误",
            message: res.data.message
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
  handleAvatarSuccess(res, file, fileList) {
    //console.log(res)
    this.form.thumb = res.data.src
  },

  handleAvatarSuccessscroll(res){
    this.form.scroll_pic = res.data.src
  },

  //编辑
  handleedit(row){
    //console.log(row)
      this.title="修改学习栏目";
      this.submitstate=2;
      this.form=row;
      this.form.type_id =row.id;
      this.editVisible=true;
  },

  //编辑提交
  submitedit(formName){
    this.$refs[formName].validate((valid) => {
        if (valid) {
            api.request({
                url: "modifyLearnType",
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
        } else {
            console.log('error submit!!');
            return false;
        }
    });
  },
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
