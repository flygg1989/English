<template>
  <div class="tabs-content" v-loading="isLoad">
    <el-table
      :data="tableList"
      height="100%"
      empty-text="没有更多数据了"
      header-row-class-name="table-header"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @selection-change="batchOperation"
      ref="filterTable"
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
            <div v-if="scope.row.attachments.length > 0" class="title-right">
              <img src="static/img/icon-photo.png">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="expire_time"
        label="剩余时间"
        sortable
        width="120">
        <template slot-scope="scope">
          <div :class="scope.row.expire_time <= warningTime?'font-red':''">{{ scope.row.expire_time }}小时</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sug_type"
        label="类型"
        :filter-multiple="false"
        :filters="typeList"
        column-key="sug_type"
        width="80">
        <template slot-scope="scope">
          <div>{{scope.row.sug_type.type_name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="评价时间"
        sortable="custom"
        width="144">
        <template slot-scope="scope">
          <div>{{scope.row.updated_at.substring(0,scope.row.updated_at.length-3)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="scope_type"
        label="评价类型"
        :filter-multiple="false"
        :filters="[{text:'用户评价',value:'1'},{text:'自动评价',value:'2'}]"
        column-key="scope_type"
        width="104">
        <template slot-scope="scope">
          <div>{{scope.row.scope_type == '1' && scope.row.scope_type != '2'?'用户评价':'自动评价'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="scope"
        label="评价结果"
        :filter-multiple="false"
        :filters="[{text:'非常不满意 ',value:'1'},{text:'不满意',value:'2'},{text:'一般',value:'3'},{text:'比较满意',value:'4'},{text:'非常满意',value:'5'}]"
        column-key="scope"
        min-width="104">
        <template slot-scope="scope">
          <div v-if="scope.row.scope == '1'">非常不满意</div>
          <div v-if="scope.row.scope == '2'">不满意</div>
          <div v-if="scope.row.scope == '3'">一般</div>
          <div v-if="scope.row.scope == '4'">比较满意</div>
          <div v-if="scope.row.scope == '5'">非常满意</div>
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
  name:"TableThree",
  data() {
    return {
      isLoad:false,
      tableList:[],//------------表格列表
      amount:0,//----------------表格数据总数
      warningTime:2,//-----------红字预警时间
      typeList:[],//-------------类型筛选列表
      batchList:[],//------------已选列表
      listData:{//---------------表格请求参数
        status:'g',
        expand:'attachments',
        type_id:'',
        order:'',
        f:'',
        t:'',
        title:'',
        page:1,
        limit:0,
        scope_type:'',
        scope:'',
      }
    };
  },
  created(){
    this.getList(this.listData)
    // 类型筛选列表
    api.request({
      url: "suggest/category",
      method: "GET"
    }).then(res=>{
      if(res.status == 200){
        let list = res.data.data.common
        for(let i=0;i<list.length;i++){
          let item = {
            text:list[i].type_name,
            value:list[i].id
          }
          this.typeList[i] = item
        }
      }
    },res => {
      this.$notify.error({
          title: "错误",
          message: "数据请求失败"
        });
    })
  },
  mounted(){
    //监听operation组件筛选/搜索值
    Bus.$on('operationDataChange', (data) => {
      this.listData.f = data.filterValue
      this.listData.t = data.timeValue
      this.listData.title = data.searchValue
      this.getList(this.listData)
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
    //更新剩余时间预警时间（文字标红）
    api.request({
      url: "setting",
      method: "GET"
    }).then(res=>{
      if(res.status == 200){
        this.warningTime = res.data.data.common.sug_early_warning_time.cvalue
      }
    },res => {
      this.$notify.error({
          title: "错误",
          message: "数据请求失败"
        });
    })
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
    //---      筛选函数      ----//
    filterChange(filters){
      //筛选类型
      if(filters.sug_type){
        if(filters.sug_type.length == 0){
          this.listData.type_id = ''
        }else{
          this.listData.type_id = filters.sug_type[0]
        }
        this.handleCurrentChange(1)

      }
      
      //筛选评价类型
      if(filters.scope_type){
        if(filters.scope_type.length == 0){
          this.listData.scope_type = ''
        }else{
          this.listData.scope_type = filters.scope_type[0]
        }
        this.handleCurrentChange(1)
      }
      //筛选评价结果
      if(filters.scope){
        if(filters.scope.length == 0){
          this.listData.scope = ''
        }else{
          this.listData.scope = filters.scope[0]
        }
        this.handleCurrentChange(1)
      }
    },

    //---      排序函数      ----//
    sortChange(value){
      //按评价时间排序
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
        url: "suggest",
        method: "GET",
        data
      }).then(res=>{
        if(res.status == 200){
          this.amount = res.data.data.common.total
          this.tableList = res.data.data.common.data
          Bus.$emit('tableDataChange', this.listData)//------发送表格参数至operation
          //console.log(res.data.data.common);
        }
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    }
  }
}
</script>