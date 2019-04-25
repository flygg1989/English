<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建语法练习题</el-button>
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
					label="练习题ID"
					min-width="72">
				</el-table-column>
				<el-table-column
					prop="grammar.gra_name"
					label="语法练习题题目"
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
            {{typeOptions.filter(item => item.value == scope.row.exec_type)[0].label}}
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
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="grammarForm" label-width="100px">
          <el-form-item label="关联语法" prop="grammar_id" :rules="rules.grammar_id">
            <el-select
							style="width:100%;"
              v-model="grammarForm.grammar_id"
              filterable
              remote
              placeholder="请搜索并选择要关联的语法"
              :remote-method="remoteMethod"
              :loading="grammarLoad">
              <el-option
                v-for="item in grammarList"
                :key="item.id"
                :label="item.gra_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
					<el-form-item label="问题类型">
						<el-select style="width:100%;" v-model="grammarForm.exec_type" @change="execTypeChange" placeholder="请选择问题类型">
							<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="grammarForm.exec_type == 1" label="音频" prop="hear_source" :rules="rules.hear_source">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="grammarForm.hear_source"></el-input>
							<audio-player v-if="grammarForm.hear_source" :src="grammarForm.hear_source"/>
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
					<el-form-item v-if="grammarForm.exec_type == 2" label="解析内容" prop="tips_analyze" :rules="rules.tips_analyze">
						<el-input type="textarea" :rows="4" v-model.trim="grammarForm.tips_analyze"></el-input>
          </el-form-item>
					<el-form-item label="问题标题" prop="question" :rules="rules.question">
						<el-input v-model.trim="grammarForm.question"></el-input>
          </el-form-item>
					<el-form-item label="正确选项">
						<el-select style="width:100%;" v-model="grammarForm.answer" placeholder="请设置正确选项">
							<el-option v-for="item in answerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="练习题选项">
						<div class="border_b">
							<el-form-item v-for="(option,i) in grammarForm.options" :key="'options'+i" :class="grammarForm.answer-1 == i?'bg-green':''" :label="'选项'+(i+1)" :prop="'options.' + i" :rules="rules.options">
								<div style="width:100%;display:flex;">
									<el-input style="flex:1;" v-model.trim="grammarForm.options[i]"></el-input>
									<el-button v-if="grammarForm.options.length > 4" style="margin-left:10px;" type="danger" plain @click="deleteOption(i)">删除选项</el-button>
								</div>
							</el-form-item>
							<div style="text-align:center;margin-bottom:10px;">
								<el-button type="primary" plain @click="addOption">添加选项</el-button>
							</div>
						</div>
					</el-form-item>
					<div class="scenes_box">
						<el-form-item label="问题提示" style="margin-bottom:0;">
							<div class="border_b" v-for="(item,i) in grammarForm.tips_en" :key="'tips'+i">
								<el-form-item label="英文" :prop="'tips_en.'+ i" :rules="rules.en_name">
									<el-input v-model.trim="grammarForm.tips_en[i]"></el-input>
								</el-form-item>
								<el-form-item label="释义" :prop="'tips_cn.'+ i" :rules="rules.cn_name">
									<el-input v-model.trim="grammarForm.tips_cn[i]"></el-input>
								</el-form-item>
								<div style="text-align:right;margin-bottom:10px;">
									<el-button v-if="grammarForm.exec_type == 1 && grammarForm.tips_en.length > 2" type="danger" plain @click="deleteTip(i)">删除提示</el-button>
								</div>
							</div>
							<div style="text-align:center;">
								<el-button v-if="grammarForm.exec_type == 1" type="primary" plain @click="addTip">添加提示</el-button>
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
		var validateHearSource = (rule, value, callback) => {
			if(this.grammarForm.exec_type == 1){
				if(!value){
					return callback(new Error('请上传练习题语音'));
				}else{
					callback()
				}
			}else{
				callback()
			}
		}
		var validateTipsAnalyze = (rule, value, callback) => {
			if(this.grammarForm.exec_type == 2){
				if(!value){
					return callback(new Error('请填写练习题解析'));
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
        {value:1,label:"语音段落播放试题"},
        {value:2,label:"句子选词"}
			],
			//语法初始数据结构
			grammarForm:{
				grammar_id:'',
				exec_type:1,
				hear_source:'',
				tips_analyze:'',
				question:'',
				answer:1,
				options:['','','',''],
				tips_en:['','',''],
				tips_cn:['','','']
			},
			//添加||编辑 单词弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
			grammarLoad:false,
			grammarList:[],
			answerOptions:[
        {value:1,label:"选项1"},
        {value:2,label:"选项2"},
        {value:3,label:"选项3"},
        {value:4,label:"选项4"}
			],
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			//表单验证
			rules:{
				grammar_id: [{ required: true, message: '请选择关联语法', trigger: ['blur', 'change'] }],
				hear_source: [{ required: true, validator:validateHearSource, trigger: ['blur', 'change'] }],
				tips_analyze: [{ required: true, validator:validateTipsAnalyze, trigger: ['blur', 'change'] }],
				question: [{ required: true, message: '请输入问题标题', trigger: ['blur', 'change'] }],
				options: [{ required: true, message: '请输入选项内容', trigger: ['blur', 'change'] }],
				en_name: [{ required: true, message: '请输入英文内容', trigger: ['blur', 'change'] }],
				cn_name: [{ required: true, message: '请输入释义内容', trigger: ['blur', 'change'] }],
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
				url: "getGrammarExerciseList",
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
		//删除练习
		handleDelete(grammer_exercise_id){
			this.$confirm( '该练习题将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "deleteGrammerExercise",
					method: "POST",
					data:{grammer_exercise_id}
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


		//创建||编辑 语法弹窗
		openDialog(val,grammer_exercise_id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建语法练习题'
				let answer = Math.floor(Math.random()*4)+1
				this.grammarForm = {
					grammar_id:'',
					exec_type:1,
					hear_source:'',
					tips_analyze:'',
					question:'',
					answer:answer,
					options:['','','',''],
					tips_en:['','',''],
					tips_cn:['','','']
				}
				this.answerOptions = [
					{value:1,label:"选项1"},
					{value:2,label:"选项2"},
					{value:3,label:"选项3"},
					{value:4,label:"选项4"}
				]
				this.formLoad = false
			}
			//获取语法练习题详情
			if(val == 'update'){
				this.dialogTitle = '编辑语法练习题'
				this.$api.request({
					url: "showGrammerExercise",
					method: "POST",
					data:{grammer_exercise_id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						this.answerOptions = []
						console.log(res)
						this.grammarList = [{id:res.grammar.id,gra_name:res.grammar.gra_name}]
						this.grammarForm = res
						for (let i = 0; i < this.grammarForm.options.length; i++) {
							let newItem = {}
							newItem.value = i+1
							newItem.label = '选项'+(i+1)
							this.answerOptions.push(newItem)
						}
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
		//搜索关联语法
    remoteMethod(query){
      if (query !== ''){
        this.grammarLoad = true;
        this.$api.request({
          url: "getGrammarList",
          method: "POST",
          data:{
						gra_name:query,
						type:1,
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
				this.grammarForm.hear_source = res.data.src
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
		execTypeChange(){
			if(this.grammarForm.exec_type == 1){
				this.grammarForm.tips_en = ['','','']
				this.grammarForm.tips_cn = ['','','']
			}else if(this.grammarForm.exec_type == 2){
				this.grammarForm.tips_en = ['']
				this.grammarForm.tips_cn = ['']
			}
			setTimeout(() => {
				this.$refs['form'].clearValidate(['tips_en.0','tips_cn.0'])
			}, 100);
		},
		//添加选项
		addOption(){
			this.grammarForm.options.push('')
			this.answerOptions.push({
				value:this.grammarForm.options.length,
				label:'选项'+this.grammarForm.options.length
			})
		},
		//删除选项
		deleteOption(i){
			this.grammarForm.options.splice(i,1)
			this.answerOptions.splice(this.answerOptions.length-1,1)
			if(this.grammarForm.answer > this.answerOptions.length){
				this.grammarForm.answer = this.answerOptions.length
			}
		},
		//添加提示
		addTip(){
			this.grammarForm.tips_en.push('')
			this.grammarForm.tips_cn.push('')
		},
		//删除提示
		deleteTip(i){
			this.grammarForm.tips_en.splice(i,1)
			this.grammarForm.tips_cn.splice(i,1)
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
					// console.log(this.grammarForm)
					this.formLoad = true
					let data = this.grammarForm
					if(data.exec_type == 1){
						delete data.tips_analyze
					}
					if(data.exec_type == 2 ){
						delete data.hear_source
					}
					let url = ''
					if(this.dialogTitle == '创建语法练习题'){
						url = 'createGrammerExercise'
					}
					if(this.dialogTitle == '编辑语法练习题'){
						url = 'editGrammerExercise'
						data.grammer_exercise_id = this.grammarForm.id
						delete data.created_at
						delete data.grammar
						delete data.id
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
							this.getTableList()
							this.$notify({
								title: '成功',
								message: this.dialogTitle == '创建语法练习题'?'语法练习题创建成功':'语法练习题已成功修改',
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