<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata" label-width="50px">
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 2">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 4">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 9">{{this.formdata.status_name}}</div>
                
                <div class="mask_tip_p">
                    <span>{{formdata.truename}}</span>
                    <span>{{formdata.sug_type.type_name}}</span>
                    <span>发布时间：{{formdata.created_at}}</span>
                </div>
                
                <ul class="imgstyleone" v-if="formdata.attachments.length <= 3">
                    <li v-for="(item,index) in formdata.attachments" :key="index"><img :src="item.url" alt=""></li>
                </ul>

                <el-carousel :interval="4000" type="card" height="200px" v-if="formdata.attachments.length > 3">
                    <el-carousel-item v-for="(item,index) in formdata.attachments" :key="index">
                        <img :src="item.url" alt="">
                    </el-carousel-item>
                </el-carousel>
            
                <el-input type="textarea" readonly rows="3" v-model="formdata.content" placeholder=""></el-input>

                <div class="hr-top"></div>

                <!--返回的回复 内容-->
                <div class="bg_color_f7">
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
                        <el-input type="textarea" rows="3" readonly v-model="item.reply" placeholder=""></el-input>
                    </div>

                    <div v-if="formdata.chase_list != null">
                        <div class="bg_color_tip">
                            <h1>原问题</h1>
                            <div>
                                <span>{{formdata.chase_list.type_name}}</span>
                                <span>提问时间：{{formdata.chase_list.created_at}}</span>
                            </div>
                        </div> 
                        <ul class="ReplyImg">
                            <li v-for="(item,index) in formdata.chase_list.attachments" :key="index"><img :src="item.url" alt=""></li>
                        </ul>                  
                        <el-input type="textarea" rows="3" readonly v-model="formdata.chase_list.content" placeholder=""></el-input>
                    </div>
                </div>

                    <!-- 回复 -->
                    <div class="bg_color_tip">
                        <h1>回复</h1>
                    </div>
                    
                    <!--图片上传-->
                    <el-upload
                        :action="uploadImg"
                        accept="image/jpeg,image/png"
                        list-type="picture-card"
                        :limit ='6'
                        :on-success="uploadsuccess"
                        v-if="replylist.attachments.length < 6" class="uploadImg_nolist"> 
                        <i class="el-icon-plus"></i>
                        <p>只可上传6张</p>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <!--图片展示-->
                    <ul class="el-upload-list el-upload-list--picture-card">
                        <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in replylist.attachments" :key="index">
                            <img :src="item" alt="" class="el-upload-list__item-thumbnail">
                            <a class="el-upload-list__item-name">
                                <i class="el-icon-document"></i>
                            </a>
                            <label class="el-upload-list__item-status-label"  v-if="buttononestate == 2">
                                <i class="el-icon-upload-success el-icon-check"></i>
                            </label>
                            <i class="el-icon-close"></i>
                            <i class="el-icon-close-tip">按 delete 键可删除</i>
                            <!---->
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item,index)">
                                    <i class="el-icon-zoom-in"></i>
                                </span><span class="el-upload-list__item-delete" @click="handleRemove(item,index)"  v-if="buttononestate == 2">
                                    <i class="el-icon-delete"></i>
                            </span></span>
                        </li>
                    </ul>
                    <el-input type="textarea"  rows="3" v-model="replylist.content" placeholder="请输入回复内容"></el-input>

                <!--备注-->
                <div class="bg_color_tip">
                    <h1>备注</h1>
                </div>
                <el-input type="textarea"  rows="3" v-model="replylist.remark" placeholder="可以将需要与管理员沟通的信息写在这里……"></el-input>

            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit()">申请退回</el-button>
                <el-button type="primary" @click="adoptsubmit">提 交</el-button>
            </span>
        </el-dialog>

        <!--申请退回原因 -->
        <el-dialog title="申请退回原因" :visible.sync="denyVisible" width="704px">
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
            API:domain.testUrl,   //全局接口
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

                //回复
                dept_name:'',
                uname:'',
                reply_list:[],   //回复的详情
                remark:'',  //备注

                chase_list:{
                    id:'',  //追问id
                }, //追问
            },

            
            isReadOnly:true,  //控制textarea是否可以编辑
            buttonstate:1,    //问题修改 显示隐藏
            isReadOnlyOne:true,  //回复控制textarea是否可以编辑
            buttononestate:1, //回复 问题修改 显示隐藏
            type: [],

            //申请退回
            denyVisible:false,
            desc:'',
            textlength:'0',

            //图片上传
            uploadImg:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
            dialogImageUrl: '',
            dialogVisible: false,

            //回复
            replylist:{
                attachments:[],
                content:'',
                remark:'',
            },
                  
        }
    },
    created(){
        Bus.$on('sendID',(data)=>{
            //console.log(data)
            if(data.plat_status == 2 || data.plat_status == 4 || data.plat_status == 9 ){
                this.editVisible = true;
                this.id = data.id;
                this.buttonstate = 1,
                this.buttononestate =1,
                this.desc='',
                this.replylist.attachments=[],
                this.replylist.content='',
                this.replylist.remark='',
                this.textlength= 0,
                //console.log(data)
                //获取  弹窗数据
                api.request({
                    url: "suggest/detail",
                    method: "GET",
                    data:{
                        id:this.id,
                        expand:'attachments,replyList.attachments,chaseList,sugType,member',
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
                            remark: res.data.data.common.remark,

                            reply_list:res.data.data.common.reply_list,   //回复列表

                            chase_list:res.data.data.common.chase_list,  //追问
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
        //提交
        adoptsubmit(){
            if(this.formdata.chase_list ==null){
                //回复 
                api.request({
                    url: 'suggest/reply',
                    method: "POST",
                    data:{
                        id:this.id,
                        //chase_id:this.formdata.chase_list.id,
                        content:this.replylist.content,
                        remark:this.replylist.remark,
                        files:this.replylist.attachments,
                    },
                    
                })
                .then(
                res => {
                    //console.log(res)
                    if (res.status == 200) {
                        if(res.data.state = true){
                            Bus.$emit('detailChange',true);
                            this.editVisible = false; 
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
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
            }else{
                //回复 
                api.request({
                    url: 'suggest/reply',
                    method: "POST",
                    data:{
                        id:this.id,
                        chase_id:this.formdata.chase_list.id,
                        content:this.replylist.content,
                        remark:this.replylist.remark,
                        files:this.replylist.attachments,
                    },
                    
                })
                .then(
                res => {
                    //console.log(res)
                    if (res.status == 200) {
                        if(res.data.state = true){
                            Bus.$emit('detailChange',true);
                            this.editVisible = false; 
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
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

        //问题修改  控制readonlystate 和按钮显示隐藏
        readonlystate(){
            this.isReadOnly = false;
            this.buttonstate = 2;
        },

        //问题修改 确定
        quillconfirm(){
            this.isReadOnly = true;
            this.buttonstate = 1;
        },

        //回复 问题修改
        readonlyonestate(){
            this.isReadOnlyOne = false;
            this.buttononestate = 2;
        },

        //回复 确定
        quillconfirmReply(){
            this.isReadOnlyOne = true;
            this.buttononestate = 1;
        },

        //图片上传 成功
        uploadsuccess(res, file) {
            //console.log(res)
            // console.log(file)
            if(res.state == true ){
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                });
                this.replylist.attachments = this.replylist.attachments.concat(res.data.common.src) ;
            }    
        },

        //图片 放大
        handlePictureCardPreview(item,index) {
            console.log(item,index)
            this.dialogImageUrl =this.formdata.reply_list.attachments[index].url;
            this.dialogVisible = true;
            
        },

        //图片 删除
        handleRemove(item,index) {
            console.log(index);
            this.formdata.reply_list.attachments.splice(index,1)
        },
        
        //saveEdit 不予处理
        saveEdit(){
            this.denyVisible = true;
        },

        //不予处理原因  文本框输入获取字数
        removeActive(e){
            this.textlength =this.desc.length
        },

        //申请退回原因 提交
        submit(){
            if(this.desc.length == 0){
                this.$notify.error({
                title: '错误',
                message: '原因不能为空！'
                });
            }else{
                api.request({
                    url: 'suggest/return',
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
                        if(res.data.state = true){
                            Bus.$emit('detailChange',true);
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.denyVisible =false;
                            this.editVisible =false;
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
    .maskone .selsct_city{
        width: 96px;
    }
    .uploadImg_nolist .el-upload-list {
        display: none;
    }
</style>

