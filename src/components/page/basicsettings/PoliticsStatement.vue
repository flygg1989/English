<template>
  <div class="politics-statement-settings">
    <div class="settings-item">
      <h2>问政声明</h2>
      <el-button type="primary" @click = handleSave>保存</el-button>
    </div>
    <textarea v-model="content"></textarea>
  </div>
</template>
<script>
import api from '@/utils/api'
const agreementUrl='agreement/save'
const getAgreement='agreement'
export default {
  name : "PoliticsStatement",
  data(){
    return {
      content:""
    }
  },
  methods:{
      init(){
          api.request({
              url: getAgreement,
              method: "get",
          }).then(res=>{
              if(res.status == 200){
                  this.content=res.data.data.common
              }
          },res => {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              });
          })
      },
      //保存 todo 校验
    handleSave(){
      if(this.content){
          api.request({
           url: agreementUrl,
           method: "post",
           data:{
              content:this.content
           }
        }).then(res=>{
            if(res.status == 200){
               this.$notify({
                  title: "成功",
                  message: "声明更换成功",
                  type: 'success'
                });
              }else {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
              }
            })
      }else{
          this.$notify.error({
              title: "错误",
              message: "请先输入声明"
          });
          return
      }
    }
  },
  mounted(){
      this.init()
  }
}
</script>
<style>
.politics-statement-settings{
  height:100%;
  box-sizing:border-box;
  padding-bottom:36px;
  display:flex;
  flex-direction: column;
}
.politics-statement-settings .settings-item{
  width:90%;
  height:104px;
  margin:0 auto;
  display:flex;
  align-items: center;
  justify-content: space-between;
}
.politics-statement-settings .settings-item h2{
  font-size:20px;
  color:#2D3557;
}
.politics-statement-settings .settings-item .el-button{
  width:160px;
  height:40px;
  background: #4D84FF;
  font-size:14px;
}
.politics-statement-settings textarea{
  width:90%;
  box-sizing: border-box;
  padding:8px 16px;
  margin:0 auto;
  outline:none;
  border:1px solid #DFE5EB;
  border-radius:3px;
  resize:none;
  overflow:auto;
  flex:1;
}
.politics-statement-settings textarea:focus{
  border-color:rgba(77,132,255,.5);
}
</style>
