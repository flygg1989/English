<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建听力练习题</el-button>
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
					label="练习题ID"
					min-width="72">
				</el-table-column>
				<el-table-column
					prop="hearing.talk_title"
					label="听力练习题题目"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="question"
					label="问题标题"
					min-width="144">
				</el-table-column>
				<el-table-column
          label="问题类型"
          min-width="144">
          <template slot-scope="scope">
            {{typeOptions.filter(item => item.value == scope.row.hear_type)[0].label}}
          </template>
        </el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					min-width="156">
					<template slot-scope="scope">
						<el-button type="primary"  @click="openDialog('update',scope.row.id)">编辑</el-button>
						<el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
          <el-form-item label="关联听力" prop="hear_id" :rules="rules.hear_id">
            <el-select
							style="width:100%;"
              v-model="hearingForm.hear_id"
              filterable
              remote
              placeholder="请搜索并选择要关联的听力"
              :remote-method="remoteMethod"
              @change="hearIdChange"
              :loading="hearingLoad">
              <el-option
                v-for="item in hearingList"
                :key="item.id"
                :label="item.talk_title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题类型">
						<el-select style="width:100%;" v-model="hearingForm.hear_type" :disabled="true" @change="hearTypeChange" placeholder="问题类型为关联听力的类型">
							<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item label="问题标题" prop="question" :rules="rules.question">
						<el-input v-model.trim="hearingForm.question"></el-input>
          </el-form-item>
          <el-form-item v-if="hearingForm.hear_type == 1" label="中文释义" prop="cn_express" :rules="rules.cn_express">
						<el-input v-model.trim="hearingForm.cn_express"></el-input>
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
          <el-form-item label="正确选项">
						<el-select style="width:100%;" v-model="hearingForm.answer" placeholder="请设置正确选项">
							<el-option v-for="item in answerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item label="练习题选项">
						<div class="border_b">
							<el-form-item v-for="(option,i) in hearingForm.options" :key="'options'+i" :class="hearingForm.answer-1 == i?'bg-green':''" :label="'选项'+(i+1)" :prop="'options.' + i" :rules="rules.options">
								<div style="width:100%;display:flex;">
									<el-input style="flex:1;" v-model.trim="hearingForm.options[i]"></el-input>
									<el-button v-if="hearingForm.options.length > 4" style="margin-left:10px;" type="danger" plain @click="deleteOption(i)">删除选项</el-button>
								</div>
							</el-form-item>
							<div style="text-align:center;margin-bottom:10px;">
								<el-button type="primary" plain @click="addOption">添加选项</el-button>
							</div>
						</div>
					</el-form-item>
          <el-form-item v-if="hearingForm.hear_type == 1" label="关联单词" prop="word_id" :rules="rules.word_id">
            <el-select
							style="width:100%;"
              v-model="hearingForm.word_id"
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
								:disabled="hearingForm.word_id.filter(word => word == item.id).length > 0?true:false">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="hearingForm.hear_type == 2" class="scenes_box">
						<el-form-item label="问题提示" style="margin-bottom:0;">
							<div class="border_b" v-for="(item,i) in hearingForm.tips_en" :key="'tips'+i">
								<el-form-item label="英文" :prop="'tips_en.'+ i" :rules="rules.tips_en">
									<el-input v-model.trim="hearingForm.tips_en[i]"></el-input>
								</el-form-item>
								<el-form-item label="释义" :prop="'tips_cn.'+ i" :rules="rules.tips_cn">
									<el-input v-model.trim="hearingForm.tips_cn[i]"></el-input>
								</el-form-item>
								<div style="text-align:right;margin-bottom:10px;">
									<el-button v-if="hearingForm.tips_en.length > 2" type="danger" plain @click="deleteTip(i)">删除提示</el-button>
								</div>
							</div>
							<div style="text-align:center;">
								<el-button type="primary" plain @click="addTip">添加提示</el-button>
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
		
		var validateCnExpress = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 1){
				if(!value){
					return callback(new Error('请填写问题标题中文释义'));
				}else{
					callback()
				}
			}else{
				callback()
			}
    }
    var validateWordId = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 1){
				if(value.length <= 0){
					return callback(new Error('请添加关联单词'));
				}else{
					callback()
				}
			}else{
				callback()
			}
    }
    var validateTipsEn = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请输入英文内容'));
				}else{
					callback()
				}
			}else{
				callback()
			}
    }
    var validateTipsCn = (rule, value, callback) => {
			if(this.hearingForm.hear_type == 2){
				if(!value){
					return callback(new Error('请输入释义内容'));
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
			//练习题初始数据结构
			hearingForm:{
				hear_id:'',
				hear_type:null,
				question:'',
				cn_express:'',
				audio_url:'',
				answer:1,
				options:['','','',''],
				word_id:[],
				tips_en:['','',''],
				tips_cn:['','','']
			},
			//添加||编辑 听力弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
			hearingLoad:false,
			hearingList:[],
			wordLoad:false,
			wordList:[],
			answerOptions:[
        {value:1,label:"选项1"},
        {value:2,label:"选项2"},
        {value:3,label:"选项3"},
        {value:4,label:"选项4"}
			],
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			//表单验证
			rules:{
				hear_id: [{ required: true, message: '请选择关联听力', trigger: ['blur', 'change'] }],
				audio_url: [{ required: true, message: '请上传练习题语音', trigger: ['blur', 'change'] }],
				question: [{ required: true, message: '请输入问题标题', trigger: ['blur', 'change'] }],
				cn_express: [{ required: true, validator:validateCnExpress, trigger: ['blur', 'change'] }],
        options: [{ required: true, message: '请输入选项内容', trigger: ['blur', 'change'] }],
        word_id: [{ required: true, validator:validateWordId, trigger: ['blur', 'change'] }],
				tips_en: [{ required: true, validator:validateTipsEn, trigger: ['blur', 'change'] }],
				tips_cn: [{ required: true, validator:validateTipsCn, trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取练习题列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "getHearingExerciseList",
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
		//搜索练习题
		handleSreach(){
			if(this.searchValue){
				this.apiRequest.question_name = this.searchValue
				this.handleCurrentChange(1)
			}else{
				delete this.apiRequest.question_name
				this.handleCurrentChange(1)
			}
		},
		//删除练习
		handleDelete(hear_exercise_id){
			this.$confirm( '该练习题将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "deleteHearingExercise",
					method: "POST",
					data:{hear_exercise_id}
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


		//创建||编辑 练习题弹窗
		openDialog(val,hear_exercise_id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建听力练习题'
				let answer = Math.floor(Math.random()*4)+1
				this.hearingForm = {
					hear_id:'',
					hear_type:null,
					question:'',
					cn_express:'',
					audio_url:'',
					answer:answer,
					options:['','','',''],
					word_id:[],
					tips_en:['','',''],
					tips_cn:['','','']
				}
				this.answerOptions = [
					{value:1,label:"选项1"},
					{value:2,label:"选项2"},
					{value:3,label:"选项3"},
					{value:4,label:"选项4"}
				]
				this.wordList = []
				this.hearingList = []
				this.formLoad = false
			}
			//获取听力练习题详情
			if(val == 'update'){
				this.dialogTitle = '编辑听力练习题'
				this.$api.request({
					url: "showHearingExercise",
					method: "POST",
					data:{hear_exercise_id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						this.answerOptions = []
						for (let i = 0; i < res.options.length; i++) {
							let newItem = {}
							newItem.value = i+1
							newItem.label = '选项'+(i+1)
							this.answerOptions.push(newItem)
						}
            this.hearingList = [{id:res.hearing.id,talk_title:res.hearing.talk_title,hear_type:res.hearing.hear_type}]
            res.hear_type = res.hearing.hear_type
						let wordlist = []
						let newWords = []
						for (let i = 0; i < res.word_detail.length; i++) {
							let item = res.word_detail[i]
							let newitem = {id:item.id,word:item.word}
							wordlist.push(newitem)
							newWords.push(item.id)
            }
            res.word_id = newWords
            this.wordList = wordlist
            this.hearingForm = res
            // console.log(this.wordList)
            // console.log(this.hearingList)
            // console.log(this.hearingForm)
						this.formLoad = false
						setTimeout(() => {
							this.$refs['form'].clearValidate()
						}, 100);
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
		//搜索关联听力
    remoteMethod(query){
      if (query !== ''){
        this.hearingLoad = true;
        this.$api.request({
          url: "getHearingList",
          method: "POST",
          data:{
						talk_title:query,
						type:1,
            page:1,
            pageSize:50
          }
        }).then(res => {
          if(res.data.state){
						res = res.data.data
            this.hearingList = res.list
            // console.log(res)
						this.hearingLoad = false
          }else{
						this.hearingList = []
            this.hearingLoad = falsee
          }
        }).catch(() => {
					this.hearingList = []
          this.hearingLoad = false
        });
      } else {
        this.hearingList = [];
      }
    },
    //关联听力切换
    hearIdChange(){
      // console.log(this.hearingForm.hear_id)
      // console.log(this.hearingList)
      this.hearingForm.hear_type = this.hearingList.filter(item => item.id == this.hearingForm.hear_id)[0].hear_type
      // console.log(this.hearingForm.hear_type)
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
		//上传失败
		uploadError(err){
			this.$notify.error({
				title: '请求失败',
				message: err
			});
		},

		//练习题类型切换
		hearTypeChange(){
			if(this.hearingForm.hear_type == 1){
        this.hearingForm.cn_express = ''
        this.hearingForm.word_id = []
			}else if(this.hearingForm.hear_type == 2){
				this.hearingForm.tips_en = ['','','']
				this.hearingForm.tips_cn = ['','','']
			}
			setTimeout(() => {
				this.$refs['form'].clearValidate()
			}, 100);
		},
		//添加选项
		addOption(){
			this.hearingForm.options.push('')
			this.answerOptions.push({
				value:this.hearingForm.options.length,
				label:'选项'+this.hearingForm.options.length
			})
		},
		//删除选项
		deleteOption(i){
			this.hearingForm.options.splice(i,1)
			this.answerOptions.splice(this.answerOptions.length-1,1)
			if(this.hearingForm.answer > this.answerOptions.length){
				this.hearingForm.answer = this.answerOptions.length
			}
		},
		//添加提示
		addTip(){
			this.hearingForm.tips_en.push('')
			this.hearingForm.tips_cn.push('')
		},
		//删除提示
		deleteTip(i){
			this.hearingForm.tips_en.splice(i,1)
			this.hearingForm.tips_cn.splice(i,1)
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
					// console.log(this.hearingForm)
          this.formLoad = true
          let data = {}
					if(this.hearingForm.hear_type == 1){
            let wordsStr = ''
						for (let i = 0; i < this.hearingForm.word_id.length; i++) {
							const item = this.hearingForm.word_id[i];
							if(i == 0){
								wordsStr += item
							}else{
								wordsStr += (',' + item)
							}
            }
            data = {
              hear_id:this.hearingForm.hear_id,
              hear_type:this.hearingForm.hear_type,
              question:this.hearingForm.question,
              cn_express:this.hearingForm.cn_express,
              audio_url:this.hearingForm.audio_url,
              answer:this.hearingForm.answer,
              options:this.hearingForm.options,
              word_id:wordsStr
            }
					}
					if(this.hearingForm.hear_type == 2){
            data = {
              hear_id:this.hearingForm.hear_id,
              hear_type:this.hearingForm.hear_type,
              question:this.hearingForm.question,
              audio_url:this.hearingForm.audio_url,
              answer:this.hearingForm.answer,
              options:this.hearingForm.options,
              tips_en:this.hearingForm.tips_en,
              tips_cn:this.hearingForm.tips_cn
            }
					}
					let url = ''
					if(this.dialogTitle == '创建听力练习题'){
						url = 'createHearingExercise'
					}
					if(this.dialogTitle == '编辑听力练习题'){
						url = 'editHearingExercise'
						data.hear_exercise_id = this.hearingForm.id
					}
					console.log(data)
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
								message: this.dialogTitle == '创建听力练习题'?'听力练习题创建成功':'听力练习题已成功修改',
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