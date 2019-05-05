<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建口语</el-button>
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
					label="口语ID"
					min-width="104">
				</el-table-column>
				<el-table-column
					prop="ora_en"
					label="口语名称"
					min-width="144">
				</el-table-column>
				<el-table-column
          label="口语类型"
          min-width="104">
          <template slot-scope="scope">
            {{typeOptions.filter(item => item.value == scope.row.ora_type)[0].label}}
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
						:current-page="apiRequest.page"
						:page-size="apiRequest.pageSize"
						:total="total">
					</el-pagination>
				</div>
			</div>
<!--创建 编辑弹窗--->
			<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="50%">
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="oracyForm" label-width="100px">
					<el-form-item label="口语类型" prop="ora_type" :rules="rules.ora_type">
						<el-select style="width:100%;" v-model="oracyForm.ora_type" @change="oraTypeChange" placeholder="请选择口语类型">
							<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item label="口语名称" prop="ora_en" :rules="rules.ora_en">
						<el-input v-model.trim="oracyForm.ora_en"></el-input>
          </el-form-item>
					<el-form-item v-if="oracyForm.ora_type == 1" label="中文释义" prop="ora_cn" :rules="rules.ora_cn">
						<el-input v-model.trim="oracyForm.ora_cn"></el-input>
          </el-form-item>
					<el-form-item v-if="oracyForm.ora_type == 2" label="缩略图" prop="thumb" :rules="rules.thumb">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="graImgAvatarSuccess"
							:on-error="uploadError">
              <img v-if="oracyForm.thumb" :src="oracyForm.thumb" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
					<el-form-item v-if="oracyForm.ora_type == 2" label="对话图片" prop="pic" :rules="rules.pic">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg"
              name="upload_resource"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="imgAvatarSuccess"
							:on-error="uploadError">
              <img v-if="oracyForm.pic" :src="oracyForm.pic" class="img-avatar">
              <i v-else class="el-icon-plus avatar-img-icon"></i>
            </el-upload>
          </el-form-item>
					<el-form-item :label="oracyForm.ora_type == 1?'音频':'总音频'" prop="audio_url" :rules="rules.audio_url">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="oracyForm.audio_url"></el-input>
							<audio-player v-if="oracyForm.audio_url" :src="oracyForm.audio_url"/>
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
					<el-form-item label="关联单词">
            <el-select
							style="width:100%;"
              v-model="oracyForm.words"
							multiple
              filterable
              remote
							clearable
              placeholder="请搜索并选择要关联的单词"
              :remote-method="remoteMethodWord"
              :loading="wordLoad">
              <el-option
                v-for="item in wordList"
                :key="item.id"
                :label="item.word"
                :value="item.id"
								:disabled="oracyForm.words.filter(word => word == item.id).length > 0?true:false">
              </el-option>
            </el-select>
          </el-form-item>
					<el-form-item v-if="oracyForm.ora_type == 2" label="对话人数" prop="talk_num" :rules="rules.talk_num">
						<el-select style="width:100%;" v-model="oracyForm.talk_num" :disabled="true" @change="talkNumChange" placeholder="请选择对话人数">
							<el-option v-for="item in [2,3]" :key="item" :label="item" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<div v-if="oracyForm.ora_type == 2" class="scenes_box">
						<el-form-item label="对话列表" style="margin-bottom:0;">
							<div class="border_b" v-for="(item,i) in oracyForm.talk_en" :key="'talk'+i">
								<el-form-item :label="'对话人'+(i%oracyForm.talk_num + 1)" :prop="'talk_en.'+ i" :rules="rules.talk_en">
									<el-input v-model.trim="oracyForm.talk_en[i]"></el-input>
								</el-form-item>
								<el-form-item label="中文释义" :prop="'talk_cn.'+ i" :rules="rules.talk_cn">
									<el-input v-model.trim="oracyForm.talk_cn[i]"></el-input>
								</el-form-item>
								<el-form-item label="语音" :prop="'talk_audio.'+ i" :rules="rules.talk_audio">
									<el-input v-show="false" v-model.trim="oracyForm.talk_audio[i]"></el-input>
									<audio-player style="margin-bottom:10px;" v-if="oracyForm.talk_audio[i]" :src="oracyForm.talk_audio[i]"/>
									<div style="width:100%;display:flex;justify-content:flex-end;">
										<el-upload
											style="height:32px;"
											:action="uploadvoice"
											accept="audio/mp3"
											:show-file-list="false"
											:before-upload="beforeUpload"
											:http-request="voiceUpload"
											:data="{i}">
											<el-button size="small" type="primary">上传语音</el-button>
										</el-upload>
										<el-button v-if="oracyForm.talk_en.length > oracyForm.talk_num" style="margin-left:10px;" type="danger" plain @click="deleteTalk(i)">删除对话</el-button>
									</div>
								</el-form-item>
							</div>
							<div style="text-align:center;">
								<el-button type="primary" plain @click="addTalk">添加对话</el-button>
							</div>
						</el-form-item>
					</div>
					<el-form-item label="关联语法">
            <el-select
							style="width:100%;"
              v-model="oracyForm.grammar_id"
              filterable
              remote
							clearable
              placeholder="请搜索并选择要关联的语法"
              :remote-method="remoteMethodGrammar"
              :loading="grammarLoad">
              <el-option
                v-for="item in grammarList"
                :key="item.id"
                :label="item.gra_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
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
		var validateOraCn = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 1){
				if(!value){
					return callback(new Error('请输入口语名称中文释义'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateThumb = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 2){
				if(!value){
					return callback(new Error('请上传缩略图'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validatePic = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 2){
				if(!value){
					return callback(new Error('请上传对话图片'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateAudioUrl = (rule, value, callback) => {
			if(!value){
				if(this.oracyForm.ora_type == 1){
					return callback(new Error('请上传口语句子音频'));
				}
				if(this.oracyForm.ora_type == 2){
					return callback(new Error('请上传口语对话总音频'));
				}
			}else{
				callback()
			}
		}
		var validateTalkNum = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 2){
				if(!value){
					return callback(new Error('请选择对话人数'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateTalkEn = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 2){
				if(!value){
					return callback(new Error('请输入对话英文'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateTalkCn = (rule, value, callback) => {
			if(this.oracyForm.ora_type == 2){
				if(!value){
					return callback(new Error('请输入对话中文释义'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateTalkAudio = (rule, value, callback) => {
			let index = rule.field.toString().replace("talk_audio.","") - 0
			if(this.oracyForm.ora_type == 2){
				if(!this.oracyForm.talk_audio[index]){
					return callback(new Error('请上传对话语音'));
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
			 page:1,
			 pageSize:5
			},
			total:0,
			searchValue:'',
			typeOptions:[
        {value:1,label:"句子"},
        {value:2,label:"对话"}
			],
			//语法初始数据结构
			oracyForm:{
				ora_type:1,
				ora_en:'',
				words:[],
				grammar_id:'',
				audio_url:'',
				ora_cn:'',
				thumb:'',
				pic:'',
				talk_num:2,
				talk_en:['',''],
				talk_cn:['',''],
				talk_audio:['','']
			},
			//添加||编辑 单词弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
			wordList:[],
			wordLoad:false,
			grammarList:[],
			grammarLoad:false,
      uploadImg:domain.uploadUrl+'&upload_type=pictures',
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			voiceUrl:domain.voiceUrl,
			//表单验证
			rules:{
				ora_en: [{ required: true, message: '请输入口语名称', trigger: ['blur', 'change'] }],
				ora_type: [{ required: true, message: '请选择口语类型', trigger: ['blur', 'change'] }],
				ora_cn: [{ required: true, validator:validateOraCn, trigger: ['blur', 'change'] }],
				thumb: [{ required: true, validator:validateThumb, trigger: ['blur', 'change'] }],
				pic: [{ required: true, validator:validatePic, trigger: ['blur', 'change'] }],
				audio_url: [{required: true, validator:validateAudioUrl, trigger: ['blur', 'change'] }],
				ora_cn: [{ required: true, message: '请输入中文释义', trigger: ['blur', 'change'] }],
				talk_num: [{ required: true, validator:validateTalkNum, trigger: ['blur', 'change'] }],
				talk_en: [{ required: true, validator:validateTalkEn, trigger: ['blur', 'change'] }],
				talk_cn: [{ required: true, validator:validateTalkCn, trigger: ['blur', 'change'] }],
				talk_audio: [{ required: true, validator:validateTalkAudio, trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取口语列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "oracyList",
        method: "GET",
        data:this.apiRequest
			}).then(res => {
				if(res.data.state){
					res = res.data.data
					console.log(res)
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
		//搜索口语
		handleSreach(){
			if(this.searchValue){
				this.apiRequest.ora_en = this.searchValue
				this.handleCurrentChange(1)
			}else{
				delete this.apiRequest.ora_en
				this.handleCurrentChange(1)
			}
		},
		//启用||停用 口语
		switchChange(row){
			//console.log(row)
			this.isLoad = true
			this.$api.request({
				url: "oracyStatus",
				method: "GET",
				data:{
					id:row.id,
					status:row.status == 1 ? 2 : 1
				}
			}).then(res => {
				if(res.data.state){
					this.getTableList()
				}else{
					this.isLoad = false
				}
			}).catch(() => {
				this.isLoad = false
			});
		},
		//删除口语
		handleDelete(id){
			//console.log(id)
			this.$confirm( '该口语将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "oracyDelete",
					method: "GET",
					data:{id}
				}).then(res => {
					if(res.data.state){
						this.$notify({
							title: '成功',
							message: res.data.message,
							type: 'success'
						});
						if(this.tableList.length == 1){
							this.handleCurrentChange(this.apiRequest.page-1)
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


		//添加||编辑 口语弹窗
		openDialog(val,id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建口语'
				this.oracyForm = {
					ora_type:1,
					ora_en:'',
					words:[],
					grammar_id:'',
					audio_url:'',
					ora_cn:'',
					thumb:'',
					pic:'',
					talk_num:2,
					talk_en:['',''],
					talk_cn:['',''],
					talk_audio:['','']
				}
				this.wordList = []
				this.grammarList = []
				this.formLoad = false
			}
			//获取口语详情
			if(val == 'update'){
				this.dialogTitle = '编辑口语'
				this.$api.request({
					url: "oracyDetail",
					method: "GET",
					data:{id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						let wordlist = []
						let newWords = []
						if(res.words && res.words.length > 0){
							for (let i = 0; i < res.words.length; i++) {
								const item = res.words[i]
								let newitem = {id:item.id,word:item.word}
								newWords.push(item.id)
								wordlist.push(newitem)
							}
						}
						this.wordList = wordlist
						// this.wordList = res.words[0]?[{id:res.words[0].id,word:res.words[0].word}]:[]
						if(res.grammar){
							this.grammarList = [{id:res.grammar.id,gra_name:res.grammar.gra_name}]
						}else{
							this.grammarList = []
						}
						let talk_en =  []
						let talk_cn =  []
						let talk_audio =  []
						if(res.ora_type == 2){
							for (let i = 0; i < res.talk_detail.length; i++) {
								let item = res.talk_detail[i]
								talk_en.push(item.en)
								talk_cn.push(item.cn)
								talk_audio.push(item.audio)
							}
						}
						this.oracyForm = {
							id:res.id,
							ora_type:res.ora_type,
							ora_en:res.ora_en,
							words:newWords,
							grammar_id:res.grammar?res.grammar.id:'',
							audio_url:res.audio_url,
							ora_cn:res.ora_cn,
							thumb:res.thumb,
							pic:res.pic,
							talk_num:res.talk_num,
							talk_en:talk_en,
							talk_cn:talk_cn,
							talk_audio:talk_audio
						}
						// console.log(this.oracyForm)
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
		//口语类型切换
		oraTypeChange(){
			if(this.oracyForm.ora_type == 1){
				this.oracyForm.ora_en = ''
				this.oracyForm.audio_url = ''
				this.oracyForm.ora_cn = ''
			}
			if(this.oracyForm.ora_type == 2){
				this.oracyForm.ora_en = ''
				this.oracyForm.thumb = ''
				this.oracyForm.pic = ''
				this.oracyForm.audio_url = ''
				this.oracyForm.talk_num = 2
				this.oracyForm.talk_en = ['','']
				this.oracyForm.talk_cn = ['','']
				this.oracyForm.talk_audio = ['','']
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
				this.oracyForm.thumb = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		//详情图片上传成功
		imgAvatarSuccess(res){
			if(res.state){
				this.oracyForm.pic = res.data.src
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
				this.oracyForm.audio_url = res.data.src
			}else{
				this.$notify.error({
					title: '上传失败',
					message: res.message
				});
			}
		},
		
		//上传对话语音
		voiceUpload(param){
			this.formLoad = true
			let i = param.data.i
			const formData = new FormData()
			formData.append('upload_resource', param.file)
			this.$voiceApi.request({
				formData
			}).then(res => {
				if(res.data.state){
					this.oracyForm.talk_audio[i] = res.data.data.src
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

		//搜索关联单词
    remoteMethodWord(query){
      let wordReg = /(^[A-Za-z]*$)/
      if (query !== '' && wordReg.test(query)){
        this.wordLoad = true;
        this.$api.request({
          url: "wordsList",
          method: "GET",
          data:{
            word:query,
            page:1,
            pageSize:50
          }
        }).then(res => {
          if(res.data.state){
						res = res.data.data
						this.wordList = res.list
						this.wordLoad = false
          }else{
						this.wordList = []
            this.wordLoad = false
          }
        }).catch(() => {
					this.wordList = []
          this.wordLoad = false
        });
      } else {
        this.wordList = [];
      }
		},

		//对话人数切换
		talkNumChange(){
			if(this.oracyForm.talk_num == 3 && this.oracyForm.talk_en.length == 2){
				this.oracyForm.talk_en.push('')
				this.oracyForm.talk_cn.push('')
				this.oracyForm.talk_audio.push('')
			}
		},
		//添加对话
		addTalk(){
			this.oracyForm.talk_en.push('')
			this.oracyForm.talk_cn.push('')
			this.oracyForm.talk_audio.push('')
		},
		//删除对话
		deleteTalk(i){
			this.$confirm( '确定删除这句对话？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.oracyForm.talk_en.splice(i,1)
				this.oracyForm.talk_cn.splice(i,1)
				this.oracyForm.talk_audio.splice(i,1)
			}).catch(() => {});
		},

		//搜索关联语法
    remoteMethodGrammar(query){
      if (query !== ''){
        this.grammarLoad = true;
        this.$api.request({
          url: "getGrammarList",
          method: "POST",
          data:{
						gra_name:query,
            page_num:1,
            page_size:50
          }
        }).then(res => {
          if(res.data.state){
						res = res.data.data
						this.grammarList = res.list
						this.grammarLoad = false
          }else{
						this.grammarList = []
            this.grammarLoad = false
          }
        }).catch(() => {
					this.grammarList = []
          this.grammarLoad = false
        });
      } else {
        this.grammarList = [];
      }
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
					let grammar = this.oracyForm.grammar_id
					if(this.oracyForm.words.length > 0){
						let wordsStr = ''
						for (let i = 0; i < this.oracyForm.words.length; i++) {
							const item = this.oracyForm.words[i];
							if(i == 0){
								wordsStr += item
							}else{
								wordsStr += (',' + item)
							}
						}
						this.oracyForm.words = wordsStr
					}else{
						this.oracyForm.words = ''
					}
					if(grammar){
						this.oracyForm.grammar = grammar
					}else{
						this.oracyForm.grammar = ''
					}
					if(this.oracyForm.ora_type == 1){
						delete this.oracyForm.grammar_id
						delete this.oracyForm.thumb
						delete this.oracyForm.pic
						delete this.oracyForm.talk_num
						delete this.oracyForm.talk_en
						delete this.oracyForm.talk_cn
						delete this.oracyForm.talk_audio
					}
					if(this.oracyForm.ora_type == 2){
						delete this.oracyForm.grammar_id
						delete this.oracyForm.ora_cn
					}
					if(this.dialogTitle == '创建口语'){
						this.oracyForm.oper = 'add'
					}
					if(this.dialogTitle == '编辑口语'){
						this.oracyForm.oper = 'modify'
					}
					let data = this.oracyForm
					// console.log(data)
					this.$api.request({
						url:'createOracy',
						method: "POST",
						data
					}).then(res => {
						if(res.data.state){
							this.dialogVisible = false
							if(this.dialogTitle == '创建口语'){
								this.handleCurrentChange(1)
							}
							if(this.dialogTitle == '编辑口语'){
								this.getTableList()
							}
							this.$notify({
								title: '成功',
								message: this.dialogTitle == '创建口语'?'口语创建成功':'口语信息已成功修改',
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