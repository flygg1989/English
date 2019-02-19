<template>
    <div class="mask maskone">
         <el-dialog :title="formdata.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="formdata" :model="formdata">
                <div class="mask_tip mask_tip_color_four" v-if="formdata.plat_status == 14">{{this.formdata.status_name}}</div>
                <div class="mask_tip mask_tip_color_three" v-if="formdata.plat_status == 15">{{this.formdata.status_name}}</div>
                
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
                
                    <el-input type="textarea" readonly rows="3" v-model="formdata.content" placeholder=""></el-input>
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
                
                    <el-input type="textarea" readonly rows="3" v-model="formdata.chase_list.content" placeholder=""></el-input>

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
                        <el-input type="textarea" readonly rows="3" v-model="item.reply" placeholder=""></el-input>

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
                        <el-input type="textarea" readonly rows="3" v-model="item.reply" placeholder=""></el-input>
                        
                        <!--备注-->
                        <div class="bg_color_tip">
                            <h1>备注</h1>
                        </div>
                        <el-input type="textarea" readonly rows="3" v-model="item.remark" placeholder="建议将该问题对外隐藏！"></el-input>
                    </div>
                </div>


               
                
               

                <div class="hr-top"></div>
                <!-- 评分 -->
                <div class="bg_color_tip" v-if="formdata.plat_status == 14">
                    <h1>用户评价</h1>
                    <div>
                    </div>
                </div>

                <div class="bg_color_tip" v-if="formdata.plat_status == 15">
                    <h1>默认评价</h1><span class="bg_color_tip_sp">（用户超过评价期限）</span>
                    <div>
                       <span class="bg_color_tip_sp">评价时间：{{formdata.scope_time}}</span>
                    </div>
                </div>

                <el-form-item label="满意度评价："  class="rate_label">
                    <el-rate
                        v-model="scope"
                        :texts='texts'
                        disabled
                        show-text>
                        </el-rate>
                </el-form-item>

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
            },
            
            
            //图片显示状态
            buttononestate:1,
            dialogImageUrl:'',
            //switch 开关
            switchvalue:true,
            scope_type:'',

            //评分 分数
            scope:null, 

            //评分 文字
            texts:['非常不满意 ', '不满意', '一般', '比较满意', '非常满意'],
                  
        }
    },
    watch:{

    },
    created(){
        Bus.$on('sendID',(data)=>{
            console.log(data)
            if(data.plat_status == 14 || data.plat_status == 15 ){
                this.editVisible = true;
                this.id = data.id;
                this.buttononestate = 1,
                this.dialogVisible=false,
                this.scope = data.scope,
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
            }
        });
    },
    methods: {
        //图片 放大
        handlePictureCardPreview(item,index) {
            console.log(item,index)
            this.dialogImageUrl =item.url;
            this.dialogVisible = true;
            
        },
    },
}
</script>

<style>
    
</style>

