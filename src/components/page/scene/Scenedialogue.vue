<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建场景</el-button>
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
			<!-- 表格部分 -->
			<el-table
				:data="tableList"
				height="100%"
				empty-text="没有更多数据了"
				header-row-class-name="table-header"
				style="width:100%;">
				<el-table-column
					fixed
					prop="id"
					label="场景ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="title"
					label="场景名称"
					min-width="144">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					min-width="250">
					<template slot-scope="scope">
						<el-button type="primary"  @click="openDialog('update',scope.row.id)">编辑</el-button>
						<el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
						<el-switch
						 	style="margin-left:10px;"
							:value="scope.row.status==1?true:false"
							inactive-text="启用开关"
							active-color="#3CD970"
							@change="switchChange(scope.row)"
							inactive-color="#DFE5EB">
						</el-switch>
					</template>
				</el-table-column>
			</el-table>
			<!-- 底部分页 -->
			<div class="table-footer">
				<div class="footer-right">
					<el-pagination
						background
						v-show="tableList.length!==0"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						layout="sizes, prev, pager, next"
						:page-sizes="[5, 10, 20, 30]"
						:current-page="apiRequest.page"
						:page-size="apiRequest.pageSize"
						:total="total">
					</el-pagination>
				</div>
			</div>
      <!--创建 编辑弹窗--->
			<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="50%">
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="wordForm" label-width="100px">
          <el-form-item label="场景名称" prop="title" :rules="rules.title">
						<el-input v-model.trim="wordForm.title"></el-input>
          </el-form-item>
          <el-form-item label="场景类型"  prop="type_id" :rules="rules.type_id">
              <el-select v-model="wordForm.type_id"  placeholder="请选择">
                  <el-option v-for="item in sceneList" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="场景缩略图" prop="picurl" :rules="rules.picurl">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              accept="image/jpeg,image/png"
              name="upload_resource"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="wordForm.picurl" :src="wordForm.picurl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="对话人数" prop="talk_num" :rules="rules.talk_num">
            <el-input v-model.trim="wordForm.talk_num"></el-input>
          </el-form-item>
          <el-form-item label="噪音链接" prop="noise" :rules="rules.noise">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="wordForm.noise"></el-input>
							<audio-player v-if="wordForm.noise" :src="wordForm.noise"/>
							<el-upload
								style="margin:auto 10px;height:32px;"
								:action="uploadvoice"
								accept="audio/mp3"
								name="upload_resource"
								:show-file-list="false"
								:before-upload="beforeUpload"
								:on-success="voiceSourceSuccess"
								:on-error="voiceSourceError">
								<el-button size="small" type="primary">上传噪音</el-button>
							</el-upload>
						</div>
          </el-form-item>
           <div  class="border_both">
            <!--释义--->
						<el-form-item style="padding-bottom:10px;border-bottom:1px solid #e5e5e5;" label="对话详情">
							<div class="border_b" v-for="(subitem,j) in wordForm.detail" :key="j">
								<el-form-item label="英文" :prop="'detail.' + j + '.en'" :rules="rules.en_explain">
									<el-input v-model.trim="subitem.en"></el-input>
								</el-form-item>
								<el-form-item label="中文" :prop="'detail.' + j + '.cn'" :rules="rules.cn_explain">
									<el-input v-model.trim="subitem.cn"></el-input>
								</el-form-item>
                <el-form-item label="提示" :prop="'detail.' + j + '.tips'" :rules="rules.tips">
									<el-input type="textarea" autosize v-model.trim="subitem.tips"></el-input>
								</el-form-item>
								<el-form-item label="读音" :prop="'detail.' + j + '.voice'" :rules="rules.voice">
									<el-input v-show="false" v-model.trim="subitem.voice"></el-input>
									<audio-player style="margin-bottom:10px;" v-if="subitem.voice" :src="subitem.voice"/>
									<div style="width:100%;display:flex;justify-content:flex-end;">
										<el-upload
											style="height:32px;"
											:action="uploadvoice"
											accept="audio/mp3,audio/mpeg"
											:show-file-list="false"
											:before-upload="beforeUpload"
											:http-request="voiceUpload"
                      :data="{j}">
											<el-button size="small" type="primary">上传读音</el-button>
										</el-upload>
										<el-button v-if="wordForm.detail.length > 1" style="margin-left:10px;" type="danger" plain @click="deleteExplain(j)">删除对话</el-button>
									</div>
								</el-form-item>
							</div>
							<div style="text-align:center">
								<el-button type="primary" plain @click="addExplain">添加对话</el-button>
							</div>
						</el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="handleClose">取消</el-button>
            <el-button v-show="btn_state" type="primary" @click="submitForm('form')">提交</el-button>
            <el-button v-show="!btn_state" type="primary" @click="editForm('form')">编辑</el-button>
        </span>
      </el-dialog>
		</div>
  </div>
</template>
<script>
import '@/../static/css/heh-css/common.css'

export default {
  data(){
    return {
			isLoad:false,
      tableList:[],
      sceneList:[], //场景分类
			apiRequest:{
			 page:1,
			 pageSize:5
			},
			total:0,
      searchValue:'',
      btn_state:true,
			//单词初始数据结构
			wordForm:{
        title:'',
        type_id:'',
        picurl:'',
        talk_num:null,
        noise:'',
        detail:[
          {
            cn:'',
            en:'',
            voice:'',
            tips:'',
          }
        ],
			},
			//添加||编辑 单词弹窗
			dialogVisible:false,
			dialogTitle:'',
      formLoad:false,
      //图片上传
      uploadImg:domain.uploadUrl+'&upload_type=pictures',
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			//voiceUrl:domain.voiceUrl,
			token:domain.testToken,
			//表单验证
			rules:{
        title: [{ required: true, message: '请输入场景名称', trigger: ['blur', 'change'] }],
        type_id: [{ required: true, message: '请选择场景分类', trigger: ['blur', 'change'] }],
        voice: [{ required: true, message: '请上传读音', trigger: ['blur', 'change'] }],
        tips: [{ required: true, message: '请输入提示', trigger: ['blur', 'change'] }],
        picurl: [{ required: true, message: '请上传场景缩略图', trigger: ['blur', 'change'] }],
        talk_num: [{ required: true, message: '请输入对话人数', trigger: ['blur', 'change'] }],
        noise: [{ required: true, message: '请上传噪音', trigger: ['blur', 'change'] }],
				en_explain: [{ required: true, message: '请输入英文', trigger: ['blur', 'change'] }],
				cn_explain: [{ required: true, message: '请输入中文', trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
    this.getTableList()  //获取场景列表
    this.getSceneList()  //场景类别
  },
  methods: {
		//获取场景列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "sceneList",
        method: "GET",
        data:this.apiRequest
			}).then(res => {
				if(res.data.state){
					res = res.data.data
					//console.log(res)
					this.tableList = res.list
					this.total = res.total
					this.isLoad = false
				}else{
					this.isLoad = false
				}
			}).catch(() => {
				this.isLoad = false
			});
    },
    
    //场景类别
    getSceneList(){
      this.isLoad = true
			this.$api.request({
				url: "sceneTypeList",
        method: "GET",
        data:this.apiRequest
			}).then(res => {
				if(res.data.state){
					res = res.data.data
					//console.log(res)
					 this.sceneList =res.list;
				}else{
					this.isLoad = false
				}
			}).catch(() => {
				this.isLoad = false
			});
    },

    //图片上传前
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$notify.error({
            title: "错误",
            message: "上传头像图片大小不能超过 2MB!！"
        })
      }
      return isLt2M;
    },
    
    //上传成功
    handleAvatarSuccess(res) {
      this.formLoad = true
      if(res.state){
        this.wordForm.picurl= res.data.src
        this.formLoad = false
      }
    },

		//切换页
		handleCurrentChange(val){
			this.apiRequest.page = val
			this.getTableList()
		},
		//切换每页条数
		handleSizeChange(val){
			this.apiRequest.pageSize = val
			this.handleCurrentChange(1)
		},
		//搜索单词
		handleSreach(){
			if(this.searchValue){
					this.apiRequest.title = this.searchValue
					this.handleCurrentChange(1)
			}else{
				delete this.apiRequest.title
				this.handleCurrentChange(1)
			}
		},
		//启用||停用 单词
		switchChange(row){
			this.isLoad = true
			this.$api.request({
				url: "opSceneStatus",
				method: "get",
				data:{
					id:row.id,
					status:row.status == 1 ? 2 : 1
				}
			}).then(res => {
				if(res.data.state){
					this.$notify({
						title: '成功',
						message: res.data.message,
						type: 'success'
					});
				}
				this.getTableList()
			}).catch(() => {
				this.isLoad = false
			});
		},
		//删除场景对话
		handleDelete(id){
      //console.log(id)
			this.$confirm( '该场景对话将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "delScene",
					method: "get",
					data:{
						id:id
					}
				}).then(res => {
					if(res.data.state){
						this.$notify({
							title: '成功',
							message: res.data.message,
							type: 'success'
						});
            this.handleCurrentChange(1)
            this.isLoad = false
					}
				})
			}).catch(() => {
				this.isLoad = false
			});
		},


		//添加||编辑 场景对话弹窗
		openDialog(val,id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
        this.dialogTitle = '创建场景对话'
        this.btn_state =true,
				this.wordForm = {
          title:'',
          type_id:'',
          picurl:'',
          talk_num:null,
          noise:'',
          detail:[
            {
              cn:'',
              en:'',
              voice:''
            }
          ],
				}
				this.formLoad = false
			}
			//获取场景对话详情
			if(val == 'update'){
        this.dialogTitle = '编辑场景对话'
        this.btn_state =false,
				this.$api.request({
					url: "sceneDetail",
					method: "GET",
					data:{id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
            this.wordForm =res
						this.formLoad = false
					}else{
						this.dialogVisible = false
						this.formLoad = false
					}
				}).catch(err => {
					this.dialogVisible = false
					this.formLoad = false
				})
			}
		},
		
		//添加对话
		addExplain(){
			this.wordForm.detail.push({cn:'',en:'',voice:'',tips:'',})
		},
		//删除对话
		deleteExplain(j){
			if(this.wordForm.detail.length <= 1){
				this.$message({
					message:'场景至少要有一条对话',
					type:'warning'
				});
			}else{
				this.$confirm( '确定删除该释义？' , '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.wordForm.detail.splice(j,1)
				}).catch(() => {});
			}
		},
		

		//录音上传前
		beforeUpload(file) {
      const isMP3 = ['audio/mp3','audio/mpeg'].includes(file.type);
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isMP3) {
				this.$message.error('上传音频只能是 MP3 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传音频大小不能超过 2MB!');
			}
			return isMP3 && isLt2M
		},
		//单词语音上传成功
		voiceSourceSuccess(res){
			if(res.state){
				this.wordForm.noise = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		//单词语音上传失败
		voiceSourceError(err){
			this.$notify.error({
				title: '请求失败',
				message: err
			});
		},
		//上传 释义||例句 语音
		voiceUpload(param){
			//console.log(param)
			this.formLoad = true
			let j = param.data.j
			const formData = new FormData()
			formData.append('upload_resource', param.file)
			this.$voiceApi.request({
				formData
			}).then(res => {
        //console.log(res)
				if(res.data.state){
						this.wordForm.detail[j].voice = res.data.data.src
				}
				this.formLoad = false
			}).catch(err => {
				this.formLoad = false
			})
		},
		//取消上传
		handleClose(done){
			this.$confirm( '是否放弃提交已修改数据？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.dialogVisible = false
			}).catch(() => {});
		},
		//提交表单
		submitForm(formName,op_type){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.formLoad = true
					this.$api.request({
						url: "createScene",
						method: "POST",
						data:this.wordForm,
					}).then(res => {
						if(res.data.state){
							this.dialogVisible = false
							this.getTableList()
							this.$notify({
								title: '成功',
								message: res.data.message,
								type: 'success'
							});
						}else{
							this.formLoad = false
						}
					}).catch(err => {
						this.formLoad = false
					})

				} else {
					// this.$message.error('提交失败，请完善表格信息！');
					this.$notify.error({
						title: '提交失败',
						message: '请完善表格信息！'
					});
					return false;
				}
			});
    },
    
    //编辑表单
		editForm(formName,op_type){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.formLoad = true
					this.$api.request({
						url: "modifyScene",
						method: "POST",
						data:this.wordForm,
					}).then(res => {
						if(res.data.state){
							this.dialogVisible = false
							this.getTableList()
							this.$notify({
								title: '成功',
								message: res.data.message,
								type: 'success'
							});
						}else{
							this.formLoad = false
						}
					}).catch(err => {
						this.formLoad = false
					})

				} else {
					// this.$message.error('提交失败，请完善表格信息！');
					this.$notify.error({
						title: '提交失败',
						message: '请完善表格信息！'
					});
					return false;
				}
			});
		}
  }
}
</script>