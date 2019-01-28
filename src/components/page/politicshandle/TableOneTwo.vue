<template>
  <div class="tabs-content" v-loading="isLoad">
    <el-table
      :data="tableList"
      height="100%"
      empty-text="没有更多数据了"
      header-row-class-name="table-header"
      @sort-change="sortChange"
      @selection-change="batchOperation"
      style="width:100%;">
      <el-table-column
        type="selection"
        width="32">
      </el-table-column>
      <el-table-column
        fixed
        prop="title"
        label="标题"
        width="280">
        <template slot-scope="scope">
          <div class="title-box" @click="handleClick(scope.row)">
            <div class="title-left">
              <div class="title-name">{{ scope.row.title }}</div>
              <div v-if="scope.row.is_top == '2' || scope.row.is_chase == '1' || scope.row.is_show == '2'" class="title-tab">
                <span v-if="scope.row.is_top == '2'" class="is-top">置顶</span>
                <span v-if="scope.row.is_show == '2'" class="is-top">隐藏</span>
                <span v-if="scope.row.is_chase == '1'" class="is-chase">追问</span>
              </div>
            </div>
            <div v-if="scope.row.suggest.attachments.length > 0" class="title-right">
              <img src="static/img/icon-photo.png">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="80">
        <template slot-scope="scope">
          <div>{{scope.row.suggest.sug_type.type_name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="审核时间"
        sortable="custom"
        width="144">
        <template slot-scope="scope">
          <div v-if="scope.row.verifyName == '待审核'?false:true">{{scope.row.suggest.updated_at.substring(0,scope.row.suggest.updated_at.length-3)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="退回原因"
        width="184">
        <template slot-scope="scope">
          <!-- <div v-if="scope.row.verifyName != '审核不通过'?false:true">
            <el-tooltip class="table-tooltip" visible-arrow="" effect="light">
              <div slot="content">{{scope.row.rejectreason}}</div>
              <el-button type="text" class="hover-btn">退回原因</el-button>
            </el-tooltip>
          </div> -->
          <el-tooltip class="table-tooltip" visible-arrow="" effect="light"  v-if="scope.row.verifyName == '审核不通过'">
            <div slot="content">{{scope.row.reason}}</div>
            <el-button type="text" class="hover-btn">退回原因</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="verifyName"
        label="审核结果"
        min-width="144">
        <template slot-scope="scope">
          <span v-if="scope.row.verifyName == '待审核'">{{ scope.row.verifyName }}</span>
          <span v-if="scope.row.verifyName == '审核通过'" class="font-green">{{ scope.row.verifyName }}</span>
          <span v-if="scope.row.verifyName == '审核不通过'" class="font-red">{{ scope.row.verifyName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="footer-left">
        <el-button plain type="primary" @click="refresh">刷新</el-button>
      </div>
      <div class="footer-right">
        <el-pagination
          background
          :current-page="listData.page"
          :page-size="listData.limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="sizes, prev, pager, next"
          :total="amount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
import Bus from "@/components/common/bus.js";

export default {
  name:"TableOneTwo",
  data() {
    return {
      isLoad:false,
      tableList:[],//------------表格列表
      amount:0,//----------------表格数据总数
      batchList:[],//------------已选列表
      listData:{//---------------表格请求参数
        status:'3',
        expand:'suggest.attachments',
        area:'',
        order:'',
        is_chase:'',
        t:'',
        title:'',
        page:1,
        limit:0
      }
    };
  },
  created(){
    this.getList(this.listData)
  },
  mounted(){
    //监听operation组件筛选/搜索值
    Bus.$on('operationDataChange', (data,value) => {
      if(value == '2'){
        this.listData.is_chase = data.filterValue
        this.listData.t = data.timeValue
        this.listData.title = data.searchValue
        //console.log(data)
        this.getList(this.listData)
      }
    })
    //监听弹窗成功操作单条数据事件
    Bus.$on('detailChange',(data) => {
      console.log(data);
      if(data == true){
        
        this.getList(this.listData)
      }
    })
  },
  beforeUpdate(){
    //更新用户更改后的每页条数
    api.request({
      url: "suggest",
      method: "GET"
    }).then(res=>{
      if(res.status == 200){
        this.listData.limit = res.data.data.common.per_page
        //console.log(this.listData.limit);
      }
    },res => {
      this.$notify.error({
          title: "错误",
          message: "数据请求失败"
        });
    })
  },
  methods:{
    //刷新按钮
    refresh(){
      this.handleCurrentChange(1)
    },

    //---      排序函数      ----//
    sortChange(value){
      
      //按审核时间排序
      if(value.prop == "updated_at"){{
        if(value.order == 'ascending'){
          this.listData.order = 'updated_at asc'
        }else if(value.order == 'descending'){
          this.listData.order = 'updated_at desc'
        }
      }}
      this.getList(this.listData)

    },

    //element-ui函数
    //获取单条信息详情
    handleClick(row) {
      console.log(row);
      Bus.$emit('sendID', row)//-------发送单挑信息到弹窗组件
    },
    //多选
    batchOperation(selection){
      this.batchList = selection
    },
    handleSizeChange(val) {
      this.listData.limit = val
      console.log(`每页 ${this.listData.limit} 条`);
      this.getList(this.listData)
    },
    handleCurrentChange(val) {
      this.listData.page = val
      console.log(`当前页: ${this.listData.page}`);
      this.getList(this.listData)
    },

    //更新列表
    getList:function(data){
      this.isLoad = true
      setTimeout(() =>{
        this.isLoad = false
      },800);
      api.request({
        url: "suggest/logs",
        method: "GET",
        data
      }).then(res=>{
        if(res.status == 200){
          this.amount = res.data.data.common.total
          this.tableList = res.data.data.common.data
          Bus.$emit('tableDataChange', this.listData,'2-1-2')//------发送表格参数至operation
          //console.log(res.data.data.common);
        }
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    },

  }
}
</script>