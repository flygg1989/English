<template>
    <div class="mask">
         <el-dialog :title="form.title" :visible.sync="editVisible" :close-on-click-modal="false" width="864px">
            <el-form ref="form" :model="form" label-width="50px">
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 1">待审核</div>
                <div class="mask_tip mask_tip_color_three" v-if="form.state == 2">审核通过</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 3">追问待审核</div>
                <div class="mask_tip mask_tip_color_three" v-if="form.state == 4">审核通过</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 5">回复待审核</div>
                <div class="mask_tip mask_tip_color_five" v-if="form.state == 6">已审核</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 7">退回待审核</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 8">待审核</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 9">待审核</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 10">待审核</div>
                <div class="mask_tip mask_tip_color_two" v-if="form.state == 11">不予处理</div>
                <div class="mask_tip mask_tip_color_two" v-if="form.state == 12">不予处理</div>
                <div class="mask_tip mask_tip_color_one" v-if="form.state == 13">待审核</div>
                <div class="mask_tip mask_tip_color_five" v-if="form.state == 14">已评价</div>
                <div class="mask_tip mask_tip_color_four" v-if="form.state == 15">已办结</div>
                <div class="mask_tip mask_tip_color_five" v-if="form.state == 16">待处理</div>
                <div class="mask_tip mask_tip_color_five" v-if="form.state == 17">追问待处理</div>
                
                <div class="mask_tip_p">
                    <span>{{form.username}}先生/女士</span>
                    <span>投诉：{{form.Complaint}}</span>
                    <span>时间：{{form.time}}</span>
                </div>
                
                <ul class="imgstyleone" v-if="form.imglist.length <= 3">
                    <li v-for="(item,index) in form.imglist" :key="index"><img :src="item.img" alt=""></li>
                </ul>

                <el-carousel :interval="4000" type="card" height="200px" v-if="form.imglist.length > 3">
                    <el-carousel-item v-for="(item,index) in form.imglist" :key="index">
                        <img :src="item.img" alt="">
                    </el-carousel-item>
                </el-carousel>
            
                <el-input type="textarea" :readonly="isReadOnly" rows="3" v-model="form.desc" placeholder=""></el-input>
                <div class="modify">
                    
                </div>

                <div class="bg_color_f7">
                    <div class="bg_color_tip">
                        <h1>原回复</h1>
                        <div>
                            <span>{{form.Originalreply.Company}}</span>
                            <span>{{form.Originalreply.user}}</span>
                            <span>{{form.Originalreply.time}}</span>
                        </div>
                    </div>

                    <!--回复图片展示-->
                    <ul class="ReplyImg">
                        <li v-for="(item,index) in ReplyImg" :key="index"><img :src="item.img" alt=""></li>
                    </ul>
                    <el-input type="textarea" rows="3" readonly v-model="form.reply" placeholder=""></el-input>

                    <div class="bg_color_tip">
                        <h1>原问题</h1>
                        <div>
                            <span>投诉</span>
                            <span>提问时间：{{form.Originalreply.time}}</span>
                        </div>
                    </div>

                    <!--回复图片展示-->
                    <ul class="ReplyImg">
                        <li v-for="(item,index) in issueImg" :key="index"><img :src="item.img" alt=""></li>
                    </ul>
                    <el-input type="textarea" rows="3" readonly v-model="form.reply" placeholder=""></el-input>

                </div>

                <div class="bg_color_tip">
                    <h1>追问回复</h1>
                </div>
                
                <!--图片上传-->
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                    <p>只可上传6张</p>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                
                <!-- 回复 文本 -->
                <el-input type="textarea"  rows="3" v-model="form.content" placeholder=""></el-input>
                
                <div class="bg_color_tip">
                    <h1>备注</h1>
                </div>
                <el-input type="textarea"  rows="1" v-model="Remarks" placeholder="可以将需要与管理员沟通的信息写在这里……"></el-input>     
                
                <div class="hr-top"></div>

            </el-form>

            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="passsubmit()">申请退回</el-button>
                <el-button type="primary" @click="saveEdit">提 交</el-button>
            </span>
        </el-dialog>


         <!--申请退回原因-->
        <el-dialog title="申请退回原因" :visible.sync="denyVisible" width="704px">
            <el-input type="textarea" rows="10" v-model="desc" :maxlength="200"  @input="removeActive($event)" placeholder="请输入驳回原因，200个字符以内"></el-input>
            <i class="num">{{textlength}}/200</i>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="denyVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="submit"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提   交 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </el-button>
            </span>
        </el-dialog>

        
    </div>
</template>

<script>

export default {
    data() {
        return {
            
            editVisible: true,
            form:{
                //弹窗状态
                state:'17',
                title:'雄楚大道交叉口向西一百米路南有坑',
                username:'崔',
                Complaint:'类型1',
                time:'2018-04-10 16:30:20',
                imglist:[
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                   
                ],
                desc:'硚口区古田二路海尔国际广场交房接近1年，拿到权属后仍然在政务中心办不了证，跑了N次了，房产查不到动产单元号，不动产窗口却可以。好多业主着急办证，却卡在了房产这里，请问房产局能早日处理好这个事？硚口区古田二路海尔国际广场交房接近1年，拿到权属后仍然在政务中心办不了证。',
                options: [],
                 //原回复
                Originalreply:{
                    Company:'武汉交通局',
                    user:'管理员',
                    time:'2018-04-10 16:30:20',
                },  
                reply:'硚口区古田二路海尔国际广场交房接近1年，拿到权属后仍然在政务中心办不了证，跑了N次了，房产查不到动产单元号，不动产窗口却可以。好多业主着急办证，却卡在了房产这里，请问房产局能早日处理好这个事？',
               
                
                reply:'硚口区古田二路海尔国际广场交房接近1年，拿到权属后仍然在政务中心办不了证，跑了N次了，房产查不到动产单元号，不动产窗口却可以。好多业主着急办证，却卡在了房产这里，请问房产局能早日处理好这个事？',
                content: '尊敬的崔女士，您好！您关心的问题回复如下：可以可以，这事儿得办！',

            },
            isReadOnly:true,  //控制textarea是否可以编辑
            type: [],
            select_province:'',
          
            select_branch:'',
            options:[
                    {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],

            //原回复 图片
            ReplyImg:[
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
            ],
            //原问题 图片
            issueImg:[
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
                    {
                        img:'http://img12.3lian.com/gaoqing02/06/03/34.jpg'
                    },
            ],

            //申请退回
            denyVisible: false,
            desc:'',
            textlength:'0',
            
            
            //备注
            Remarks:'',

            //图片上传
            dialogImageUrl: '',
            dialogVisible: false
            
           
        }
    },
    
    watch:{
        type(odd,active){
            console.log(odd,active)
            if(odd =="隐藏"){
               this.$confirm('该问题在客户端将仅对提问用户可见', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }) 
            }
        },
    },
    methods: {
       
        //文本框输入获取字数
        removeActive(e){
            this.textlength =this.desc.length
        },
        //申请退回 弹框
        passsubmit(){
            this.denyVisible =true
        },
        //申请退回 提交
        submit(){
            if(this.desc.length == 0){
                this.$notify.error({
                title: '错误',
                message: '原因不能为空！'
                });
            }else{
                this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                });
                this.denyVisible =false
            }
        },
        //提交
        saveEdit(){
            this.$notify({
                title: '成功',
                message: '审核通过',
                type: 'success'
            });
            this.editVisible =false
        },
        //图片上传
        handleRemove(file, fileList) {
             console.log(file, fileList);
        },
        //图片上传
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    },
}
</script>

<style>
    textarea{
        font-family: Microsoft YaHei;
    }
    .el-dialog__header{
        text-align: center ;
        color: #2D3557 !important;
        font-size: 20px !important;
    }

    /********状态**********/
    .mask_tip{
        position: absolute;
        top: 0;
        left: 32px;
        padding: 14px 33px;
        border-radius: 0  0  8px 8px;
        font-size: 18px;
        color: #fff;
    }
    /****状态底色****/
    .mask_tip_color_one{
        background: #FF6D4A;
    }
    .mask_tip_color_two{
        background: #FF5161;
    }
    .mask_tip_color_three{
         background: #2CD696;
    }
    .mask_tip_color_four{
         background: #4D84FF;
    }
    .mask_tip_color_five{
         background: #4D84FF;
    }
 
    /********/
    .el-dialog__body{
        padding: 10px 30px;
    }
    /***** 第二行文字******/
    .mask_tip_p{
        padding: 15px 0;
        font-size: 16px;
        color: #2D3557;
    }
    .mask_tip_p span{
        margin-right: 100px;
    }
    .mask_tip_p span i{
        color: #4D84FF
    }
    .mask_tip_p span:last-child{
        margin-right: 0;
        float: right;
    }
    
    /***** 图片展示 ******/
    .imgstyleone{
        overflow: hidden;
        margin: 20px 0;
    }
    .imgstyleone li{
        list-style: none;
        float: left;
        width: 256px;
        height: 192px;
        margin-right: 15px;
    }
    .imgstyleone li:last-child{
        margin-right: 0;
    }
    .imgstyleone li img{
        width: 100%;
        max-height: 192px;
    }

    /***** 轮播版 图片展示 ******/
    .el-carousel__indicators{
        display: none;
    }
    .el-carousel__item img{
        width:100%;
        max-height: 300px;
    }
    .el-carousel__container{
        margin: 15px 0;
    }

    /***** 文本框 ******/
    .el-textarea__inner{
        font-size: 16px;
        color: #2D3557;
    }

    /***** 部门 人员 事件  文字******/
    .modify{
        overflow: hidden;
        height: 56px;
        border-bottom: 1px solid #DFE5EB;
    }
    .handle-modify{
        float: right;
        margin: 16px 0;
        border-color: #4D84FF;
        color: #4D84FF;
    }

    .handle-box {
        margin: 20px 0;
        overflow: hidden;
    }

    /***** 选择 城市******/
    .handle-select {
        width: 120px;
        margin-right: 10px;
        font-size: 14px;
        color: #2D3557;
    }
    .el-checkbox-group{
        float: right;
        font-size: 14px;
        
    }
    .el-checkbox__label{
        color: #2D3557;
        line-height: 32px;
    }
    .num{
        color: #2D3557;
        font-size: 12px;
        position: absolute;
        bottom:75px;
        right: 40px;
        font-style: normal;
    }


    .bg_color_f7{
        width:752px;
        padding: 0 24px;
        margin: 20px 0;
        background:rgba(247,247,248,1);
        overflow: hidden;
    }
    .bg_color_tip{
        line-height: 56px;
        overflow: hidden;
    }
    .bg_color_tip h1{
        font-size: 20px;
        color: #2D3557;
        font-weight: bold;
        float: left;
    }
    .bg_color_tip div{
        float: right;
    }
    .bg_color_tip div span{
        margin-left:24px; 
    }
    .bg_color_f7 .el-textarea__inner{
        background: none;
       margin-bottom: 20px;
    }
    /*****  富文本 ******/
    .ql-container{
        min-height: 110px;
        max-height:300px !important;
        font-size: 16px;
    }
    .el-input {
        margin-bottom:16px; 
    }

    .quill-editor-footer{
        padding: 10px 0 0px 0;
    }

    .hr-top{
        margin: 20px 0;
        border-top: 1px solid #DFE5EB;
    }
    
    /**回复 图片**/
    .ReplyImg{
        overflow: hidden;
        margin-bottom: 16px;
    }
    .ReplyImg li{
        list-style: none;
        float: left;
        margin-right: 16px;
        width: 112px;
        height: 112px;
        border-radius: 5px;
        overflow: hidden;
    }
    .ReplyImg li img{
        width: 100%;
        height: 100%;
    }
    .ReplyImg li:last-child{
        margin-right: 0;
    }
    /**图片上传**/
    .el-upload{
        width: 112px;
        height: 112px;
        line-height: 112px;
        margin-bottom: 20px;
    }
    .el-upload p{
        position: relative;
        top: -80px;
    }
</style>

