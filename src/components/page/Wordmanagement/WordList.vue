<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">创建单词</el-button>
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
					label="单词ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="word"
					label="单词名称"
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
						:page-size="apiRequest.pagesize"
						:total="total">
					</el-pagination>
				</div>
			</div>
<!--创建 编辑弹窗--->
			<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="50%">
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="form" :model="wordForm" label-width="100px">
          <el-form-item label="单词名称" prop="word" :rules="rules.word">
						<el-input v-model.trim="wordForm.word"></el-input>
          </el-form-item>
          <el-form-item label="音标" prop="read_spell" :rules="rules.read_spell">
						<el-input v-model.trim="wordForm.read_spell"></el-input>
          </el-form-item>
          <el-form-item label="读音" prop="voice_source" :rules="rules.voice">
						<div style="width:100%;display:flex;">
							<el-input v-show="false" v-model.trim="wordForm.voice_source"></el-input>
							<audio-player v-if="wordForm.voice_source" :src="wordForm.voice_source"/>
							<el-upload
								style="margin:auto 10px;height:32px;"
								:action="uploadvoice"
								accept="audio/mp3"
								name="upload_resource"
								:show-file-list="false"
								:before-upload="beforeUpload"
								:on-success="voiceSourceSuccess"
								:on-error="voiceSourceError">
								<el-button size="small" type="primary">上传读音</el-button>
							</el-upload>
						</div>
          </el-form-item>
          <!--添加词性-->
          <div v-for="(item,i) in wordForm.details" :key="i" class="border_both">
            <el-form-item label="词性与解释" :prop="'details.'+i+'.cn_express'" :rules="rules.cn_express">
							<div style="width:100%;display:flex;">
								<el-input style="flex:1;" v-model.trim="item.cn_express"></el-input>
								<el-button v-if="wordForm.details.length > 1" style="margin-left:10px;" type="danger" @click="deleteExpress(i)">删除词性</el-button>
							</div>
            </el-form-item>
            <!--释义--->
						<el-form-item style="padding-bottom:10px;border-bottom:1px solid #e5e5e5;" label="释义">
							<div class="border_b" v-for="(subitem,j) in item.detail.explain" :key="j">
								<!-- <el-form-item label="">
									<el-button style="float:right" type="danger" plain @click="deleteExplain(i,j)">删除释义</el-button>
								</el-form-item> -->
								<el-form-item label="英文释义" :prop="'details.'+ i +'.detail.explain.' + j + '.en'" :rules="rules.en_explain">
									<el-input v-model.trim="subitem.en"></el-input>
								</el-form-item>
								<el-form-item label="中文释义" :prop="'details.'+ i +'.detail.explain.' + j + '.cn'" :rules="rules.cn_explain">
									<el-input v-model.trim="subitem.cn"></el-input>
								</el-form-item>
								<el-form-item label="读音" :prop="'details.'+ i +'.detail.explain.' + j + '.voice'" :rules="rules.voice">
									<el-input v-show="false" v-model.trim="subitem.voice"></el-input>
									<audio-player style="margin-bottom:10px;" v-if="subitem.voice" :src="subitem.voice"/>
									<div style="width:100%;display:flex;justify-content:flex-end;">
										<el-upload
											style="height:32px;"
											:action="uploadvoice"
											accept="audio/mp3"
											:show-file-list="false"
											:before-upload="beforeUpload"
											:http-request="voiceUpload"
											:data="{type:'explain',i,j}">
											<el-button size="small" type="primary">上传读音</el-button>
										</el-upload>
										<el-button v-if="wordForm.details[i].detail.explain.length > 1" style="margin-left:10px;" type="danger" plain @click="deleteExplain(i,j)">删除释义</el-button>
									</div>
								</el-form-item>
							</div>
							<div style="text-align:center">
								<el-button type="primary" plain @click="addExplain(i)">添加释义</el-button>
							</div>
						</el-form-item>
            <!--例句--->
            <el-form-item label="例句">
              <div class="border_b" v-for="(subitem,j) in item.detail.sentence" :key="j">
								<!-- <el-form-item label="">
									<el-button style="float:right" type="danger" plain @click="deleteSentence(i,j)">删除例句</el-button>
                </el-form-item> -->
                <el-form-item label="英文例句" :prop="'details.'+ i +'.detail.sentence.' + j + '.en'" :rules="rules.en_sentence">
                  <el-input v-model.trim="subitem.en"></el-input>
                </el-form-item>
                <el-form-item label="中文例句" :prop="'details.'+ i +'.detail.sentence.' + j + '.cn'" :rules="rules.cn_sentence">
                  <el-input v-model.trim="subitem.cn"></el-input>
                </el-form-item>
								<el-form-item label="读音" :prop="'details.'+ i +'.detail.sentence.' + j + '.voice'" :rules="rules.voice">
									<el-input v-show="false" v-model.trim="subitem.voice"></el-input>
									<audio-player style="margin-bottom:10px;" v-if="subitem.voice" :src="subitem.voice"/>
									<div style="width:100%;display:flex;justify-content:flex-end;">
										<el-upload
											style="margin:auto 10px;height:32px;"
											:action="uploadvoice"
											accept="audio/mp3"
											:show-file-list="false"
											:before-upload="beforeUpload"
											:http-request="voiceUpload"
											:data="{type:'sentence',i,j}">
											<el-button size="small" type="primary">上传读音</el-button>
										</el-upload>
										<el-button style="margin-left:10px;" type="danger" plain @click="deleteSentence(i,j)">删除例句</el-button>
									</div>
								</el-form-item>
              </div>
							<div style="text-align:center">
								<el-button type="primary" plain @click="addSentence(i)">添加例句</el-button>
							</div>
						</el-form-item>
          </div>
					<div style="text-align:center">
						<el-button type="primary" @click="addExpress">添加词性</el-button>
					</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submitForm('form',dialogTitle == '创建单词'?1:2)">提交</el-button>
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
			apiRequest:{
			 page:1,
			 pagesize:5
			},
			total:0,
			searchValue:'',
			//单词初始数据结构
			wordForm:{
				word:'',
				read_spell:'',
				voice_source:'',
				details:[
					{
						cn_express:'',
						detail:{
							explain:[
								{
									cn:'',
									en:'',
									voice:''
								}
							],
							sentence:[
								{
									cn:'',
									en:'',
									voice:''
								}
							]
						}
					}
				]
			},
			//添加||编辑 单词弹窗
			dialogVisible:false,
			dialogTitle:'',
			formLoad:false,
			uploadvoice:domain.uploadUrl + '&upload_type=audio',
			//voiceUrl:domain.voiceUrl,
			token:domain.testToken,
			//表单验证
			rules:{
				word: [{ required: true, message: '请输入单词名称', trigger: ['blur', 'change'] }],
				read_spell: [{ required: true, message: '请输入单词音标', trigger: ['blur', 'change'] }],
				voice: [{ required: true, message: '请上传读音', trigger: ['blur', 'change'] }],
				cn_express: [{ required: true, message: '请输入词性名称', trigger: ['blur', 'change'] }],
				en_explain: [{ required: true, message: '请输入英文释义', trigger: ['blur', 'change'] }],
				cn_explain: [{ required: true, message: '请输入中文释义', trigger: ['blur', 'change'] }],
				en_sentence: [{ required: true, message: '请输入英文例句', trigger: ['blur', 'change'] }],
				cn_sentence: [{ required: true, message: '请输入中文例句', trigger: ['blur', 'change'] }],
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取单词列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "wordsList",
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
			this.apiRequest.pagesize = val
			this.handleCurrentChange(1)
		},
		//搜索单词
		handleSreach(){
			let wordRg = /(^[A-Za-z]*$)/
			if(this.searchValue){
				if(wordRg.test(this.searchValue)){
					this.apiRequest.word = this.searchValue
					this.handleCurrentChange(1)
				}else{
					this.$message({
						message:'单词只能包含字母',
						type:'warning'
					});
				}
			}else{
				delete this.apiRequest.word
				this.handleCurrentChange(1)
			}
		},
		//启用||停用 单词
		switchChange(row){
			this.isLoad = true
			this.$api.request({
				url: "opWord",
				method: "POST",
				data:{
					op_type:2,
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
		//删除单词
		handleDelete(id){
			//console.log(id)
			this.$confirm( '该单词将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "opWord",
					method: "POST",
					data:{
						op_type:3,
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
					}
				})
			}).catch(() => {
				this.isLoad = false
			});
		},


		//添加||编辑 单词弹窗
		openDialog(val,id){
			//清空表格内容
			this.dialogVisible = true
			this.formLoad = true
			if(val == 'add'){
				this.dialogTitle = '创建单词'
				this.wordForm = {
					word:'',read_spell:'',voice_source:'',
					details:[
						{
							cn_express:'',
							detail:{
								explain:[{cn:'',en:'',voice:''}],
								sentence:[{cn:'',en:'',voice:''}]
							}
						}
					]
				}
				this.formLoad = false
			}
			//获取单词详情
			if(val == 'update'){
				this.dialogTitle = '编辑单词'
				this.$api.request({
					url: "wordDetail",
					method: "GET",
					data:{id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						for (let i = 0; i < res.details.length; i++) {
							delete res.details[i].word_id
						}
						this.wordForm = res
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
		//添加词性
		addExpress(){
			this.wordForm.details.push({
				cn_express:'',
				detail:{
					explain:[{cn:'',en:'',voice:''}],
					sentence:[{cn:'',en:'',voice:''}]
				}
			})
		},
		//删除词性
		deleteExpress(i){
			if(this.wordForm.details.length <= 1){
				this.$message({
					message:'单词至少要有一条词性',
					type:'warning'
				});
			}else{
				this.$confirm( '确定删除该词性？' , '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.wordForm.details.splice(i,1);
				}).catch(() => {});
			}
		},
		//添加释义
		addExplain(i){
			this.wordForm.details[i].detail.explain.push({cn:'',en:'',voice:''})
		},
		//删除释义
		deleteExplain(i,j){
			if(this.wordForm.details[i].detail.explain.length <= 1){
				this.$message({
					message:'词性至少要有一条释义',
					type:'warning'
				});
			}else{
				this.$confirm( '确定删除该释义？' , '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.wordForm.details[i].detail.explain.splice(j,1)
				}).catch(() => {});
			}
		},
		//添加例句
		addSentence(i){
			this.wordForm.details[i].detail.sentence.push({cn:'',en:'',voice:''})
		},
		//删除例句
		deleteSentence(i,j){
			this.$confirm( '确定删除该释义？' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.wordForm.details[i].detail.sentence.splice(j,1)
			}).catch(() => {});
		},


		//录音上传前
		beforeUpload(file) {
			const isMP3 = file.type === 'audio/mp3';
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
				this.wordForm.voice_source = res.data.src
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
			let type = param.data.type
			let i = param.data.i
			let j = param.data.j
			const formData = new FormData()
			formData.append('upload_resource', param.file)
			this.$voiceApi.request({
				formData
			}).then(res => {
				if(res.data.state){
					if(param.data.type == 'explain'){
						this.wordForm.details[i].detail.explain[j].voice = res.data.data.src
					}
					if(param.data.type == 'sentence'){
						this.wordForm.details[i].detail.sentence[j].voice = res.data.data.src
					}
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
					let newDetail = []
					for (let i = 0; i < this.wordForm.details.length; i++) {
						let newItem = {}
						const item = this.wordForm.details[i];
						newItem.cn_express = item.cn_express
						newItem.explain = item.detail.explain
						newItem.sentence = item.detail.sentence
						newDetail.push(newItem)
					}

					let data = {
						op_type:op_type,
						word:this.wordForm.word,
						read_spell:this.wordForm.read_spell,
						voice_source:this.wordForm.voice_source,
						detail:newDetail
					}
					// if(op_type == 1){
					// 	data.detail = newDetail
					// }
					if(op_type == 2){
						data.id = this.wordForm.id
						// data.details = newDetail
					}
					console.log(data)
					this.$api.request({
						url: "opWord",
						method: "POST",
						data:data
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