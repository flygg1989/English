<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata">
                <i class="el-icon-caret-bottom el-icon-edit edit-title" @click="edittitle"></i>
                <div class="mask_tip mask_tip_color_one" v-if="formdata.plat_status == 1">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_one" v-if="formdata.plat_status == 8">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_one" v-if="formdata.plat_status == 13">{{this.formdata.status_name}}</div>
                
                <div class="mask_tip_p">
                    <span>{{formdata.truename}}</span>
                    <span>{{formdata.telphone}}</span>

                    <!--投诉-->
                    <el-dropdown trigger="click" >
                        <span class="el-dropdown-link" >
                            {{formdata.sug_type.type_name}}<i class="el-icon-caret-bottom el-icon-edit"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item class="clearfix" v-for="(item,index) in ComplaintList" :key="index" @click.native="Complaintclick(item,index)">
                            {{item.type_name}}
                            <el-badge class="mark" />
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>  
                    
                    <span>时间：{{formdata.created_at}}</span>
                </div>
                
                <ul class="imgstyleone" v-if="formdata.attachments.length <= 3">
                    <li v-for="(item,index) in formdata.attachments" :key="index"><img :src="item.url" alt=""></li>
                </ul>

                <el-carousel :interval="4000" type="card" height="200px" v-if="formdata.attachments.length > 3">
                    <el-carousel-item v-for="(item,index) in formdata.attachments" :key="index">
                        <img :src="item.url" alt="">
                    </el-carousel-item>
                </el-carousel>
            
                <el-input type="textarea" :readonly="isReadOnly" rows="3" v-model="formdata.content" placeholder=""></el-input>
                <div class="modify" v-if="buttonstate == 1">
                    <el-button plain class="handle-modify mr10" @click="readonlystate" >问题修改</el-button>
                </div>
                <div class="el-dialog__footer quill-editor-footer" v-if="buttonstate == 2">
                    <span slot="footer" class="dialog-footer">
                        <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                        <el-button type="primary" @click="quillconfirm()">确定</el-button>
                    </span>
                </div>

                <div class="hr-top"></div>

                <div class="handle-box">
                    <el-select v-model="provinceId" :placeholder="provincename" clearable  class="selsct_city">
                        <el-option
                        v-for="item in provinceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="cityId" :placeholder="cityname" clearable  class="selsct_city">
                        <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="areaId" :placeholder="areaname" clearable   class="selsct_city">
                        <el-option
                        v-for="item in areaList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="Classificationid" placeholder="请选择部门分类" clearable   class="selsct_cityone">
                        <el-option
                        v-for="item in ClassificationLIstanbul"
                        :key="item.id"
                        :label="item.type_name"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="dept_id" :placeholder="deptname" clearable  class="selsct_cityone">
                        <el-option
                        v-for="item in departmentList"
                        :key="item.user_id"
                        :label="item.dept_name"
                        :value="item.user_id">
                        </el-option>
                    </el-select>
                   
                   

                    <el-checkbox-group v-model="type">
                        <!-- <el-checkbox label="置顶" name="type"></el-checkbox> -->
                        <el-checkbox label="隐藏" :disabled ="checkboxstate" name="type"></el-checkbox>
                    </el-checkbox-group>
                </div>

            </el-form>

            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="adoptsubmit()">通过审核并转交</el-button>
                <el-button type="primary" @click="saveEdit">不予处理</el-button>
            </span>
        </el-dialog>

        <!--不予处理原因 -->
        <el-dialog title="不予处理原因" :visible.sync="denyVisible" width="704px">
            <el-input type="textarea" rows="10" v-model="desc" :maxlength="200"  @input="removeActive($event)" placeholder="请输入原因，200个字符以内"></el-input>
            <i class="num">{{textlength}}/200</i>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="denyVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="submit"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提   交 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import api from "@/utils/api";
import Bus from "@/components/common/bus.js";
export default {
    data() {
        return {
            id:'', //问政id
            editVisible: false,
            
            formdata:{
                plat_status:'',
                status_name:'',
                title:'',
                truename:'',
                telphone:'',
                sug_type:{  //投诉
                    id:'',
                    type_name:'',
                },
                content:'',
                created_at:'',
                attachments:[],
                dept_id:'',
                is_top:'',
                is_show:'',
            },

            ComplaintList:[], //投诉类型列表
            departmentList:[],  //部门分类
            area:[],        //省市区
            dept_id:'',      //部门选择id
            provinceId:'',  //省id
            provinceList:[],//省列表
            cityId:'',     //市id
            cityList:[],    //市列表
            areaId:'',      //区id
            areaList:[],    //区列表
            provincename:'',
            cityname:'',
            areaname:'',
            deptname:'',
            area:'',  //省市区拼接
            Classificationid:'', //部门分类id
            ClassificationLIstanbul:[], //部门分类列表
            
            isReadOnly:true,  //控制textarea是否可以编辑
            buttonstate:1,    //问题修改 显示隐藏
            type: [],

            checkboxstate:false,  //隐藏是否可以修改

            //不予处理
            denyVisible:false,
            desc:'',
            textlength:'0',

        }
    },
    watch:{
        //判断置顶隐藏
        type(odd,active){
            //console.log(odd,active)
            if(this.type.length == 2){
                this.type.splice(odd,1);
                this.type.concat(active);
            }else{
                this.type.concat(active);
            };
            if(odd == ""){
                this.formdata.is_show =1;
                this.formdata.is_top=1;
            }else if(odd == "置顶"){
                this.formdata.is_show =1;
                this.formdata.is_top=2;
            }else if(odd == "隐藏"){
                this.formdata.is_show =2;
                this.formdata.is_top=1;
            }
        },

        //根据省获取市
        provinceId(newid,oldid){
            if(newid ==null || newid ==""){
                console.log('空')
            }else{
                this.cityId ='',
                this.areaId ='',
                this.Classificationid='',
                this.departmentList=[],
                this.dept_id='',
                //获取市
                api.request({
                    url: 'province',
                    method: "GET",
                    data:{
                       pid: this.provinceId,
                       all:1,
                       type:2
                    }
                })
                .then(
                res => {
                    if (res.status == 200) {
                        this.cityList =res.data.data.common;
                    }
                },
                res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                });
                
                //根据省获取 部门分类
                this.dept_id='';
                this.departmentList=[];
                var areaNum=this.provinceId+'|'+0+'|'+0;
                api.request({
                    url: 'dept',
                    method: "GET",
                    data:{
                        limit:0,
                        area:areaNum,
                        type_id:this.Classificationid,
                    }
                })
                .then(
                res => {
                    console.log(res)
                    if (res.status == 200) {
                        this.departmentList =res.data.data.common;
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
                //console.log('空')
                this.cityId='';
                this.areaId ='';
                this.dept_id='';
                this.areaList = [];
            }else{
                this.areaId ='';
                this.Classificationid='',
                //获取区
                api.request({
                    url: 'province',
                    method: "GET",
                    data:{
                        pid: this.cityId,
                        all:1,
                        type:3
                    }
                })
                .then(
                res => {
                    if (res.status == 200) {
                        //console.log(res.data.data.common)
                        this.areaList =res.data.data.common;
                        if(res.data.data.common == null || res.data.data.common == ''){
                            this.areaId = ''
                        }else{
                            this.areaList =res.data.data.common
                        }
                    }
                },
                res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败2"
                    });
                });

                //根据区获取 部门分类
                this.dept_id='';
                if(this.cityId ==null || this.cityId==''){
                    this.cityId=0
                }
                var areaNum=this.provinceId+'|'+this.cityId+'|'+'0';
                api.request({
                    url: 'dept',
                    method: "GET",
                    data:{
                        limit:0,
                        area:areaNum,
                        type_id:this.Classificationid,
                    }
                })
                .then(
                res => {
                    console.log(res)
                    if (res.status == 200) {
                        this.departmentList =res.data.data.common;
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

         //根据区获取分类
        areaId(newedid,oldedid){
            if(newedid ==null || newedid ==""){
                //console.log('空')
                this.areaId=='',
                this.areaList = [];
                this.dept_id='';
            }else{
                this.Classificationid='',
                //根据区获取 部门分类
                this.dept_id='';
                var areaNum=this.provinceId+'|'+this.cityId+'|'+this.areaId;
                api.request({
                    url: 'dept',
                    method: "GET",
                    data:{
                        limit:0,
                        area:areaNum,
                        type_id:this.Classificationid,
                    }
                })
                .then(
                res => {
                    console.log(res)
                    if (res.status == 200) {
                        this.departmentList =res.data.data.common;
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

        //根据部门分类获取部门列表
        Classificationid(newedid,oldedid){
            if(newedid ==null || newedid ==""){
                console.log('空')
                this.dept_id ='';
                this.departmentList = [];
            }else{
                this.dept_id='';
                if(this.cityId == null || this.cityId ==''){
                    this.cityId =0;
                }
                if(this.areaId ==null || this.areaId ==''){
                    this.areaId=0;
                }
                console.log(this.cityId)
                console.log(this.areaId)
                var areaNum=this.provinceId+'|'+this.cityId+'|'+this.areaId;
                api.request({
                    url: 'dept',
                    method: "GET",
                    data:{
                        limit:0,
                        area:areaNum,
                        type_id:this.Classificationid,
                    }
                })
                .then(
                res => {
                    //console.log(res)
                    if (res.status == 200) {
                        this.departmentList =res.data.data.common;
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


    },
    created(){
        Bus.$on('sendID',(data)=>{
           console.log(data)
            if(data.plat_status == 1 || data.plat_status == 8 || data.plat_status == 13){
                this.editVisible = true;
                this.id = data.id;
                this.provinceId = '',
                this.cityId = '',
                this.areaId = '',
                this.Classificationid = '',
                this.dept_id = '',
                this.buttonstate = 1,
                this.desc='',
                this.textlength= 0,
                //console.log(data)
                //获取  弹窗数据
                api.request({
                    url: "suggest/detail",
                    method: "GET",
                    data:{
                        id:this.id,
                        expand:'attachments,replyList,chaseList,sugType,member',
                    }
                }).then(res=>{
                    console.log(res.data.data.common)
                    if(res.status == 200){
                        this.formdata={
                            plat_status: res.data.data.common.plat_status,
                            status_name: res.data.data.common.status_name,
                            title: res.data.data.common.title,
                            content: res.data.data.common.content,
                            truename: res.data.data.common.truename,
                            telphone: res.data.data.common.telphone,
                            sug_type: res.data.data.common.sug_type,
                            created_at: res.data.data.common.created_at,
                            attachments: res.data.data.common.attachments,
                            is_top: res.data.data.common.is_top,
                            is_show: res.data.data.common.is_show,
                            address:res.data.data.common.address,
                            area: res.data.data.common.area,
                            dept_id: res.data.data.common.dept_id,
                            dept_name: res.data.data.common.dept_name,
                        }
                        this.area =res.data.data.common.area.split("|");
                        this.provincename =res.data.data.common.address[0];
                        this.cityname =res.data.data.common.address[1];
                        this.areaname =res.data.data.common.address[2];
                        this.deptname =res.data.data.common.dept_name;
                        
                        if(res.data.data.common.is_top == 2){
                            this.type =['置顶'];
                        }else if(res.data.data.common.is_show == 2){
                            this.type = ['隐藏'];
                        }else{
                            this.type = [];
                        }
                        //隐藏是否可修改
                        if(res.data.data.common.is_pub == 1){
                            this.checkboxstate =false;
                        }else{
                            this.checkboxstate =true;
                        }
                        
                    }
                },res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                });

                //投诉类型列表
                api.request({
                    url: "suggest/category",
                    method: "GET"
                }).then(res=>{
                    //console.log(res.data.data.common)
                    if(res.status == 200){
                        this.ComplaintList =res.data.data.common
                    }
                },res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                })
            }
        });
        this.getProvince();   //获取省市区 /获取省
        this.getdepartment();  //获取部门分类
    },
    methods: {
        //获取省市区  获取省
        getProvince(){
            //获取省
            api.request({
                url: 'province',
                method: "GET",
                data:{
                    pid:0,
                    all:1,
                    type:1,
                },
            })
            .then(
            res => {
                if (res.status == 200) {
                    this.provinceList =res.data.data.common;
                }
            },
            res => {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
            });
        },

        //获取部门分类
        getdepartment(){
            api.request({
                url: 'dept/category',
                method: "GET",
            })
            .then(
            res => {
                if (res.status == 200) {
                    this.ClassificationLIstanbul =res.data.data.common;
                }
            },
            res => {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
            });
        },

        //修改标题
        edittitle(){
            this.$prompt('请输入新的标题', '提示', {
                inputValue:this.formdata.title,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    api.request({
                        url: 'suggest/save',
                        method: "POST",
                        data:{
                            id: this.id,
                            title:value
                        }
                    })
                    .then(
                    res => {
                        //console.log(res)
                        if (res.status == 200) {
                            if(res.data.state == true){
                                this.$notify({
                                    title: '成功',
                                    message: '标题修改成功',
                                    type: 'success'
                                });
                                this.formdata.title=value,
                                Bus.$emit('detailChange',true);
                            }else{
                                this.$notify.error({
                                    title: "错误",
                                    message: res.data.message
                                }); 
                            }
                        }
                    },
                    res => {
                        this.$notify.error({
                            title: "错误",
                            message: "数据请求失败"
                        });
                    });
                }).catch(() => {
                      
                });
        },

        //投诉下拉菜单选择事件
        Complaintclick(item,index) {
            //console.log(item)

            this.formdata.sug_type.type_id =item.id
            this.formdata.sug_type.type_name =item.type_name
        },
       
        
        //通过审核 已转办
        adoptsubmit(){
            //省市区 部门 没有选择时选取原来的id
            
            if(this.provinceId == '' || this.provinceId ==null){
                this.provinceId = this.area[0];
                this.cityId = this.area[1];
                this.areaId = this.area[2];
                this.dept_id =this.formdata.dept_id
            }
            if(this.cityId == '' || this.cityId == null){
                this.cityId = 0;
                this.areaId = 0
            }
            if(this.areaId == '' || this.areaId ==null){
                this.areaId = 0
            };
            if(this.dept_id == '' || this.dept_id ==null){
                this.$notify.error({
                    title: "错误",
                    message: "部门不能为空",
                });
                return false
            };
            console.log(this.provinceId)
            console.log(this.cityId)
            console.log(this.areaId)
            console.log(this.dept_id)
            //return false;
            //先提交修改
            api.request({
                url: 'suggest/save',
                method: "post",
                data:{
                    id: this.id,
                    content:this.formdata.content,
                    type_id:this.formdata.sug_type.type_id,
                    dept_id:this.dept_id,
                    province:this.provinceId,
                    city:this.cityId,
                    region:this.areaId,
                    is_top:this.formdata.is_top,
                    is_show:this.formdata.is_show,
                }
            })
            .then(
            res => {
                console.log(res)
                if (res.status == 200) {
                    if(res.data.state == false){
                        this.$notify.error({
                            title: "错误",
                            message: res.data.message
                        });
                        return false;
                    }else{
                        console.log("修改成功!")
                    }
                }
            },
            res => {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
                return false;
            });

            //问政待审
            api.request({
                url: 'suggest/verify',
                method: "GET",
                data:{
                    id:this.id
                },
            })
            .then(
            res => {
                //console.log(res)
                if (res.status == 200) {
                    if(res.data.state == true){
                        Bus.$emit('detailChange',true);
                        this.$notify({
                            title: '审核通过，已转办',
                            message: '3秒后自动关闭',
                            type: 'success'
                        });
                        this.editVisible = false; 
                    }else{
                        this.$notify.error({
                            title: "错误",
                            message: res.data.message
                        });
                    }
                }
            },
            res => {
                this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                });
            });
            

        },

        //问题修改  控制readonlystate 和按钮显示隐藏
        readonlystate(){
            this.isReadOnly = false;
            this.buttonstate = 2;
        },
        //问题修改  取消
        // quillcancel(){
        //     this.isReadOnly = true;
        //     this.buttonstate = 1;
        // },

        //问题修改 确定
        quillconfirm(){
            this.isReadOnly = true;
            this.buttonstate = 1;
        },
        //saveEdit 不予处理
        saveEdit(){
            this.denyVisible = true;
        },

        //不予处理原因  文本框输入获取字数
        removeActive(e){
            this.textlength =this.desc.length
        },

        //不予处理原因 提交
        submit(){
            if(this.desc.length == 0){
                this.$notify.error({
                title: '错误',
                message: '原因不能为空！'
                });
            }else{
                api.request({
                    url: 'suggest/refuse',
                    method: "POST",
                    data:{
                        id:this.id,
                        content:this.desc,
                    }
                })
                .then(
                res => {
                    console.log(res)
                    if (res.status == 200) {
                        if(res.data.state == true){
                            Bus.$emit('detailChange',true);
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.denyVisible =false;
                            this.editVisible =false;
                        }else{
                            this.$notify.error({
                                title: "错误",
                                message: res.data.message
                            });
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
        },
    },
}
</script>

<style>
    
</style>

