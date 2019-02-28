<template>
  <div class="condition-settings">
    <div>
      <div class="settings-item">
        <h2>预警时间</h2>
        <div class="input-box">
          <el-input class="text-input" v-model.trim="value0" maxlength="2" :disabled="showModifyBtn">
            <span slot="prepend">部门预警时间 :</span>
            <span slot="append">小时</span>
          </el-input>
        </div>
      </div>
        <div class="settings-item">
        <h2>问政审核</h2>
        <div class="input-box">
          <el-input v-model.trim="value1" maxlength="2" :disabled="showModifyBtn">
            <span slot="prepend">问政审核时间 :</span>
            <span slot="append">小时</span>
          </el-input>
        </div>
      </div>
      <div class="settings-item">
        <h2>部门处理</h2>
        <div class="input-box">
          <el-input v-model.trim="value2" maxlength="2" :disabled="showModifyBtn">
            <span slot="prepend">部门回复时间 :</span>
            <span slot="append">小时</span>
          </el-input>
        </div>
      </div>
      <div class="settings-item settings-item-three" >
        <h2>自动办结</h2>
        <div class="input-box">
          <el-input v-model.trim="value3" maxlength="2" :disabled="showModifyBtn">
            <span slot="prepend">自动办结时间 :</span>
            <span slot="append">小时</span>
          </el-input>
        </div>
      </div>
      <div class="settings-item settings-item-four">
        <h2>自动评价</h2>
        <div class="input-box">
          <el-input v-model.trim="value4" maxlength="2" :disabled="showModifyBtn">
            <span slot="prepend">自动评价时间 :</span>
            <span slot="append">小时</span>
          </el-input>
        </div>
      </div>
      <div class="settings-item settings-item-last">
        <h2>约束设置</h2>
        <div class="input-box">
          <el-input v-model.trim="value5" maxlength="3" :disabled="showModifyBtn">
            <span slot="prepend">用户提问次数约束 :</span>
            <span slot="append">次 / 天</span>
          </el-input>
        </div>
      </div>
    </div>
    <div>
      <div class="modify-box" v-if="showModifyBtn">
          <el-button class="el-button" @click='showModifyBtn=false'>修改</el-button>
      </div>
      <div class='save-box' v-else>
          <el-button class="el-button" @click='showModifyBtn=true'>取消</el-button>
            <el-button class="el-button" @click ='handleModify'>确定</el-button>
      </div >
    </div>
  </div>
</template>
<script>

import api from '@/utils/api'

const settingUrl = 'setting'
const modifySettingUrl = 'setting/save'

export default {
  name : "ConditionSettings",
  data(){
    return {
      showModifyBtn:true,
      value0:1,
      value1:1,
      value2:1,
      value3:1,
      value4:1,
      value5:1,
    }
  },
  watch:{
      value0:function(newVal){
          if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value0=1;
          this.$nextTick(() => {
              this.value0= String(newVal).replace(/\D/g, '');
          });
      },
    value1:function(newVal){
      if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value1=1;
      this.$nextTick(() => {
        this.value1= String(newVal).replace(/\D/g, '');
      });
    },
    value2:function(newVal){
      if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value2= 1;
      this.$nextTick(() => {
        this.value2= String(newVal).replace(/\D/g, '');
      });
    },
    value3:function(newVal){
      if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value3= 1;
      this.$nextTick(() => {
        this.value3= String(newVal).replace(/\D/g, '');
      });
    },
    value4:function(newVal){
      if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value4= 1;
      this.$nextTick(() => {
        this.value4= String(newVal).replace(/\D/g, '');
      });
    },
    value5:function(newVal){
      if (String(newVal).indexOf('.') > 0|| newVal.length===0|| parseInt(newVal)===0) this.value5= 1;
      this.$nextTick(() => {
        this.value5= String(newVal).replace(/\D/g, '');
      });
    }
  },
  methods:{
      // 初始化
    getDefaultSetting(){
      api.request({
           url: settingUrl,
           method: "get",
        }).then(res=>{
            if(res.status == 200){
              this.value0=res.data.data.common.sug_early_warning_time.cvalue
              this.value1=res.data.data.common.sug_audittime.cvalue
              this.value2=res.data.data.common.dep_optime.cvalue
              this.value3=res.data.data.common.auto_getthroughtime.cvalue
              this.value4=res.data.data.common.auto_evaluatetime.cvalue
              this.value5=res.data.data.common.strc_sugtimes.cvalue
              }
            },res => {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              });
      })

    },
      // 修改
    handleModify(){
       api.request({
           url: modifySettingUrl,
           method: "post",
           data:{
              sug_early_warning_time:this.value0,
              sug_audittime:this.value1,
              dep_optime:this.value2,
              auto_getthroughtime:this.value3,
              auto_evaluatetime:this.value4,
              strc_sugtimes:this.value5
           }
        }).then(res=>{
            if(res.status == 200){
               this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: 'success'
                });
                this.showModifyBtn=true
                this.getDefaultSetting()
              }
            },res => {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              });
        })
    }
  },
   mounted(){
      this.getDefaultSetting()
    }
}
</script>
<style>
.el-input__inner{
    border: 1px solid #dcdfe6!important;
}
.condition-settings{
  height:100%;
  box-sizing:border-box;
  overflow:auto;
}
.condition-settings .settings-item{
  width:90%;
  height:104px;
  margin:0 auto;
  display:flex;
  align-items: center;
  justify-content: space-between;
  box-shadow:0px 1px 0px 0px rgba(223,229,235,1);
}
.condition-settings .settings-item h2{
  font-size:20px;
  color:#2D3557;
}
.condition-settings .settings-item .input-box{
  width:248px;
  margin-right:40px;
}
.condition-settings .settings-item .input-box input{
  text-align:center;
}
.condition-settings .settings-item-three{
  box-shadow:none;
}
.condition-settings .settings-item-four{
  justify-content: space-between
}
.condition-settings .settings-item-last .input-box{
  width:286px;
  margin-right:28px;
}
.modify-box{
  float: right;
  margin-top: 50px;
  margin-right: 8%;
  display:inline-block ;
}
.modify-box ::after{
  content: '';
  display: inline-block;
  clear: both
}
.modify-box .el-button{
  width:80px;
  color:#4D84FF;
  border-color:#4D84FF;
  background:rgba(255,255,255,0);
}
.modify-box .el-button:hover,.modify-box .el-button:focus{
  color:#fff;
  background:#4D84FF;
}
.modify-box .el-button:active{
  color:#fff;
  background:rgba(77,132,255,0.8);
}

.save-box{
  float: right;
  margin-top: 50px;
  margin-right: 8%
}
.save-box  .el-button{
  width:60px;
  color:#4D84FF;
  border-color:#4D84FF;
  background:rgba(255,255,255,0);
}
.save-box  .el-button:hover,.save-box  .el-button:focus{
  color:#fff;
  background:#4D84FF;
}
.save-box .el-button:active{
  color:#fff;
  background:rgba(77,132,255,0.8);
}

</style>
