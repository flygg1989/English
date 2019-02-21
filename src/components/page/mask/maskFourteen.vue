<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata">
                <div class="mask_tip mask_tip_color_one" v-if="plat_status == 7">{{status_name}}</div>
                <div class="mask_tip mask_tip_color_three" v-if="plat_status == 8">{{status_name}}</div>
                <div class="mask_tip mask_tip_color_two" v-if="plat_status == 9">{{status_name}}</div>
                
                <div class="mask_tip_p">
                    <span>{{formdata.truename}}</span>
                    <span>{{formdata.sug_type.type_name}}</span>
                    
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
                </div>

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
            </el-form>
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
            plat_status:'',
            status_name:'',
            formdata:{
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
               
                is_top:'',
                is_show:'',

                //回复
                dept_name:'',
                uname:'',
                reply_list:[],   //回复的详情
                chase_list:{
                    id:'',  //追问id
                    reply_list:[], //追问回复
                },
                
                remark:'',  //备注
                scope_time:'',

                 //评分 分数
                scope:null, 
                //
                log:[], //驳回原因
            },

            ComplaintList:[], //投诉类型列表
            
            isReadOnly:true,  //控制textarea是否可以编辑
            buttonstate:1,    //问题修改 显示隐藏
            isReadOnlyOne:true,  //回复控制textarea是否可以编辑
            buttononestate:1, //回复 问题修改 显示隐藏
            type: [],

            //图片上传
            uploadImg:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
            dialogImageUrl: '',
            dialogVisible: false,
            uploadImgList:[],

            //switch 开关
            switchvalue:true,
            scope_type:'',


            //评分 文字
            texts:['非常不满意 ', '不满意', '一般', '比较满意', '非常满意'],
                  
        }
    },
    watch:{

    },
    created(){
        Bus.$on('sendID',(data)=>{
            console.log(data)
            if(data.op_status == 7 || data.op_status == 8 || data.op_status == 9 ){
                this.editVisible = true;
                this.id = data.sugid;
                this.plat_status =data.op_status;
                if(data.platform){
                    this.status_name =data.platform.verifyName;
                }else{
                    this.status_name =data.verifyName;
                }
                
                this.buttonstate = 1,
                this.buttononestate =1,
                //console.log(data)
                //获取  弹窗数据
                api.request({
                    url: "suggest/detail",
                    method: "GET",
                    data:{
                        id:this.id,
                        expand:'attachments,replyList.attachments,replyList.user,chaseList.sugType,chaseList.attachments,chaseList.replyList,chaseList.replyList.attachments,sugType,member',
                    }
                }).then(res=>{
                    console.log(res.data.data.common)
                    if(res.status == 200){
                        this.formdata={
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
                            scope:res.data.data.common.scope,  //评分
                            scope_type:res.data.data.common.scope_type, //switch 开关
                            scope_time:res.data.data.common.scope_time, //评价时间

                            reply_list:res.data.data.common.reply_list,   //回复列表
                            chase_list:res.data.data.common.chase_list,  //追问列表
                            log:res.data.data.common.log,

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
        //投诉下拉菜单选择事件
        Complaintclick(item,index) {
            //console.log(item)

            this.formdata.sug_type.type_id =item.id
            this.formdata.sug_type.type_name =item.type_name
        },
        
        //隐藏选择
        checkchange(type){
            if(type = ['']){
                this.$confirm('该问题在客户端将仅对提问用户可见', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {}).catch(() => {});
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
            //先提交原文修改
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
                //console.log(res)
                if (res.status == 200) {
                    if(res.data.state == false){
                        this.$notify.error({
                            title: "错误",
                            message: res.data.message
                        });
                    }else{
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        });
                        Bus.$emit('detailChange',true);
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

        //回复 问题修改
        readonlyonestate(){
            this.isReadOnlyOne = false;
            this.buttononestate = 2;
        },

        //回复 确定
        quillconfirmReply(){
            this.isReadOnlyOne = true;
            this.buttononestate = 1;
            //提交 回复-修改
            api.request({
                url: 'suggest/reply/save',
                method: "post",
                data:{
                    replyId: this.formdata.reply_list.id,
                    id:this.id,
                    content:this.formdata.reply_list.content,
                    remark:this.formdata.reply_list.remark,
                    files:this.uploadImgList,
                }
            })
            .then(
            res => {
                //console.log(res)
                if (res.status == 200) {
                    if(res.data.state == false){
                        this.$notify.error({
                            title: "错误",
                            message: res.data.message
                        });
                    }else{
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        });
                        Bus.$emit('detailChange',true);
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

        //图片上传 成功
        uploadsuccess(res, file,index) {
            //console.log(res)
            if(res.state == true ){
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                });
                this.formdata.reply_list.attachments = this.formdata.reply_list.attachments.concat({url:res.data.common.src}) ;
                this.uploadImgList = this.uploadImgList.concat(res.data.common.src);
                //console.log(this.uploadImgList)
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
        
    },
}
</script>

<style>
    
</style>

