<template>
  <div class="question-type-settings">
    <div class="settings-item">
      <h2>添加类型</h2>
      <el-button type="primary"  @click=handleAdd>添加</el-button>
    </div>
    <ul class="type-settings-ul">
      <li v-for="(item,index) in typeList" :key="index">
        <h5>{{item.type_name}}</h5>
        <div>
          <el-button type="text"  @click=handleModify(item)>修改</el-button>
          <el-button type="text"  @click=handleDel(item.id)>删除</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import api from '@/utils/api'
const  QuestiontUrl='suggest/category'
const  delQUrl='suggest/category/delete'
const  newQUrl= 'suggest/category/save'
const  modifyUrl= 'suggest/category/save'
export default {
  name : "QuestionType",
  data(){
    return {
      typeList:[]
    }
  },
  watch:{
    
  },
  methods:{
      //初始化
    getList(){
         api.request({
           url: QuestiontUrl,
           method: "get",
        }).then(res=>{
            if(res.status == 200){
              this.typeList=res.data.data.common
              }
            },res => {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
                });
        })
    },
      //添加
    handleAdd(){
       this.$prompt('请输入新分类', '添加分类', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5]{2,4}$/,
          inputErrorMessage: '2到4位的汉字'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '添加: ' + value
          });
          //post 新分类
          api.request({
           url: newQUrl,
           method: "post",
           data:{
              name:value,
              is_show:true
            }
            }).then(res=>{
                if(res.status == 200){
                  this.getList()
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
            message: '取消输入'
          });       
        });
    },
      // 删除
     handleDel(id){
        console.log(id)
        this.$confirm('此操作将永久删除该问题类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         //删除分类
           api.request({
           url: delQUrl,
           method: "get",
           data:{
             id:id
           }
            }).then(res=>{
                if(res.status == 200){
                   this.getList()
                   this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }else {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
      // 修改
    handleModify(item){
        this.$prompt('请修改分类名称', '修改分类', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5]{2,4}$/,
          inputErrorMessage: '2到4位的汉字',
            inputPlaceholder:item.type_name
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '添加: ' + value
          });
        console.log(item)
          //post 修改类型
          api.request({
           url: modifyUrl,
           method: "post",
           data:{
              id:item.id,
              name:value,
              is_show:true
            }
            }).then(res=>{
                if(res.status == 200){
                  this.getList()
                  }else {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                 }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    }
  },
  mounted(){
    this.getList()
  }
}
</script>
<style>
.question-type-settings{
  height:100%;
  box-sizing:border-box;
  padding-bottom:16px;
  display:flex;
  flex-direction: column;
}
.question-type-settings .settings-item{
  width:90%;
  height:104px;
  margin:0 auto;
  display:flex;
  align-items: center;
  justify-content: space-between;
  box-shadow:0px 1px 0px 0px rgba(223,229,235,1);
}
.question-type-settings .settings-item h2{
  font-size:20px;
  color:#2D3557;
}
.question-type-settings .settings-item .el-button{
  width:160px;
  height:40px;
  background: #4D84FF;
  font-size:14px;
}
.question-type-settings .type-settings-ul{
  width:85%;
  margin:0 auto;
  list-style:none;
  overflow:auto;
  flex:1;
}
.question-type-settings .type-settings-ul li{
  height:64px;
  padding:0 16px;
  box-shadow:0px .5px 0px 0px rgba(223,229,235,1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.question-type-settings .type-settings-ul li h5{
  font-weight:500;
  font-size:16px;
  color:#2D3557;
}
.question-type-settings .type-settings-ul li .el-button{
  font-size:16px;
  color:#4D84FF;
}
</style>
