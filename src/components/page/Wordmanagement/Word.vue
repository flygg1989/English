<template>
  <div class="Word">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" @click="handlefound" class="creat-branch-btn">创建单词</el-button>
        </div>
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入要查询的内容"
            prefix-icon="el-icon-search"
            v-model="searchValue">
          </el-input>
          <el-button type="primary" @click="handleSreach" class="search-btn">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        height="100%"
        empty-text="没有更多数据了"
        header-row-class-name="table-header"
        style="width:100%;">
        <el-table-column
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="id"
          label="ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="name"
          label="单词名称"
          min-width="144">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="150">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          <!-- <div class="table2-2">
            <el-switch
              :value="scope.row.status==2?true:false"
              inactive-text="禁用启用"
              active-color="#3CD970"
              @change="switchList(scope.row)"
              inactive-color="#DFE5EB">
            </el-switch>
          </div> -->
        </template>
      </el-table-column>
      </el-table>
      <div class="table-footer">
        <!--<div class="footer-left">-->
          <!--<el-button plain type="primary">刷新</el-button>-->
          <!--<el-button plain type="primary" @click="handleShield">屏蔽</el-button>-->
          <!--<el-button plain type="primary">取消屏蔽</el-button>-->
        <!--</div>-->
        <div class="footer-right">
          <el-pagination
            background
            v-show="tableList.length!==0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <!--创建 编辑弹窗--->
      <el-dialog :title="title" :visible.sync="editVisible" :close-on-click-modal="false" width="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="单词名称"  prop="name">
              <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="单词读音"  prop="pronunciation">
              <el-input v-model.trim="form.pronunciation"></el-input>
          </el-form-item>
          <el-form-item label="单词发音"  prop="fayin">
              <el-upload
              class="avatar-uploader"
              :action="uploadvoice"
              :show-file-list="false"
              accept="audio/mp3"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <audio-player v-if="form.voiceUrl" :src="form.voiceUrl"/>
              <i v-else class="el-icon-lx-voice avatar-uploader-icon"></i>
              <p class="avatar-uploader-p">读音上传</p>
            </el-upload>
          </el-form-item>
          
          <!--添加词性-->
          <div v-for="(item,num) in speechList" :key="num" class="border_both">
            <el-form-item label="单词词性">
              <el-input v-model.trim="item.speechname"></el-input>
            </el-form-item>
            <!--释义--->
            <div class="border_b">
              <div v-for="(subitem,index) in item.InterpretationList" :key="index">
                <el-form-item label="单词释义">
                  <el-input v-model.trim="subitem.Interpretation"></el-input>
                </el-form-item>
                <el-form-item label="中文释义">
                  <el-input v-model.trim="subitem.CN_Interpretation"></el-input>
                </el-form-item>
                <el-form-item label="发音">
                   <el-upload
                    class="avatar-uploader"
                    :action="uploadvoice"
                    :show-file-list="false"
                    accept="audio/mp3"
                    :on-success="handleSuccess"
                    :before-upload="beforeAvatarUpload">
                    <audio-player v-if="subitem.voiceUrl" :src="subitem.voiceUrl"/>
                    <i v-else class="el-icon-lx-voice avatar-uploader-icon"></i>
                    <p class="avatar-uploader-p">读音上传</p>
                  </el-upload>
                </el-form-item>
                <el-form-item label="">
                  <el-button type="primary" plain @click="addInterpretation(num,subitem,index)">添加释义</el-button>
                  <el-button type="danger" plain @click="delInterpretation(num,subitem,index)">删除释义</el-button>
                </el-form-item>
              </div>
            </div>
            <!--例句--->
            <div class="border_b">
              <div v-for="(subitem,index) in item.sentenceList" :key="index">
                <el-form-item label="英文例句">
                  <el-input v-model.trim="subitem.EN_sentenceList"></el-input>
                </el-form-item>
                <el-form-item label="中文例句">
                  <el-input v-model.trim="subitem.CN_sentenceList"></el-input>
                </el-form-item>
                <el-form-item label="发音">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadvoice"
                    :show-file-list="false"
                    accept="audio/mp3"
                    :on-success="handleSuccess"
                    :before-upload="beforeAvatarUpload">
                    <audio-player v-if="subitem.voiceUrl" :src="subitem.voiceUrl"/>
                    <i v-else class="el-icon-lx-voice avatar-uploader-icon"></i>
                    <p class="avatar-uploader-p">读音上传</p>
                  </el-upload>
                </el-form-item>
                <el-form-item label="">
                  <el-button type="primary" plain @click="addsentence(num,subitem,index)">添加例句</el-button>
                  <el-button type="danger" plain  @click="delsentence(num,subitem,index)">删除例句</el-button>
                </el-form-item>
              </div>
            </div>

            <el-form-item label="" style="text-align:center">
                <el-button type="primary" @click="addspeech(item,num)">添加词性</el-button>
                <el-button type="danger" @click="delspeech(item,index)">删除词性</el-button>
              </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="editVisible = false">取消</el-button>
            <el-button type="primary" v-if="submitstate==1" @click="submitForm('form')">创建</el-button>
            <el-button type="primary" v-if="submitstate==2" @click="submitedit('form')">编辑</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
    import api from '@/utils/api'
    const memberList ='member'
    const changMeberStaut='member/save'
export default {
  data(){
    return {
      searchValue:"",
      tableList:[],
      currentPage:1,
      total:0,
      pageSize:5,

      editVisible:false,
      title:'',
      submitstate:1,

      uploadvoice:domain.testUrl+'upload?token='+localStorage.getItem('sk'),
      
      //新建
      form:{
        name:'',
        pronunciation:'',
        VoiceUrl:'',
      },

      //词性列表
      speechList:[
        {
          speechname:'',  //词性名称
          //释义列表
          InterpretationList:[
            {Interpretation:'',CN_Interpretation:'',VoiceUrl:'',}
          ],
           //例句列表
          sentenceList:[
            {EN_sentenceList:'',CN_sentenceList:'',VoiceUrl:'',}
          ], 
        }
      ],
        
      

      
      //表单验证
      rules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min:2, max: 11, message: '名称长度为2-11位', trigger: 'blur'}
        ],
        pronunciation:[
          {required: true, message: '请输入读音', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
      async getSreach(){
          try{
              let res =  await api.request({
                  url:memberList,
                  method:'GET',
                  data:{
                      wd:this.searchValue
                  }
              });
              this.tableList=res.data.data.common.data
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },

      //打开创建窗口
      handlefound(){
        this.title="创建学习内容";
        this.submitstate=1,
        this.form={
          name:'',
          loginpassword:'',
          email:'',
          mobile:'',
          sex:'',
          imageUrl:'',
        }
        this.editVisible=true;
      },

      //上传录音
     handleAvatarSuccess(res, file) {
       console.log(res)
       console.log(file)
        this.form.imageUrl = URL.createObjectURL(file.raw);
      },

      //上传释义和例句录音
      handleSuccess(res,file){
        
        console.log(res)
        console.log(file)
        //this.speechList[num].InterpretationList[index].VoiceUrl
      },

      //录音上传前
      beforeAvatarUpload(file) {
        //console.log(file)
        const isMP3 = file.type === 'audio/mp3';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isMP3) {
          this.$message.error('上传音频只能是 MP3 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传音频大小不能超过 2MB!');
        }
        return isMP3 && isLt2M;
      },

      //添加词性
      addspeech(item,index){
        //console.log(index)
        this.speechList=this.speechList.concat(
        {
          speechname:'',  //词性名称
          //释义列表
          InterpretationList:[
            {Interpretation:'',CN_Interpretation:'',VoiceUrl:'',}
          ],
           //例句列表
          sentenceList:[
            {EN_sentenceList:'',CN_sentenceList:'',VoiceUrl:'',}
          ], 
        }
      )
      },

      //删除词性
      delspeech(item,index){
        this.speechList.splice(index,1);
      },

      //添加释义
      addInterpretation(num,item,index){
        // console.log(num)
        // console.log(item)
        // console.log(index)
        this.speechList[num].InterpretationList=this.speechList[num].InterpretationList.concat({Interpretation:'',CN_Interpretation:'',VoiceUrl:'',})
      },

      //删除释义
      delInterpretation(num,item,index){
        //console.log(index)
        this.speechList[num].InterpretationList.splice(index,1);
      },

      //添加例句
      addsentence(num,item,index){
        this.speechList[num].sentenceList=this.speechList[num].sentenceList.concat({EN_sentenceList:'',CN_sentenceList:'',VoiceUrl:'',})
      },

      //删除例句
      delsentence(num,item,index){
        this.speechList[num].sentenceList.splice(index,1);
      },

      //创建提交
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: 'success'
                });
                this.editVisible =false;
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },

      //编辑
      handleedit(row){
        this.title="编辑学习内容";
        this.submitstate=2;
        this.form=row
        this.editVisible=true;
      },

      //删除
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableList.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //搜索
      handleSreach(){
          this.searchValue? this.getSreach():this.$notify.error({
              title: "错误",
              message: "请输入关键字"
          })
      },

      //初始化
      // async initList(page,limit){
      //     console.log('init')
      //     try{
      //         let get = await api.request({
      //             url:memberList,
      //             method:'GET',
      //             data:{
      //                 page:page,
      //                 limit: limit,
      //             }
      //         })
      //         let arr=get.data.data.common.data
      //         this.tableList=arr
      //         this.total=get.data.data.common.total;
      //         console.log(  this.tableList)
      //     }catch (e) {
      //         this.$notify.error({
      //             title: "错误",
      //             message: "数据请求失败"
      //         })
      //     }
      // },
    
      //每页数量
    async handleSizeChange(val) {
        this.pageSize=val
        this.currentPage=1
      this.initList(this.currentPage,this.pageSize)

    },
      //当前选择页
    async handleCurrentChange(val) {

        this.initList(val,this.pageSize)
    }
  },
  mounted(){
    this.initList(this.currentPage,this.pageSize)
  }
}
</script>
<style>
.Word{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
.Word .operation{
  justify-content:flex-between;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .border_b{
    border-bottom: 1px solid #e5e5e5;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 140px;
    line-height: 130px;
    text-align: center;
}
  .border_both{
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
  }
</style>
