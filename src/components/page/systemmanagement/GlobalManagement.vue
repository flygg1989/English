<template>
    <div class="Menumanagement">
        <div class="Global_both">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="版本号"  prop="cname">
                <el-input v-model.trim="form.cname" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="下载地址"  prop="cval">
                <el-input v-model.trim="form.cval" placeholder="" @change="creatQrCode"></el-input>
            </el-form-item>
            <el-form-item label="二维码"  prop="remark">
                <div class="qrcode" ref="qrCodeUrl"></div>
            </el-form-item>
            <el-form-item label="关于我们"  prop="ckey">
                <el-input type="textarea" autosize v-model="form.ckey"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer"  style="display:block;text-align:center">
                <el-button type="primary" @click="submitForm('form')">确定</el-button>
                <el-button type="">取消</el-button>
            </span>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import api from '@/utils/api'
export default {
  data(){
    return {
        form:{
            ckey:'',   //版本号
            cval:'',   //下载地址
            cname:'',   //关于我们
        }, 
        cval:'',
      rules:{
        ckey:[
          {required: true, message: '请输入版本号', trigger: 'blur'},
        ],
        cval:[
          {required: true, message: '请输入下载地址', trigger: 'blur'},
        ],
        cname:[
          {required: true, message: '请输入关于我们', trigger: 'blur'},
        ],
      },
    }
  },
  watch:{
    cval(val){
        if(val){
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: val,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
            })
        }
    }
  },
  created() {
      this.getConfig();
  },

  methods: {
    //获取数据
    getConfig(){
      api.request({
          url: "getConfig",
          method: "POST"
      }).then(res=>{
          //console.log(res.data.data)
          if(res.data.state ==true){
              this.form.ckey =res.data.data.android_version.cval;
              this.form.cval =res.data.data.android_download_url.cval;
              this.cval =res.data.data.android_download_url.cval;
              this.form.cname =res.data.data.about_us.cval;
          }
      },res => {
          this.$notify.error({
          title: "错误",
          message: "数据请求失败"
          });
      })
    },

    //生成二维码
    creatQrCode(val){
      this.$refs.qrCodeUrl.innerHTML="";
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
      text: val,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
    },

    //提交
    //创建提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              api.request({
                  url: "setConfig",
                  method: "POST",
                  data:{
                    about_us:this.form.cname,
                    android_version:this.form.ckey,
                    android_download_url:this.form.cval,
                  },
              }).then(res=>{
                  //console.log(res)
                  if(res.data.state ==true){
                    this.$notify({
                        title: "成功",
                        message:res.data.message,
                        type: 'success'
                    });
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
            this.editVisible =false;
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
    
  }
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
.Global_both{
    padding: 100px;
}
</style>
