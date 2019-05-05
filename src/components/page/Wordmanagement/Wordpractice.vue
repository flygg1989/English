<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
				<div class="operation-left">
					<el-button type="primary" @click="openDialog('add')" class="creat-branch-btn">添加单词练习题</el-button>
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
					label="练习题目ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="word"
					label="单词练习题题目"
					min-width="144">
				</el-table-column>
        <el-table-column
          label="问题类型"
          min-width="144">
          <template slot-scope="scope">
            {{typeOptions.filter(item => item.value == scope.row.exer_type)[0].label}}
          </template>
        </el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					min-width="250">
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
						:current-page="apiRequest.page"
						:page-size="apiRequest.pageSize"
						:total="total">
					</el-pagination>
				</div>
			</div>
<!--添加单词练习题弹窗--->
			<el-dialog :title="formState == 'add'?'添加单词练习题':'编辑单词练习题'" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="50%">
        <el-form v-if="dialogVisible" v-loading="formLoad" ref="addform" :model="addForm" label-width="100px">
          <el-form-item label="关联单词" prop="word_id" :rules="rules.word">
            <el-select
							style="width:100%;"
              v-model="addForm.word_id"
              filterable
              remote
              placeholder="请搜索并选择要关联的单词"
							:disabled="formState == 'update'"
              :remote-method="remoteMethod"
              :loading="wordLoad">
              <el-option
                v-for="item in wordList"
                :key="item.id"
                :label="item.word"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-for="(item,i) in addForm.option_arr" :key="i" class="border_both">
            <el-form-item label="问题类型" :prop="'exer_type_arr.' + i" :rules="rules.exer_type_arr">
							<div style="width:100%;display:flex;">
								<el-select style="flex:1;" v-model="addForm.exer_type_arr[i]" @change="exerTypeChange(i)" placeholder="请选择问题类型">
									<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
								<el-button v-if="addForm.option_arr.length > 1" style="margin-left:10px;" type="danger" plain @click="deleteOption(i)">删除练习题</el-button>
							</div>
            </el-form-item>
						<el-form-item label="练习题选项" v-if="addForm.exer_type_arr[i] != 3">
							<div class="border_b">
								<el-form-item v-for="(option,j) in item" :key="j" :class="addForm.answer_arr[i]-1 == j?'bg-green':''" :label="addForm.answer_arr[i]-1 == j?'正确选项':'错误选项'" :prop="'option_arr.' + i + '.' + j" :rules="rules.option_arr">
									<el-input v-model.trim="item[j]"></el-input>
								</el-form-item>
							</div>
            </el-form-item>
          </div>
					<div style="text-align:center">
						<el-button type="primary" v-if="formState == 'add'" plain @click="addOption">添加练习题</el-button>
					</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="" @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submitForm('addform')">提交</el-button>
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
			 pageSize:5
			},
			total:0,
			searchValue:'',
      //单词初始数据结构
      typeOptions:[
        {value:1,label:"英选汉"},
        {value:2,label:"汉选英"},
        {value:3,label:"完形填空"}
			],
			//添加练习题弹窗
      addForm:{
        word_id:'',
        option_arr:[['','','','']],
        answer_arr:[null],
        exer_type_arr:[null]
      },
      dialogVisible:false,
      wordList:[],
      wordLoad:false,
			formLoad:false,
			formState:'add',
			exercise_id:null,
			//表单验证
			rules:{
				word: [{ required: true, message: '请选择关联单词', trigger: ['blur', 'change'] }],
				exer_type_arr: [{ required: true, message: '请选择问题类型', trigger: ['blur', 'change'] }],
				option_arr: [{ required: true, message: '请输入选项内容', trigger: ['blur', 'change'] }]
			}
    }
  },
  mounted(){
  	this.getTableList()
  },
  methods: {
		//获取习题列表
		getTableList(){
			this.isLoad = true
			this.$api.request({
				url: "wordExerciseList",
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
		//搜索单词练习题
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
		//删除练习题
		handleDelete(id){
			//console.log(id)
			this.$confirm( '该练习题将被删除' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoad = true
				this.$api.request({
					url: "delWordExercise",
					method: "GET",
					data:{
						exercise_id:id
					}
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


		//添加||编辑 单词练习题弹窗
		openDialog(val,exercise_id){
			this.formState = val
			this.dialogVisible = true
			this.formLoad = true
			//清空表格内容
			if(this.formState == 'add'){
				this.wordList = []
				let answer = Math.floor(Math.random()*4)+1
				this.addForm = {
					word_id:'',
					option_arr:[['','','','']],
					answer_arr:[answer],
					exer_type_arr:[1]
				}
				this.formLoad = false
			}

			//获取练习题详情
			if(this.formState == 'update'){
				this.$api.request({
					url: "wordExerciseDetail",
					method: "GET",
					data:{exercise_id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
						this.exercise_id = res.id
						this.wordList = [{id:res.word_id,word:res.word}]
						this.addForm = {
							word_id:res.word_id,
							option_arr:[res.options?res.options:['null','null','null','null']],
							answer_arr:[res.answer],
							exer_type_arr:[res.exer_type]
						}
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
    //搜索关联单词
    remoteMethod(query){
      let wordReg = /(^[A-Za-z]*$)/
      if (query !== '' && wordReg.test(query)){
        this.wordLoad = true;
        this.$api.request({
          url: "wordsList",
          method: "GET",
          data:{
            word:query,
            page:1,
            pageSize:1
          }
        }).then(res => {
          if(res.data.state){
						res = res.data.data
						this.wordList = res.list
						this.wordLoad = false
            // res = res.data.data
            // let wordTotal = res.total
            // this.$api.request({
            //   url: "wordsList",
            //   method: "GET",
            //   data:{
            //     word:query,
            //     page:1,
            //     pageSize:wordTotal
            //   }
            // }).then(res => {
            //   if(res.data.state){
            //     res = res.data.data
            //     this.wordList = res.list
            //     this.wordLoad = false
            //   }else{
						// 		this.wordList = []
            //     this.wordLoad = false
            //   }
            // }).catch(() => {
						// 	this.wordList = []
            //   this.wordLoad = false
            // });
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
		//练习题类型切换
		exerTypeChange(i){
			let answer = Math.floor(Math.random()*4)+1
			this.addForm.answer_arr[i] = answer
			if(this.addForm.exer_type_arr[i] == 3){
				this.addForm.option_arr[i] = ['null','null','null','null']
			}else{
				this.addForm.option_arr[i][0] = ''
				this.addForm.option_arr[i][1] = ''
				this.addForm.option_arr[i][2] = ''
				this.addForm.option_arr[i][3] = ''
			}
			setTimeout(() => {
				this.$refs['addform'].clearValidate(['option_arr.'+i+'.0','option_arr.'+i+'.1','option_arr.'+i+'.2','option_arr.'+i+'.3'])
			}, 100);
		},
		//添加练习题
		addOption(){
			let answer = Math.floor(Math.random()*4)+1
			this.addForm.option_arr.push(['','','',''])
			this.addForm.answer_arr.push(answer)
			this.addForm.exer_type_arr.push(1)
		},
		//删除练习题
		deleteOption(i){
			this.addForm.option_arr.splice(i,1)
			this.addForm.answer_arr.splice(i,1)
			this.addForm.exer_type_arr.splice(i,1)
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
					if(this.formState == 'add'){
						//console.log(this.addForm)
						this.formLoad = true
						this.$api.request({
							url: "addWordExercise",
							method: "POST",
							data:this.addForm
						}).then(res => {
							if(res.data.state){
								this.dialogVisible = false
								this.handleCurrentChange(1)
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
					}
					if(this.formState == 'update'){
						this.formLoad = true
						this.$api.request({
							url: "modifyWordExercise",
							method: "POST",
							data:{
								exercise_id:this.exercise_id,
								options:this.addForm.option_arr[0],
								answer:this.addForm.answer_arr[0],
								exer_type:this.addForm.exer_type_arr[0]
							}
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
					}
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