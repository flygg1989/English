<template>
    <div class="mask maskone">
        <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata">
                <i class="el-icon-caret-bottom el-icon-edit edit-title" @click="edittitle"></i>
                <div class="mask_tip mask_tip_color_three" v-if="formdata.plat_status ==6">{{formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_three" v-if="formdata.plat_status == 8">{{formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_two" v-if="formdata.plat_status == 9">{{formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_two" v-if="formdata.plat_status == 10">{{formdata.status_name}}</div>
                
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
                        <el-input type="textarea" :readonly="isReadOnlyOne" autosize v-model="item.reply" placeholder=""></el-input>
                        
                        <!--备注-->
                        <div class="bg_color_tip">
                            <h1>备注</h1>
                        </div>
                        <el-input type="textarea"  autosize v-model="item.remark" placeholder="建议将该问题对外隐藏！"></el-input>
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
                        <el-input type="textarea" :readonly="isReadOnlyOne" autosize v-model="item.reply" placeholder=""></el-input>
                        
                        <!--备注-->
                        <div class="bg_color_tip">
                            <h1>备注</h1>
                        </div>
                        <el-input type="textarea"  autosize v-model="item.remark" placeholder="建议将该问题对外隐藏！"></el-input>
                    </div>
                </div>
                
                <!-- 评分 -->
                <div class="bg_color_tip">
                    <h1>用户评价</h1>
                    <div>
                       <el-switch 
                       active-color="#3CD970"
                       inactive-color="#dcdfe6"
                       disabled
                       v-model="switchvalue">
                       </el-switch>
                    </div>
                </div>

                <el-form-item label="满意度评价："  class="rate_label">
                    <el-rate
                        v-model="formdata.scope"
                        disabled
                        :texts='texts'
                        show-text>
                        </el-rate>
                </el-form-item>

                <div class="handle-box">
                    <el-checkbox-group v-model="type">
                        <el-checkbox label="置顶" disabled name="type"></el-checkbox>
                        <el-checkbox label="隐藏" disabled name="type"></el-checkbox>
                    </el-checkbox-group>
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
                scope:null,  //评分

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

            //switch 开关
            switchvalue:true,

            //评分
            texts:['非常不满意 ', '不满意', '一般', '比较满意', '非常满意'],
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
            if(data.op_status == 6 || data.op_status == 10 || data.op_status == 8 || data.op_status == 9){
                this.editVisible = true;
                this.formdata.plat_status= data.op_status,
                this.formdata.status_name =data.verifyName,
                this.id = data.sugid;
                this.buttonstate = 1,
                this.buttononestate =1,
                this.desc='',
                this.textlength= 0,
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
                            plat_status:data.op_status,
                            status_name:data.verifyName,
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
                            uname:res.data.data.common.sug_type.type_name,
                            scope:res.data.data.common.scope,  //评分
                            scope_type:res.data.data.common.scope_type, //switch 开关

                            reply_list:res.data.data.common.reply_list,   //回复列表
                            chase_list:res.data.data.common.chase_list,  //追问列表
                        }
                       
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
        
        //图片 放大
        handlePictureCardPreview(item,index) {
            console.log(item,index)
            this.dialogImageUrl =this.formdata.reply_list.attachments[index].url;
            this.dialogVisible = true;
            
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

