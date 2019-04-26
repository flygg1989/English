<template>
  <div class="heh-container">
		<div v-loading="isLoad" class="notabs-content">
			<!-- 头部 -->
			<div class="operation">
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
					label="问题ID"
					min-width="144">
				</el-table-column>
				<el-table-column
					prop="content"
					label="问题内容"
					min-width="144">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					min-width="250">
					<template slot-scope="scope">
                        <el-button @click="handleLook(scope.row)">查看</el-button>
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
		    <el-dialog title="问题反馈详情" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
                <el-form v-if="dialogVisible" ref="form" :model="Form" label-width="100px">
                    <el-form-item label="问题内容" prop="content">
                        <el-input type="textarea" autosize readonly v-model="Form.content"></el-input>
                    </el-form-item>
                    <el-form-item label="问题图片" v-if="Form.pictures">
                        <ul class="el-upload-list el-upload-list--picture-card">
                            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in Form.pictures" :key="index">
                                <img :src="item" alt="" class="el-upload-list__item-thumbnail">
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item,index)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="" @click="dialogVisible = false">取消</el-button>
                </span>
                <!--展示弹窗-->
                <el-dialog :visible.sync="picVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
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
            page_num:1,
            page_size:5
        },
        total:0,
        searchValue:'',
        dialogVisible:false,
        picVisible:false,
        dialogImageUrl:'',

        Form:{
            content:'',
            pictures:[],
        }
    }
  },
  mounted(){
    this.getTableList()  //获取列表
  },
  methods: {
    //获取列表
    getTableList(){
        this.isLoad = true
        this.$api.request({
        url: "getFeedBackList",
        method: "POST",
        data:this.apiRequest
        }).then(res => {
            if(res.data.state){
                res = res.data.data
                //console.log(res)
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
    
    //查看详情
    handleLook(row){
        console.log(row)
        this.dialogVisible =true;
        this.Form =row;
    },

    //图片 放大
    handlePictureCardPreview(item,index) {
        this.dialogImageUrl =item;
        this.picVisible = true;
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
    //搜索内容
    handleSreach(){
        this.clear();
        if(this.searchValue){
                this.apiRequest.title = this.searchValue
                this.handleCurrentChange(1)
        }else{
            delete this.apiRequest.title
            this.handleCurrentChange(1)
        }
    },
  }
}
</script>