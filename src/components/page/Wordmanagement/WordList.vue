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
			wordForm:{
				word:'',
				read_spell:'',
				voice_source:'',
				detail:[
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
			}
    }
  },
  mounted(){
  	this.getWordsList()
  },
  methods: {
		//获取单词列表
		getWordsList(){
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
				}
			}).then(() => {
				this.isLoad = false
			})
		},
		//切换页
		handleCurrentChange(val){
			this.apiRequest.page = val
			this.getWordsList()
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
					this.getWordsList()
				}
			})
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
			}).catch(() => {});
		},
		//添加||编辑 单词弹窗
		openDialog(val,id){
			//清空表格内容
			if(val == 'add'){
				console.log(val)
			}
			//获取单词详情
			if(val == 'update'){
				this.$api.request({
					url: "wordDetail",
					method: "GET",
					data:{id}
				}).then(res => {
					if(res.data.state){
						res = res.data.data
						console.log(res)
					}
				}).then(() => {
					//this.isLoad = false
				})
			}
		},
  }
}
</script>