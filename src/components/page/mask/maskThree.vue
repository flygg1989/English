<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata" label-width="50px">
                <div class="mask_tip mask_tip_color_one" v-if="formdata.plat_status == 5">{{this.formdata.status_name}}</div>
                
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
                
                    <el-input type="textarea" :readonly="isReadOnly" rows="3" v-model="formdata.chase_list.content" placeholder=""></el-input>
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
                            <el-input type="textarea" rows="3" readonly v-model="item.reply" placeholder=""></el-input>
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
                        <el-input type="textarea" rows="3" readonly v-model="formdata.content" placeholder=""></el-input>
                    </div>
                </div>

                <!-- 回复 -->
                <div v-if="formdata.chase_list && formdata.chase_list !=null">
                    <div v-for="(item,index) in formdata.chase_list.reply_list" :key="index" >
                        <div class="bg_color_tip">
                            <h1>回复内容</h1>
                            <div>
                                <span>{{formdata.dept_name}}</span>
                                <span>{{item.created_at}}</span>
                            </div>
                        </div>
                        <el-input type="textarea" :readonly="isReadOnlyOne" rows="3" v-model="item.reply" placeholder=""></el-input>
                        <div class="modify" v-if="buttononestate == 1">
                            <el-button plain class="handle-modify mr10" @click="readonlyonestate(index)" >修 改</el-button>
                        </div>
                        <div class="el-dialog__footer quill-editor-footer" v-if="buttononestate == 2">
                            <span slot="footer" class="dialog-footer">
                                <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                                <el-button type="primary" @click="quillconfirmReply()">确定</el-button>
                            </span>
                        </div>

                        <!--备注-->
                        <div class="bg_color_tip">
                            <h1>备注</h1>
                        </div>
                        <el-input type="textarea"  rows="3" v-model="item.remark" placeholder="建议将该问题对外隐藏！"></el-input>
                    </div>
                </div>

                <div v-if="formdata.chase_list == null">
                    <div v-for="(item,index) in formdata.reply_list" :key="index" >
                        <div class="bg_color_tip">
                            <h1>回复内容</h1>
                            <div>
                                <span>{{formdata.dept_name}}</span>
                                <span>{{item.created_at}}</span>
                            </div>
                        </div>
                        
                        <!--图片上传-->
                        <el-upload
                            :action="uploadImg"
                            accept="image/jpeg,image/png"
                            list-type="picture-card"
                            :limit ='6'
                            :on-success="uploadsuccess"
                            v-if="buttononestate == 2 && item.attachments && item.attachments.length < 6" class="uploadImg_nolist"> 
                            <i class="el-icon-plus"></i>
                            <p>只可上传6张</p>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                        <!--图片展示-->
                        <ul class="el-upload-list el-upload-list--picture-card">
                            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in item.attachments" :key="index">
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
                        <el-input type="textarea" :readonly="isReadOnlyOne" rows="3" v-model="item.reply" placeholder=""></el-input>
                        <div class="modify" v-if="buttononestate == 1">
                            <el-button plain class="handle-modify mr10" @click="readonlyonestate(index)" >修 改</el-button>
                        </div>
                        <div class="el-dialog__footer quill-editor-footer" v-if="buttononestate == 2">
                            <span slot="footer" class="dialog-footer">
                                <!-- <el-button type="" @click="quillcancel()">取消</el-button> -->
                                <el-button type="primary" @click="quillconfirmReply()">确定</el-button>
                            </span>
                        </div>

                        <!--备注-->
                        <div class="bg_color_tip">
                            <h1>备注</h1>
                        </div>
                        <el-input type="textarea"  rows="3" v-model="item.remark" placeholder="建议将该问题对外隐藏！"></el-input>
                    </div>
                </div>
                

                <div class="handle-box">
                    <el-checkbox-group v-model="type">
                        <el-checkbox label="置顶" name="type"></el-checkbox>
                        <el-checkbox label="隐藏" name="type" @change="checkchange(type)"></el-checkbox>
                    </el-checkbox-group>
                </div>

            </el-form>

            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="adoptsubmit()">审核通过</el-button>
                <el-button type="primary" @click="saveEdit">驳 回</el-button>
            </span>
        </el-dialog>

        <!--驳回 原因 -->
        <el-dialog title="驳回原因" :visible.sync="denyVisible" width="704px">
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
                chase_list:{
                    id:'',  //追问id
                    reply_list:[], //追问回复
                }, 
                remark:'',  //备注
            },

            ComplaintList:[], //投诉类型列表
           
            isReadOnly:true,  //控制textarea是否可以编辑
            buttonstate:1,    //问题修改 显示隐藏
            isReadOnlyOne:true,  //回复控制textarea是否可以编辑
            buttononestate:1, //回复 问题修改 显示隐藏
            type: [],

            //不予处理
            denyVisible:false,
            desc:'',
            textlength:'0',

            //图片上传
            uploadImg:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
            dialogImageUrl: '',
            dialogVisible: false,
            uploadImgList:[],

            BtnNum:'0', //第几个修改
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
            if(data.plat_status == 5){
                this.editVisible = true;
                this.id = data.id;
                this.buttonstate = 1,
                this.buttononestate =1,
                this.desc='',
                this.textlength= 0,
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
        
        //审核通过 
        adoptsubmit(){
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
                        }
                    }
                },
                res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                });

                //回复 修改
                api.request({
                    url: 'suggest/reply/save',
                    method: "POST",
                    data:{
                        id:this.id,
                        replyId:this.formdata.reply_list[this.BtnNum].id,
                        content:this.formdata.reply_list[this.BtnNum].reply,
                        remark:this.formdata.reply_list[this.BtnNum].remark,
                        files:this.uploadImgList,
                    },
                })
                .then(
                res => {
                    //console.log(res)
                    if (res.status == 200) {
                        if(res.data.state = true){
                            console.log('回复 修改成功')
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
                        }
                    }
                },
                res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                });

                //回复 追问 修改
                api.request({
                    url: 'suggest/reply',
                    method: "POST",
                    data:{
                        id:this.id,
                        chase_id:this.formdata.chase_list.reply_list[0].id,
                        content:this.formdata.chase_list.reply_list[0].reply,
                        remark:this.formdata.chase_list.reply_list[0].remark,
                    },
                })
                .then(
                res => {
                    //console.log(res)
                    if (res.status == 200) {
                        if(res.data.state = true){
                            console.log('回复 修改成功')
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
            
            

            //回复 审核通过
            api.request({
                url: 'suggest/reply/verify',
                method: "GET",
                data:{
                    id:this.id
                },
            })
            .then(
            res => {
                //console.log(res)
                if (res.status == 200) {
                    if(res.data.state = true){
                        Bus.$emit('detailChange',true);
                        this.$notify({
                            title: '审核通过',
                            message: '3秒后自动关闭',
                            type: 'success'
                        });
                        this.editVisible = false; 
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

        //回复 问题修改
        readonlyonestate(index){
            console.log(index)
            this.BtnNum =index
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
            if(res.state == true ){
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                });
                this.formdata.reply_list[this.BtnNum].attachments = this.formdata.reply_list[this.BtnNum].attachments.concat({url:res.data.common.src}) ;
                this.uploadImgList = this.uploadImgList.concat(res.data.common.src);
            }  
            console.log( this.uploadImgList)  
        },

        //图片 放大
        handlePictureCardPreview(item,index) {
            console.log(item,index)
            this.dialogImageUrl =item.url;
            this.dialogVisible = true;
            
        },

        //图片 删除
        handleRemove(item,index) {
            console.log(item);
            if(item.id){
                api.request({
                    url: 'attachment/delete',
                    method: "GET",
                    data:{
                        id:item.id,
                    },
                })
                .then(
                res => {
                    console.log(res)
                    if (res.status == 200) {
                        if(res.data.state = true){
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            this.formdata.reply_list[this.BtnNum].attachments.splice(index,1)
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
                this.formdata.reply_list[this.BtnNum].attachments.splice(index,1)
                this.uploadImgList =this.uploadImgList.splice(index,1) 
            }
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
                    url: 'suggest/reject',
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

