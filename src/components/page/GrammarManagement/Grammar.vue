<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建语法</el-button>
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
					label="语法ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="gra_name"
					label="语法名称"
					min-width="144">
				</el-table-column>
				<el-table-column
					label="解析"
					min-width="200">
					<template slot-scope="scope">
						<div>{{scope.row.analyze?scope.row.analyze[0].title:''}}</div>
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
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="grammarForm" label-width="100px">
          <el-form-item label="语法名称" prop="gra_name" :rules="rules.gra_name">
						<el-input v-model.trim="grammarForm.gra_name"></el-input>
          </el-form-item>
          <el-form-item label="缩略图" prop="gra_img_url" :rules="rules.gra_img_url">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="graImgAvatarSuccess"
							:on-error="uploadError">
              <img v-if="grammarForm.gra_img_url" :src="grammarForm.gra_img_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
					<el-form-item label="说明类型">
						<el-select v-model="grammarForm.src_type" @change="srcTypeChange()" placeholder="请选择说明类型">
							<el-option v-for="item in srcTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 图片上传 -->
					<el-form-item v-if="grammarForm.src_type == 1 || grammarForm.src_type == 4" label="图片" prop="img_url" :rules="rules.img_url">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="imgAvatarSuccess"
							:on-error="uploadError">
              <img v-if="grammarForm.img_url" :src="grammarForm.img_url" class="img-avatar">
              <i v-else class="el-icon-plus avatar-img-icon"></i>
            </el-upload>
          </el-form-item>
					<!-- 音频上传 -->
					<el-form-item v-if="grammarForm.src_type == 2 || grammarForm.src_type == 4" label="音频" prop="src_url" :rules="rules.src_url">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="grammarForm.src_url"></el-input>
							<audio-player v-if="grammarForm.src_url" :src="grammarForm.src_url"/>
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
					<!-- 视频上传 -->
					<el-form-item v-if="grammarForm.src_type == 3" label="视频" prop="src_url" :rules="rules.src_url">
            <el-upload
              class="avatar-uploader"
              :action="uploadvideo"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeVideoUpload"
              :on-success="videoAvatarSuccess"
							:on-error="uploadError">
							<video v-if="grammarForm.src_url" :src="grammarForm.src_url" class="img-avatar" controls="controls">您的浏览器不支持视频播放</video>
              <i v-else class="el-icon-plus avatar-img-icon"></i>
            </el-upload>
          </el-form-item>
					<!-- 解析 -->
					<el-form-item label="解析标题" :prop="'analyze.'+ 0 +'.title'" :rules="rules.analyze_title">
						<el-input v-model.trim="grammarForm.analyze[0].title"></el-input>
          </el-form-item>
					<el-form-item label="解析内容" :prop="'analyze.'+ 0 +'.content'" :rules="rules.analyze_content">
						<el-input type="textarea" :rows="4" v-model.trim="grammarForm.analyze[0].content"></el-input>
          </el-form-item>
					<!-- 添加对话例子 -->
					<div v-if="grammarForm.scenes">
						<div v-for="(item,i) in grammarForm.scenes" :key="'scenes'+i" class="scenes_box">
							<el-form-item label="对话列表" style="margin-bottom:10px;">
								<div class="border_b" v-for="(subitem,j) in item" :key="j">
									<el-form-item label="例子英文" :prop="'scenes.'+ i +'.' + j + '.en_name'" :rules="rules.en_name">
										<el-input v-model.trim="subitem.en_name"></el-input>
									</el-form-item>
									<el-form-item label="中文释义" :prop="'scenes.'+ i +'.' + j + '.cn_name'" :rules="rules.cn_name">
										<el-input v-model.trim="subitem.cn_name"></el-input>
									</el-form-item>
									<el-form-item label="语音" :prop="'scenes.'+ i +'.' + j + '.audio_url'" :rules="rules.voice">
										<el-input v-show="false" v-model.trim="subitem.audio_url"></el-input>
										<audio-player style="margin-bottom:10px;" v-if="subitem.audio_url" :src="subitem.audio_url"/>
										<div style="width:100%;display:flex;justify-content:flex-end;">
											<el-upload
												style="height:32px;"
												:action="uploadvoice"
												accept="audio/mp3"
												:show-file-list="false"
												:before-upload="beforeUpload"
												:http-request="voiceUpload"
												:data="{type:'scenes',i,j}">
												<el-button size="small" type="primary">上传语音</el-button>
											</el-upload>
											<el-button v-if="grammarForm.scenes[i].length > 2" style="margin-left:10px;" type="danger" plain @click="deleteScenesItem(i,j)">删除对话</el-button>
										</div>
									</el-form-item>
								</div>
								<div style="text-align:center">
									<el-button type="primary" plain @click="addScenesItem(i)">添加对话</el-button>
								</div>
							</el-form-item>
							<div style="text-align:right;margin-left:20px;padding-top:10px;border-top:1px solid #e5e5e5;">
								<el-button v-if="grammarForm.words.length > 0 || grammarForm.sentences.length > 0" type="danger" @click="deleteScenes(i)">删除对话例子</el-button>
								<el-button v-if="grammarForm.words.length == 0 && grammarForm.sentences.length == 0 && grammarForm.scenes.length > 1" type="danger" @click="deleteScenes(i)">删除对话例子</el-button>
							</div>
						</div>
					</div>
					<div style="text-align:center;margin-bottom:10px;">
						<el-button type="primary" @click="addScenes">添加对话例子</el-button>
					</div>
					<!-- 添加单词例子 -->
					<div v-if="grammarForm.words">
						<div v-for="(item,i) in grammarForm.words" :key="'words'+i" class="scenes_box">
							<el-form-item label="例子单词" style="margin-bottom:0;">
								<div class="border_b">
									<el-form-item label="例子英文" :prop="'words.'+ i + '.word_name'" :rules="rules.en_name">
										<el-input v-model.trim="item.word_name"></el-input>
									</el-form-item>
									<el-form-item label="中文释义" :prop="'words.'+ i + '.cn_express'" :rules="rules.cn_name">
										<el-input v-model.trim="item.cn_express"></el-input>
									</el-form-item>
									<el-form-item label="语音" :prop="'words.'+ i + '.word_audio_url'" :rules="rules.voice">
										<el-input v-show="false" v-model.trim="item.word_audio_url"></el-input>
										<audio-player style="margin-bottom:10px;" v-if="item.word_audio_url" :src="item.word_audio_url"/>
										<div style="width:100%;display:flex;justify-content:flex-end;">
											<el-upload
												style="height:32px;"
												:action="uploadvoice"
												accept="audio/mp3"
												:show-file-list="false"
												:before-upload="beforeUpload"
												:http-request="voiceUpload"
												:data="{type:'words',i}">
												<el-button size="small" type="primary">上传语音</el-button>
											</el-upload>
										</div>
									</el-form-item>
								</div>
							</el-form-item>
							<div style="text-align:right;">
								<el-button v-if="grammarForm.scenes.length > 0 || grammarForm.sentences.length > 0" type="danger" @click="deleteWords(i)">删除单词例子</el-button>
								<el-button v-if="grammarForm.scenes.length == 0 && grammarForm.sentences.length == 0 && grammarForm.words.length > 1" type="danger" @click="deleteWords(i)">删除单词例子</el-button>
							</div>
						</div>
					</div>
					<div style="text-align:center;margin-bottom:10px;">
						<el-button type="primary" @click="addWords">添加单词例子</el-button>
					</div>
					<!-- 添加例句例子 -->
					<div v-if="grammarForm.sentences">
						<div v-for="(item,i) in grammarForm.sentences" :key="'sentences'+i" class="scenes_box">
							<el-form-item label="例子例句" style="margin-bottom:0;">
								<div class="border_b">
									<el-form-item label="例子英文" :prop="'sentences.'+ i + '.en_name'" :rules="rules.en_name">
										<el-input v-model.trim="item.en_name"></el-input>
									</el-form-item>
									<el-form-item label="中文释义" :prop="'sentences.'+ i + '.cn_name'" :rules="rules.cn_name">
										<el-input v-model.trim="item.cn_name"></el-input>
									</el-form-item>
									<el-form-item label="语音" :prop="'sentences.'+ i + '.audio_src'" :rules="rules.voice">
										<el-input v-show="false" v-model.trim="item.audio_src"></el-input>
										<audio-player style="margin-bottom:10px;" v-if="item.audio_src" :src="item.audio_src"/>
										<div style="width:100%;display:flex;justify-content:flex-end;">
											<el-upload
												style="height:32px;"
												:action="uploadvoice"
												accept="audio/mp3"
												:show-file-list="false"
												:before-upload="beforeUpload"
												:http-request="voiceUpload"
												:data="{type:'sentences',i}">
												<el-button size="small" type="primary">上传语音</el-button>
											</el-upload>
										</div>
									</el-form-item>
								</div>
							</el-form-item>
							<div style="text-align:right;">
								<el-button v-if="grammarForm.scenes.length > 0 || grammarForm.words.length > 0" type="danger" @click="deleteSentences(i)">删除例句例子</el-button>
								<el-button v-if="grammarForm.scenes.length == 0 && grammarForm.words.length == 0 && grammarForm.sentences.length > 1" type="danger" @click="deleteSentences(i)">删除例句例子</el-button>
							</div>
						</div>
					</div>
					<div style="text-align:center">
						<el-button type="primary" @click="addSentences">添加例句例子</el-button>
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
		var validateImgUrl = (rule, value, callback) => {
			if(this.grammarForm.src_type == 1 || this.grammarForm.src_type == 4){
				if(!value){
					return callback(new Error('请上传详情图'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateSrcUrl = (rule, value, callback) => {
			if(this.grammarForm.src_type == 2 || this.grammarForm.src_type == 4){
				if(!value){
					return callback(new Error('请上传音频'));
				}else{
					callback()
				}
			}else if(this.grammarForm.src_type == 3){
				if(!value){
					return callback(new Error('请上传视频'));
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
			//语法初始数据结构
			grammarForm:{
				gra_name:'',gra_img_url:'',img_url:'',src_url:'',src_type:1,
				analyze:[{title:'',content:''}],
				scenes:[[{en_name:'',cn_name:'',audio_url:''}]],
				words:[{word_name:'',cn_express:'',word_audio_url:''}],
				sentences:[{en_name:'',cn_name:'',audio_src:''}],
			},
			srcTypeOptions:[
				{label:'图片',value:1},
				{label:'音频',value:2},
				{label:'视频',value:3},
				{label:'图片+音频',value:4}
			],
			lastType:1,
			//添加||编辑 单词弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
      uploadImg:domain.uploadUrl+'&upload_type=pictures',
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			uploadvideo:domain.uploadUrl + '&upload_type=video',
			voiceUrl:domain.voiceUrl,
			token:domain.testToken,
			//表单验证
			rules:{
				gra_name: [{ required: true, message: '请输入语法名称', trigger: ['blur', 'change'] }],
				gra_img_url:[{ required: true, message: '请上传缩略图', trigger: ['blur', 'change'] }],
				img_url:[{ required: true, validator:validateImgUrl, trigger: ['blur', 'change'] }],
				src_url:[{ required: true, validator:validateSrcUrl, trigger: ['blur', 'change'] }],
				analyze_title:[{ required: true, message: '请输入解析标题', trigger: ['blur', 'change'] }],
				analyze_content:[{ required: true, message: '请输入解析内容', trigger: ['blur', 'change'] }],
				en_name: [{ required: true, message: '请输入例子英文', trigger: ['blur', 'change'] }],
				cn_name: [{ required: true, message: '请输入中文释义', trigger: ['blur', 'change'] }],
				voice: [{ required: true, message: '请上传例子语音', trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取语法列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "getGrammarList",
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
		//搜索语法
		handleSreach(){
			if(this.searchValue){
				this.apiRequest.gra_name = this.searchValue
				this.handleCurrentChange(1)
			}else{
				delete this.apiRequest.gra_name
				this.handleCurrentChange(1)
			}
		},
		//启用||停用 语法
		switchChange(row){
			//console.log(row)
			this.isLoad = true
			this.$api.request({
				url: "editGrammer",
				method: "POST",
				data:{
					grammer_id:row.id,
					gra_name:row.gra_name,
					gra_img_url:row.gra_name,
					src_url:row.src_url,
					src_type:row.src_type,
					analyze:row.analyze,
					scenes:row.scenes,
					words:row.words,
					sentences:row.sentences,
					status:row.status == 1 ? 2 : 1
				}
			}).then(res => {
				if(res.data.state){
					this.$notify({
						title: '成功',
						message: row.status == 1 ? row.gra_name+'已被禁用' : row.gra_name+'已启用',
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
		//删除语法
		handleDelete(grammer_id){
			//console.log(id)
			this.$confirm( '该语法将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "deleteGrammer",
					method: "POST",
					data:{grammer_id}
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


		//添加||编辑 语法弹窗
		openDialog(val,grammer_id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建语法'
				this.grammarForm = {
					gra_name:'',gra_img_url:'',img_url:'',src_url:'',src_type:1,
					analyze:[{title:'',content:''}],
					scenes:[
						[{en_name:'',cn_name:'',audio_url:''},{en_name:'',cn_name:'',audio_url:''}]
					],
					words:[
						{word_name:'',cn_express:'',word_audio_url:''}
					],
					sentences:[
						{en_name:'',cn_name:'',audio_src:''}
					]
				}
				this.formLoad = false
			}
			//获取语法详情
			if(val == 'update'){
				this.dialogTitle = '编辑语法'
				this.$api.request({
					url: "showGrammer",
					method: "POST",
					data:{grammer_id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						this.grammarForm = res
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
				this.grammarForm.gra_img_url = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		//说明类型切换
		srcTypeChange(){
			// console.log(this.lastType)
			if(this.lastType == 1){
				if(this.grammarForm.src_type == 2 || this.grammarForm.src_type == 3){
					this.grammarForm.img_url = ''
					// console.log('清空图片地址')
				}
			}
			if(this.lastType == 2){
				if(this.grammarForm.src_type == 1 || this.grammarForm.src_type == 3){
					this.grammarForm.src_url = ''
					// console.log('清空音频地址')
				}
			}
			if(this.lastType == 3){
				this.grammarForm.src_url = ''
				// console.log('清空视频地址')
			}
			if(this.lastType == 4){
				if(this.grammarForm.src_type == 1){
					this.grammarForm.src_url = ''
					// console.log('清空音频地址')
				}
				if(this.grammarForm.src_type == 2){
					this.grammarForm.img_url = ''
					// console.log('清空图片地址')
				}
				if(this.grammarForm.src_type == 3){
					this.grammarForm.src_url = ''
					// console.log('清空音频地址')
					this.grammarForm.img_url = ''
					// console.log('清空图片地址')
				}
			}
			this.lastType = this.grammarForm.src_type
		},
		//说明图片上传成功
		imgAvatarSuccess(res){
			if(res.state){
				this.grammarForm.img_url = res.data.src
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
				this.grammarForm.src_url = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		//视频上传前
		beforeVideoUpload(file) {
			// console.log(file.type)
			const isLt10M = file.size / 1024 / 1024  < 10;
			if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
				this.$message.error('请上传正确的视频格式!');
				return false;
			}
			if (!isLt10M) {
				this.$message.error('上传视频大小不能超过 10MB!');
				return false;
			}
		},
		//视频上传成功
		videoAvatarSuccess(res){
			if(res.state){
				this.grammarForm.src_url = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		//上传例子语音
		voiceUpload(param){
			//console.log(param)
			this.formLoad = true
			let type = param.data.type
			let i = param.data.i
			const formData = new FormData()
			formData.append('upload_resource', param.file)
			this.$voiceApi.request({
				formData
			}).then(res => {
				if(res.data.state){
					if(param.data.type == 'scenes'){
						let j = param.data.j
						this.grammarForm.scenes[i][j].audio_url = res.data.data.src
					}
					if(param.data.type == 'words'){
						this.grammarForm.words[i].word_audio_url = res.data.data.src
					}
					if(param.data.type == 'sentences'){
						this.grammarForm.sentences[i].audio_src = res.data.data.src
					}
				}else{
					this.$notify.error({
						title: '上传失败',
						message: res.message
					});
				}
				this.formLoad = false
			}).catch(err => {
				this.formLoad = false
			})
		},

		//添加对话例子
		addScenes(){
			this.grammarForm.scenes.push([{en_name:'',cn_name:'',audio_url:''},{en_name:'',cn_name:'',audio_url:''}])
		},
		//删除对话例子
		deleteScenes(i){
			this.$confirm( '确定删除该对话例子？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.grammarForm.scenes.splice(i,1)
			}).catch(() => {});
		},
		//添加对话
		addScenesItem(i){
			this.grammarForm.scenes[i].push({en_name:'',cn_name:'',audio_url:''})
		},
		//删除对话
		deleteScenesItem(i,j){
			this.$confirm( '确定删除该对话？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.grammarForm.scenes[i].splice(j,1)
			}).catch(() => {});
		},
		//添加单词例子
		addWords(){
			this.grammarForm.words.push({word_name:'',cn_express:'',word_audio_url:''})
		},
		//删除单词例子
		deleteWords(i){
			this.$confirm( '确定删除该单词例子？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.grammarForm.words.splice(i,1)
			}).catch(() => {});
		},
		//添加例句例子
		addSentences(){
			this.grammarForm.sentences.push({en_name:'',cn_name:'',audio_src:''})
		},
		//删除例句例子
		deleteSentences(i){
			this.$confirm( '确定删除该例句例子？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.grammarForm.sentences.splice(i,1)
			}).catch(() => {});
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
					let data = this.grammarForm
					if(data.src_type == 1){
						delete data.src_url
					}
					if(data.src_type == 2 || data.src_type == 3){
						delete data.img_url
					}
					let url = ''
					if(this.dialogTitle == '创建语法'){
						url = 'createGrammer'
					}
					if(this.dialogTitle == '编辑语法'){
						url = 'editGrammer'
						data.grammer_id = this.grammarForm.id
						delete data.id
						delete data.status
					}
					//console.log(data)
					this.$api.request({
						url,
						method: "POST",
						data
					}).then(res => {
						if(res.data.state){
							this.dialogVisible = false
							this.getTableList()
							this.$notify({
								title: '成功',
								message: this.dialogTitle == '创建语法'?'语法创建成功':'语法信息已成功修改',
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