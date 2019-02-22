<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata" label-width="50px">
                <i class="el-icon-caret-bottom el-icon-edit edit-title" @click="edittitle"></i>
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 2">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 4">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 9">{{this.formdata.status_name}}</div>
                
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
                
                <!--当chase_list 追问有值时-->
                <div v-if="formdata.chase_list ==null">
                    <!--图片 少于三张-->
                    <ul class="imgstyleone" v-if="formdata.attachments.length <= 3">
                        <li v-for="(item,index) in formdata.attachments" :key="index"><img :src="item.url" alt=""></li>
                    </ul>
                    <!--图片 多于三张-->
                    <el-carousel :interval="4000" type="card" height="200px" v-if="formdata.attachments.length > 3">
                        <el-carousel-item v-for="(item,index) in formdata.attachments" :key="index">
                            <img :src="item.url" alt="">
                        </el-carousel-item>
                    </el-carousel>
                
                    <el-input type="textarea" :readonly="isReadOnly" autosize v-model="formdata.content" placeholder=""></el-input>
                    <div class="modify" v-if="buttonstate == 1">
                        <el-button plain class="handle-modify mr10" @click="readonlystate" >问题修改</el-button>
                    </div>
                    <div class="el-dialog__footer quill-editor-footer" v-if="buttonstate == 2">
                        <span slot="footer" class="dialog-footer">
                            <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                            <el-button type="primary" @click="quillconfirm()">确定</el-button>
                        </span>
                    </div>

                </div>
                
                <!--当chase_list 追问没有值时-->
                <div v-else>
                    <!--图片 少于三张-->
                    <ul class="imgstyleone" v-if="formdata.chase_list.attachments && formdata.chase_list.attachments.length <= 3">
                        <li v-for="(item,index) in formdata.chase_list.attachments" :key="index"><img :src="item.url" alt=""></li>
                    </ul>
                    <!--图片 多于三张-->
                    <el-carousel :interval="4000" type="card" height="200px" v-if="formdata.chase_list.attachments && formdata.chase_list.attachments.length > 3">
                        <el-carousel-item v-for="(item,index) in formdata.chase_list.attachments" :key="index">
                            <img :src="item.url" alt="">
                        </el-carousel-item>
                    </el-carousel>
                
                    <el-input type="textarea" :readonly="isReadOnly" autosize v-model="formdata.chase_list.content" placeholder=""></el-input>
                    <div class="modify" v-if="buttonstate == 1">
                        <el-button plain class="handle-modify mr10" @click="readonlystate" >问题修改</el-button>
                    </div>
                    <div class="el-dialog__footer quill-editor-footer" v-if="buttonstate == 2">
                        <span slot="footer" class="dialog-footer">
                            <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                            <el-button type="primary" @click="quillconfirm()">确定</el-button>
                        </span>
                    </div>

                </div>

                <div class="hr-top"></div>

                <!--返回的回复 内容-->
                <div class="bg_color_f7" v-if="formdata.chase_list !=null ">
                    
                        <div v-for="(item,index) in formdata.reply_list" :key="index">
                            <div class="bg_color_tip">
                                <h1>原回复</h1>
                                <div>
                                    <span>{{formdata.dept_name}}</span>
                                    <span>{{formdata.uname}}</span>
                                    <span>{{item.created_at}}</span>
                                </div>
                            </div>
                            
                            <!--回复图片展示-->
                            <ul class="ReplyImg">
                                <li v-for="(item,index) in item.attachments" :key="index"><img :src="item.url" alt=""></li>
                            </ul>
                            <el-input type="textarea" autosize readonly v-model="item.reply" placeholder=""></el-input>
                        </div>
                        
                    <div v-if="formdata.chase_list != null">
                        <div class="bg_color_tip">
                            <h1>原问题</h1>
                            <div>
                                <span>{{formdata.type_name}}</span>
                                <span>提问时间：{{formdata.created_at}}</span>
                            </div>
                        </div> 
                        <ul class="ReplyImg">
                            <li v-for="(item,index) in formdata.attachments" :key="index"><img :src="item.url" alt=""></li>
                        </ul>                  
                        <el-input type="textarea" autosize readonly v-model="formdata.content" placeholder=""></el-input>
                    </div>
                </div>

                <div class="handle-box">
                    <el-checkbox-group v-model="type">
                        <!-- <el-checkbox label="置顶" name="type"></el-checkbox> -->
                        <el-checkbox label="隐藏" :disabled ="checkboxstate" name="type"></el-checkbox>
                    </el-checkbox-group>
                </div>

            </el-form>

            
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="adoptsubmit()">通过审核并转交</el-button> -->
                <el-button type="" class="btn_style_one" @click="adoptsubmit">撤回问题</el-button>
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
            id:'18', //问政id
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
                reply_list:[],   //回复的详情
                chase_list:{
                    id:'',  //追问id
                    reply_list:[], //追问回复
                },
            },

            ComplaintList:[], //投诉类型列表
           
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

        
    },
    created(){
        Bus.$on('sendID',(data)=>{
            console.log(data)
            if(data.plat_status == 2 || data.plat_status == 4 || data.plat_status == 9){
                this.editVisible = true;
                this.id = data.id;
                this.buttonstate = 1,
                //console.log(data)
                //获取  弹窗数据
                api.request({
                    url: "suggest/detail",
                    method: "GET",
                    data:{
                        id:this.id,
                        expand:'attachments,replyList.attachments,replyList.user,chaseList.sugType,chaseList.attachments,chaseList.replyList,sugType,member',
                    }
                }).then(res=>{
                   //console.log(res.data.data.common)
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
                            reply_list:res.data.data.common.reply_list,   //回复列表
                            chase_list:res.data.data.common.chase_list,  //追问列表
                        }
                        
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
    },
    methods: {
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
        
        //撤销问题 
        adoptsubmit(){
            this.$confirm('将问题从转办部门或平台撤回', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.chase_list == null){
                //先提交修改
                api.request({
                    url: 'suggest/save',
                    method: "post",
                    data:{
                        id: this.id,
                        content:this.formdata.content,
                        type_id:this.formdata.sug_type.type_id,
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
                        }else{
                            console.log("修改成功")
                            //撤回问题
                            api.request({
                                url: 'suggest/cancel',
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
                                            title: '成功',
                                            message: '撤回成功',
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
                        }
                    }
                },
                res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                });

                
            }else{
               //先提交修改
                api.request({
                    url: 'suggest/save',
                    method: "post",
                    data:{
                        id: this.id,
                        content:this.formdata.chase_list.content,
                        type_id:this.formdata.sug_type.type_id,
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
                        }else{
                            console.log("修改成功")
                            //撤回问题
                            api.request({
                                url: 'suggest/cancel',
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
                                            title: '成功',
                                            message: '撤回成功',
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
                    
        }).catch(() => {
            
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
    },
}
</script>

<style>
    .maskone .selsct_city{
        width: 96px;
    }
</style>

