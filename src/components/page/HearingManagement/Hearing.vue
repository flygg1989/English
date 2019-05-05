<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建听力</el-button>
				</div>
				<div class="operation-right">
					<el-input
						class="search-ipt"
						placeholder="请输入要查询的内容"
						prefix-icon="el-icon-search"
						@keyup.enter.native="handleSreach"
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
					label="听力ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="talk_title"
					label="听力名称"
					min-width="144">
				</el-table-column>
				<el-table-column
          label="听力类型"
          min-width="144">
          <template slot-scope="scope">
            {{typeOptions.filter(item => item.value == scope.row.hear_type)[0].label}}
          </template>
        </el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					min-width="250">
					<template slot-scope="scope">
						<el-button type="primary"  @click="openDialog('update',scope.row.id)">编辑</el-button>
						<el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
						<!-- <el-switch
						 	style="margin-left:10px;"
							:value="scope.row.status==1?true:false"
							inactive-text="启用开关"
							active-color="#3CD970"
							@change="switchChange(scope.row)"
							inactive-color="#DFE5EB">
						</el-switch> -->
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
						:current-page="apiRequest.page_num"
						:page-size="apiRequest.page_size"
						:total="total">
					</el-pagination>
				</div>
			</div>
<!--创建 编辑弹窗--->
			<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="50%">
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="hearingForm" label-width="100px">
					<el-form-item label="听力类型" prop="hear_type" :rules="rules.hear_type">
						<el-select style="width:100%;" v-model="hearingForm.hear_type" :disabled="dialogTitle == '编辑听力'" @change="hearTypeChange" placeholder="请选择听力类型">
							<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item v-if="hearingForm.hear_type == 2" label="听力名称" prop="talk_title" :rules="rules.talk_title">
						<el-input v-model.trim="hearingForm.talk_title"></el-input>
          </el-form-item>
					<el-form-item v-if="hearingForm.hear_type == 1" label="听力名称" prop="hear_en.0" :rules="rules.hear_en">
						<el-input v-model.trim="hearingForm.hear_en[0]"></el-input>
          </el-form-item>
					<el-form-item v-if="hearingForm.hear_type == 1" label="中文释义" prop="hear_cn.0" :rules="rules.hear_cn">
						<el-input v-model.trim="hearingForm.hear_cn[0]"></el-input>
          </el-form-item>
					<el-form-item v-if="hearingForm.hear_type == 2" label="缩略图" prop="thumb" :rules="rules.thumb">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="graImgAvatarSuccess"
							:on-error="uploadError">
              <img v-if="hearingForm.thumb" :src="hearingForm.thumb" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
					<el-form-item label="音频" prop="audio_url" :rules="rules.audio_url">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="hearingForm.audio_url"></el-input>
							<audio-player v-if="hearingForm.audio_url" :src="hearingForm.audio_url"/>
							<el-upload
								style="margin:auto 10px;height:32px;"
								:action="uploadvoice"
								name="upload_resource"
								:show-file-list="false"
								:before-upload="beforeUpload"
								:on-success="voiceSourceSuccess"
								:on-error="uploadError">
								<el-button size="small" type="primary">上传音频</el-button>
							</el-upload>
						</div>
          </el-form-item>
					<el-form-item v-if="hearingForm.hear_type == 2" label="对话人数" prop="talk_num" :rules="rules.talk_num">
						<el-select style="width:100%;" v-model="hearingForm.talk_num" :disabled="true" @change="talkNumChange" placeholder="请选择对话人数">
							<el-option v-for="item in [2,3]" :key="item" :label="item" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<div v-if="hearingForm.hear_type == 2" class="scenes_box">
						<el-form-item label="对话列表" style="margin-bottom:0;">
							<div class="border_b" v-for="(item,i) in hearingForm.hear_en" :key="'talk'+i">
								<el-form-item :label="'对话人'+(i%hearingForm.talk_num + 1)" :prop="'hear_en.'+ i" :rules="rules.hear_en">
									<el-input v-model.trim="hearingForm.hear_en[i]"></el-input>
								</el-form-item>
								<el-form-item label="中文释义" :prop="'hear_cn.'+ i" :rules="rules.hear_cn">
									<el-input v-model.trim="hearingForm.hear_cn[i]"></el-input>
								</el-form-item>
								<div style="text-align:right;margin-bottom:10px;">
									<el-button v-if="hearingForm.hear_en.length > hearingForm.talk_num" style="margin-left:10px;" type="danger" plain @click="deleteTalk(i)">删除对话</el-button>
								</div>
							</div>
							<div style="text-align:center;">
								<el-button type="primary" plain @click="addTalk">添加对话</el-button>
							</div>
						</el-form-item>
					</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </span>
      </el-dialog>
		</div>
  </div>
</template>
<script>
import '@/../static/css/heh-css/common.css'

export default {
  data(){
		var validateTalkTitle = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请输入听力名称'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateThumb = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请上传缩略图'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateHearEn = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 1){
				if(!value){
					return callback(new Error('请输入听力名称'));
				}else{
					callback()
				}
			}
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请输入对话英文'));
				}else{
					callback()
				}
			}
		}
		var validateHearCn = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 1){
				if(!value){
					return callback(new Error('请输入中文释义'));
				}else{
					callback()
				}
			}
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请输入对话中文释义'));
				}else{
					callback()
				}
			}
		}
		var validateTalkNum = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请选择对话人数'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}

    return {
			isLoad:false,
			tableList:[],
			apiRequest:{
			 page_num:1,
			 page_size:5
			},
			total:0,
			searchValue:'',
			typeOptions:[
        {value:1,label:"句子"},
        {value:2,label:"对话"}
			],
			//听力初始数据结构
			hearingForm:{
				talk_title:'',
				hear_type:1,
				thumb:'',
				audio_url:'',
				talk_num:2,
				hear_en:[''],
				hear_cn:[''],
			},
			//添加||编辑 听力弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
      uploadImg:domain.uploadUrl+'&upload_type=pictures',
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			//表单验证
			rules:{
				talk_title: [{ required: true, validator:validateTalkTitle, trigger: ['blur', 'change'] }],
				hear_type: [{ required: true, message: '请选择听力类型', trigger: ['blur', 'change'] }],
				thumb: [{ required: true, validator:validateThumb, trigger: ['blur', 'change'] }],
				audio_url: [{ required: true, message: '请上传音频', trigger: ['blur', 'change'] }],
				hear_en: [{ required: true, validator:validateHearEn, trigger: ['blur', 'change'] }],
				hear_cn: [{ required: true, validator:validateHearCn, trigger: ['blur', 'change'] }],
				talk_num: [{ required: true, validator:validateTalkNum, trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取听力列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "getHearingList",
        method: "POST",
        data:this.apiRequest
			}).then(res => {
				if(res.data.state){
					res = res.data.data
					console.log(res)
					this.tableList = res.list
					this.total = res.all_data_num
					this.isLoad = false
				}else{
					this.isLoad = false
				}
			}).catch(() => {
				this.isLoad = false
			});
		},
		//切换页
		handleCurrentChange(val){
			this.apiRequest.page_num = val
			this.getTableList()
		},
		//切换每页条数
		handleSizeChange(val){
			this.apiRequest.page_size = val
			this.handleCurrentChange(1)
		},
		//搜索听力
		handleSreach(){
			if(this.searchValue){
				this.apiRequest.talk_title = this.searchValue
				this.handleCurrentChange(1)
			}else{
				delete this.apiRequest.talk_title
				this.handleCurrentChange(1)
			}
		},
		//启用||停用 听力
		switchChange(row){
			//console.log(row)
			this.isLoad = true
			let data = {
				hear_id:row.id,
				hear_type:row.hear_type,
				thumb:row.thumb,
				hear_en:row.hear_en,
				hear_cn:row.hear_cn,
				audio_url:row.audio_url,
				talk_num:row.talk_num,
				talk_title:row.talk_title,
				status:row.status == 1 ? 2 : 1
			}
			if(data.hear_type == 1){
				delete data.thumb
			}
			this.$api.request({
				url: "editHearing",
				method: "POST",
				data
			}).then(res => {
				if(res.data.state){
					this.$notify({
						title: '成功',
						message: row.status == 1?row.talk_title+'已被禁用':row.talk_title+'已启用',
						type: 'success'
					});
					this.getTableList()
				}else{
					this.isLoad = false
				}
			}).catch(() => {
				this.isLoad = false
			});
		},
		//删除听力
		handleDelete(hear_id){
			//console.log(id)
			this.$confirm( '该听力将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "deleteHearing",
					method: "POST",
					data:{hear_id}
				}).then(res => {
					if(res.data.state){
						this.$notify({
							title: '成功',
							message: res.data.message,
							type: 'success'
						});
						if(this.tableList.length == 1){
							this.handleCurrentChange(this.apiRequest.page_num-1)
						}else{
							this.getTableList()
						}
					}else{
						this.isLoad = false
					}
				})
			}).catch(() => {
				this.isLoad = false
			});
		},


		//添加||编辑 听力弹窗
		openDialog(val,hear_id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建听力'
				this.hearingForm = {
					talk_title:'',
					hear_type:1,
					thumb:'',
					audio_url:'',
					talk_num:2,
					hear_en:[''],
					hear_cn:[''],
				}
				this.formLoad = false
			}
			//获取听力详情
			if(val == 'update'){
				this.dialogTitle = '编辑听力'
				this.$api.request({
					url: "showHearing",
					method: "POST",
					data:{hear_id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						this.hearingForm = res
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

		//听力类型切换
		hearTypeChange(){
			this.hearingForm.talk_num = 2
			if(this.hearingForm.hear_type == 1){
				this.hearingForm.hear_en = ['']
				this.hearingForm.hear_cn = ['']
			}
			if(this.hearingForm.hear_type == 2){
				this.hearingForm.talk_title = ''
				this.hearingForm.hear_en = ['','']
				this.hearingForm.hear_cn = ['','']
			}
			setTimeout(() => {
				this.$refs['form'].clearValidate()
			}, 100);
		},

		//上传失败
		uploadError(err){
			this.$notify.error({
				title: '请求失败',
				message: err
			});
		},
		//图片上传之前
    beforeImgUpload(file) {
      let isJPG =['image/jpg','image/png','image/jpeg'].includes(file.type)
      let isLt300K = file.size / 1024 / 1024 < 0.3;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG,JPEG,PNG 格式!');
      }
      if (!isLt300K) {
        this.$message.error('上传图片大小不能超过 300K!');
      }
      return isJPG && isLt300K;
    },

		//缩略图上传成功
    graImgAvatarSuccess(res){
      if(res.state){
				this.hearingForm.thumb = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},

		//音频上传前
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
		//音频上传成功
		voiceSourceSuccess(res){
			if(res.state){
				this.hearingForm.audio_url = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},

		//对话人数切换
		talkNumChange(){
			if(this.hearingForm.talk_num == 3 && this.hearingForm.hear_en.length == 2){
				this.hearingForm.hear_en.push('')
				this.hearingForm.hear_cn.push('')
			}
		},
		//添加对话
		addTalk(){
			this.hearingForm.hear_en.push('')
			this.hearingForm.hear_cn.push('')
		},
		//删除对话
		deleteTalk(i){
			this.hearingForm.hear_en.splice(i,1)
			this.hearingForm.hear_cn.splice(i,1)
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
		submitForm(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.formLoad = true
					let data = this.hearingForm
					if(data.hear_type == 1){
						data.talk_title = data.hear_en[0]
						delete data.thumb
					}
					let url = ''
					if(this.dialogTitle == '创建听力'){
						url = 'createHearing'
					}
					if(this.dialogTitle == '编辑听力'){
						url = 'editHearing'
						data.hear_id = this.hearingForm.id
						delete data.id
						delete data.status
						delete data.created_at
						delete data.updated_at
					}
					// console.log(data)
					this.$api.request({
						url,
						method: "POST",
						data
					}).then(res => {
						if(res.data.state){
							this.dialogVisible = false
							if(this.dialogTitle == '创建听力'){
								this.handleCurrentChange(1)
							}
							if(this.dialogTitle == '编辑听力'){
								this.getTableList()
							}
							this.$notify({
								title: '成功',
								message: this.dialogTitle == '创建听力'?'听力创建成功':'听力信息已成功修改',
								type: 'success'
							});
						}else{
							this.formLoad = false
						}
					}).catch(err => {
						this.formLoad = false
					})
				} else {
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