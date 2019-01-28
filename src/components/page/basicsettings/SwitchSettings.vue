<template>
  <div class="switch-settings">
    <div class="settings-item">
      <div>
        <h2>平台审核部门回复开关</h2>
        <p>开启，则部门回复的内容需要审核；关闭，部门回复免审</p>
      </div>
      <div>
        <el-switch
         @change='handleSwitch1'
          v-model="value1"
          active-color="#2CD696"
          inactive-color="#DFE5EB">
        </el-switch>
      </div>
    </div>
    <div class="settings-item">
      <div>
        <h2>手机短信验证</h2>
        <p>开启，则问政手机号需要短信验证</p>
      </div>
      <div>
        <el-switch
          @change='handleSwitch2'
          v-model="value2"
          active-color="#2CD696"
          inactive-color="#DFE5EB">
        </el-switch>
      </div>
    </div>
    <div class="settings-item">
      <div>
        <h2>地区范围</h2>
        <p>设置前台可选择的地区范围</p>
      </div>
      <div>
        <!--<el-cascader-->
          <!--v-model="selectedOptions"-->
          <!--:options="options"-->
          <!--@change="handleItemChange"-->
          <!--:props="props"-->
        <!--&gt;</el-cascader>-->
        <!--<el-button type="primary">确认添加</el-button>-->
          <el-select  v-model="provinceId" placeholder="省" class="selsct_city">
              <el-option
                  v-for="item in provinceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
          </el-select>
          <el-select v-model="cityId" placeholder="市"  class="selsct_city">
              <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
          </el-select>
          <el-select  v-model="areaId" placeholder="区"  class="selsct_city" @change="handlearea">
              <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
          </el-select>
          <el-button type="primary" style="height: 32px" @click="addLimitCity">确认添加</el-button>
      </div>
    </div>
    <ul class="cities-ul">
      <li v-for="(item,index) in citiesList" :key="index">
        <h5 >{{item.province_name+' / '+item.city_name+' / '+item.region_name}}</h5>
        <!--<h5 >{{item.province_name+' / '+item.city_name}}</h5>-->
        <!--<h5 >{{item.province_name}}</h5>-->
        <div>
        <el-button type="text" @click='delActiveCity(item.id)'>删除</el-button>
        </div>
        </li>
    </ul>
  </div>
</template>
<script>
import api from '@/utils/api';

const settingUrl = 'setting';
const settingSaveUrl = 'setting/save';
const getCityList='province';
const postLimitCity='province/save';
const getActiveCity ='province/active'
const getDelCity ='province/delete'


export default {
  name : "SwitchSettings",
  data(){
    return {
        value1:null,
        value2:null,
        post1:1,
        post2:1,
        provinceId:'',  //省id
        provinceList:[],//省列表
        cityId:'',     //市id
        cityList:[],    //市列表
        areaId:'',      //区id
        areaList:[],    //区列表
        citiesList:[],
        postLimitCode:{  //post 到添加限制省市区
            province_id:'',
            city_id:'',
            region_id:''
        }
    }
  },
  methods:{
      //删除限制城市
      delActiveCity(id){
          console.log(id)
          api.request({
              url: getDelCity,
              method: "get",
              data:{
                 id:id
              }
          }).then(res=>{
              if(res.data.state===true){
                  this.$notify({
                      title: "成功",
                      message: "该地区范围删除成功",
                      type: 'success'
                  });
                  this.getDefaultSetting()
              }else {
                  this.$notify.error({
                      title: "错误",
                      message: res.data.message
                  });
              }
          }).catch(err=>{
              this.$notify.error({
                  title: "错误",
                  message: err
              });
          })
      },
      //添加限制城市
      addLimitCity(){
          if(this.postLimitCode.province_id&&this.postLimitCode.city_id&&this.postLimitCode.region_id){
              api.request({
                  url: postLimitCity,
                  method: "post",
                  data:{
                      province_id:this.postLimitCode.province_id,
                      city_id:this.postLimitCode.city_id,
                      region_id:this.postLimitCode.region_id
                  }
              }).then(res=>{
                  if(res.data.state===true){
                      this.$notify({
                          title: "成功",
                          message: "地区范围限制成功",
                          type: 'success'
                      });
                      this.getDefaultSetting()
                  }else {
                      this.$notify.error({
                          title: "错误",
                          message: res.data.message
                      });
                  }
              }).catch(err=>{
                  this.$notify.error({
                      title: "错误",
                      message: err
                  });
              })
          }else {
              this.$notify.error({
                  title: "错误",
                  message: '请先选择省市区'
              });
          }

      },

      //区选择后传值
      handlearea(areaId){
          this.areaId=areaId
          this.postLimitCode={
              province_id:this.provinceId,
              city_id:this.cityId,
              region_id:this.areaId
          };
      },
      //设置
    getDefaultSetting(){

          //开关
      api.request({
           url: settingUrl,
           method: "get",
        }).then(res=>{
            if(res.status == 200){
              this.value1=res.data.data.common.reauditkey.cvalue==1
              this.value2=res.data.data.common.mobileaudit.cvalue==1
              }
            },res => {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
                });
      })

        // 城市
        api.request({
            url: getActiveCity,
            method: "get",
        }).then(res=>{
            if(res.status == 200){
               this.citiesList=res.data.data.common
                console.log(this.citiesList)
            }
        }).catch(err=>{
            this.$notify.error({
                title: "错误",
                message: err
            })
        })

    },
      //初始限制城市
    getLimmit(){
        api.request({
           url: getCityList,
           method: "get",
            data:{
                all:1
            }
        }).then(res=>{
            if(res.status == 200){
                this.provinceList=res.data.data.common
              }else {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
             }
            })
    },
      //开关1
    handleSwitch1(){
         this.value1?this.post1=1:this.post1=2
         api.request({
           url: settingSaveUrl,
           method: "post",
           data:{
              reauditkey:this.post1
           }
        }).then(res=>{
            if(res.status == 200){
              console.log(res)
               this.$notify({
                  title: "成功",
                  message: "平台审核部门回复开关更换成功",
                  type: 'success'
                });
              }else {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                }
            })
        
    },
      // 开关2
     handleSwitch2(){
       this.value2?this.post2=1:this.post2=2
         api.request({
           url: settingSaveUrl,
           method: "post",
           data:{
              mobileaudit:this.post2
           }
        }).then(res=>{
            if(res.status == 200){
               this.$notify({
                  title: "成功",
                  message: "短信验证开关更换成功",
                  type: 'success'
                });
              }else {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
               }
            })
    },

  },
  mounted(){
    this.getDefaultSetting()
    this.getLimmit()
  },
    watch:{
        //根据省获取市
        provinceId(newid,oldid){
            if(newid ==null || newid ==""){
                console.log('空')
            }else{
                this.cityId ='',
                this.areaId ='',
                    //获取市
                    api.request({
                        url: getCityList,
                         //   'province?token='+localStorage.getItem('sk')+'&pid='+this.provinceId+'&type=2',
                        method: "GET",
                        data:{
                            pid:this.provinceId,
                            type:2,
                            all:1
                        }
                    })
                        .then(
                            res => {
                                if (res.status == 200) {
                                    this.cityList =res.data.data.common
                                    console.log(this.provinceId)
                                }
                            },
                            res => {
                                this.$notify.error({
                                    title: "错误",
                                    message: "数据请求失败"
                                });
                            });
            }
        },
        //根据市获取区
        cityId(newedid,oldedid){
            if(newedid ==null || newedid ==""){
                console.log('空')
            }else{
                this.areaId ='',
                    //获取区
                    api.request({
                        url: getCityList,
                        method: "GET",
                        data:{
                            pid:this.cityId,
                            type:3,
                            all:1
                        }
                    })
                        .then(
                            res => {
                                if (res.status == 200) {
                                    this.areaList =res.data.data.common
                                    if(res.data.data.common == null || res.data.data.common == ''){
                                        this.areaId = ''
                                    }else{
                                        this.areaList =res.data.data.common
                                        console.log(this.cityId)
                                    }
                                }
                            },
                            res => {
                                this.$notify.error({
                                    title: "错误",
                                    message: "数据请求失败"
                                });
                            });
            }
        }
    },
}
</script>
<style>
    .selsct_city{
        width: 100px;
    }
.switch-settings{
  height:100%;
  box-sizing:border-box;
  padding-bottom:16px;
  display:flex;
  flex-direction: column;
}
.switch-settings .settings-item{
  width:90%;
  height:104px;
  margin:0 auto;
  display:flex;
  align-items: center;
  justify-content: space-between;
  box-shadow:0px 1px 0px 0px rgba(223,229,235,1);
}
.switch-settings .settings-item h2{
  font-size:20px;
  line-height:30px;
  color:#2D3557;
}
.switch-settings .settings-item p{
  font-size:14px;
  line-height:24px;
  color:rgba(45,53,87,.4);
}
.switch-settings .settings-item .el-button{
  width:120px;
  height:40px;
  background: #4D84FF;
  font-size:14px;
}
.switch-settings .settings-item:last-child{
  box-shadow:none;
}
.switch-settings .el-cascader{
  width:288px;
  margin-right:10px;
}
.switch-settings .el-cascader input{
  height:40px;
}
.switch-settings .el-cascader__label,.switch-settings .el-cascader__label span{
  font-size:14px;
  line-height:40px;
  color:rgba(45,53,87,.3);
}


.switch-settings .cities-ul{
  width:85%;
  margin:0 auto;
  list-style:none;
  overflow:auto;
  flex:1;
}
.switch-settings .cities-ul li{
  height:64px;
  padding:0 16px;
  box-shadow:0px .5px 0px 0px rgba(223,229,235,1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.switch-settings .cities-ul li h5{
  font-weight:500;
  font-size:16px;
  color:#2D3557;
}
.switch-settings .cities-ul li .el-button{
  font-size:16px;
  color:#4D84FF;
}
</style>
