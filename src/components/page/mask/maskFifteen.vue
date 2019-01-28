<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata">
                <div class="mask_tip mask_tip_color_one" v-if="formdata.plat_status == 5">待审核</div>
                <div class="mask_tip mask_tip_color_three" v-if="formdata.plat_status == 6">审核通过</div>
                <div class="mask_tip mask_tip_color_two" v-if="formdata.plat_status == 10">审核不通过</div>
                
                <div class="mask_tip_p">
                    <span>{{formdata.truename}}</span>
                    <span>{{formdata.sug_type.type_name}}</span>
                    
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
            
                <el-input type="textarea" readonly rows="3" v-model="formdata.content" placeholder=""></el-input>
               
                <div class="hr-top" style="margin-top:40px;"></div>

                <!--追问的回复 内容-->
                <div class="bg_color_f7">
                    <div v-if="formdata.chase_list != null">
                    <div v-for="(item,index) in formdata.chase_list.reply_list" :key="index">
                        <div class="bg_color_tip">
                            <h1>原回复</h1>
                            <div>
                                <span>{{formdata.chase_list.dept_name}}</span>
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
                    <h1>回复内容</h1>
                    <div>
                        <span>{{formdata.dept_name}}</span>
                        <span>{{formdata.uname}}</span>
                        <span>{{formdata.reply_list.created_at}}</span>
                    </div>
                </div>
                
                <!--图片上传-->
                <el-upload
                    :action="uploadImg"
                    accept="image/jpeg,image/png"
                    list-type="picture-card"
                    :limit ='6'
                    :on-success="uploadsuccess"
                    v-if="buttononestate == 2 && formdata.reply_list.attachments.length < 6" class="uploadImg_nolist"> 
                    <i class="el-icon-plus"></i>
                    <p>只可上传6张</p>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <!--图片展示-->
                <ul class="el-upload-list el-upload-list--picture-card">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in formdata.reply_list.attachments" :key="index">
                        <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
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
                <el-input type="textarea" :readonly="isReadOnlyOne" rows="3" v-model="formdata.reply_list.reply" placeholder=""></el-input>

                <div  v-if="formdata.plat_status == 10">
                    <div class="modify" v-if="buttononestate == 1">
                        <el-button plain class="handle-modify mr10" @click="readonlyonestate" >修 改</el-button>
                    </div>
                    <div class="el-dialog__footer quill-editor-footer" v-if="buttononestate == 2">
                        <span slot="footer" class="dialog-footer">
                            <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                            <el-button type="primary" @click="quillconfirmReply()">确定</el-button>
                        </span>
                    </div>
                </div>
                <!--备注-->
                <div class="bg_color_tip">
                    <h1>备注</h1>
                </div>
                <el-input type="textarea"  rows="3" v-model="formdata.reply_list.remark" placeholder="建议将该问题对外隐藏！"></el-input>
                
                <div class="hr-top" v-if="formdata.plat_status == 10"></div>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="formdata.plat_status == 10">
                <el-button type="primary" @click="adoptsubmit">提交回复</el-button>
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
               
                is_top:'',
                is_show:'',

                //回复
                dept_name:'',
                uname:'',
                chase_list:{
                    id:'',  //追问id
                    reply_list:[], //追问回复
                },
                //回复内容
                reply_list:{
                    attachments:[],     //回复图片列表
                    created_at:'',      //回复时间
                    id:'',
                    remark:'',
                    reply:'',
                    sug_id:'',
                },  
                remark:'',  //备注
                scope_time:'',
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

            //评分 分数
            scope:0, 
            disabledstate:false, 

            //评分 文字
            texts:['非常不满意 ', '不满意', '一般', '比较满意', '非常满意'],
                  
        }
    },
    watch:{
     
    },
    created(){
        Bus.$on('sendID',(data)=>{
            //console.log(data)
            if(data.plat_status == 5 || data.plat_status == 6 || data.plat_status == 10){
                this.editVisible = true;
                this.id = data.id;
                this.buttonstate = 1,
                this.buttononestate =1,
                this.desc='',
                this.textlength= 0,
                this.disabledstate =false,
                this.scope = data.scope,
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
                            remark: res.data.data.common.remark,
                            scope:res.data.data.common.scope,  //评分
                            scope_type:res.data.data.common.scope_type, //switch 开关
                            scope_time:res.data.data.common.scope_time, //评价时间

                            reply_list:res.data.data.common.reply_list,   //回复列表
                            chase_list:res.data.data.common.chase_list,  //追问列表
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
                        };
                        //switch 开关
                        if(res.data.data.common.scope_type == 1){
                            this.switchvalue =true
                        }else if(res.data.data.common.scope_type == 2){
                            this.switchvalue =false
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

        //提交回复
        adoptsubmit(){
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
                        this.editVisible =false;
                        Bus.$emit('detailChange',true);
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
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

