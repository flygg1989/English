<template>
  <div class="cryptic">
    <div class="notabs-content" v-loading="isLoad">
      <div class="operation">
        <div class="operation-left">
          <span class="ipt-label">筛选 :</span>
          <el-select v-model="listData.f" placeholder="请选择" @change="fChange">
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="ipt-label">时间段 :</span>
          <el-select v-model="listData.t" placeholder="请选择" @change="tChange">
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            @change="titleChange"
            v-model="listData.title">
          </el-input>
          <el-button type="primary" class="search-btn" @click="titleChange">查询</el-button>
          <el-button type="primary" class="export-table-btn" @click="getTableData" :loading="isExport">导出表格</el-button>
        </div>
      </div>
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
                <div class="title-tab">
                  <span class="is-top">隐藏</span>
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
          prop="statusName"
          label="状态"
          :filter-multiple="false"
          :filters="statusList"
          column-key="statusName"
          width="120">
          <template slot-scope="scope">
            <div>{{scope.row.statusName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="省"
          :filter-multiple="false"
          :filters="provinceList"
          column-key="province"
          width="72">
          <template slot-scope="scope">
            <div>{{scope.row.address[0]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="市"
          :filter-multiple="false"
          :filters="cityList"
          column-key="city"
          width="72">
          <template slot-scope="scope">
            <div :style="scope.row.address[1]?'':'text-align:center;'">{{scope.row.address[1]?scope.row.address[1]:'/'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="区"
          :filter-multiple="false"
          :filters="regionList"
          column-key="region"
          width="72">
          <template slot-scope="scope">
            <div :style="scope.row.address[2]?'':'text-align:center;'">{{scope.row.address[2]?scope.row.address[2]:'/'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="dept_name"
          label="部门"
          :filter-multiple="false"
          :filters="deptList"
          column-key="dept_id"
          width="72">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="提问时间"
          sortable="custom"
          width="144">
          <template slot-scope="scope">
            <div>{{scope.row.created_at.substring(0,scope.row.created_at.length-3)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="回复结果"
          min-width="136">
          <template slot-scope="scope">
            <div @mouseenter="getReason(scope.row)">
              <el-tooltip class="table-tooltip" visible-arrow="" effect="light" :open-delay='num'>
                <div slot="content">{{reason}}</div>
                <el-button type="text" class="hover-btn">部门回复</el-button>
              </el-tooltip>
            </div>
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
        <el-table-column
          prop="cnum"
          label="踩"
          width="56">
        </el-table-column>
        <el-table-column
          prop="znum"
          label="赞"
          min-width="56">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="104">
          <template slot-scope="scope">
            <el-button @click="handleCommand(scope.row)" plain size="mini" type="primary">取消隐藏</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="footer-left">
          <el-button plain type="primary" @click="refresh">刷新</el-button>
          <el-button plain type="primary" @click="hideSelect(1)">取消隐藏</el-button>
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
    <MaskEleven/>
  </div>
</template>
<script>
import api from "@/utils/api";
import Bus from "@/components/common/bus.js";
import domain from '../../../domain.js';
import MaskEleven from '../mask/maskEleven' //平台 已审核已办结 置顶 隐藏 弹窗

export default {
  components: {
    MaskEleven
  },
  data(){
    return {
      isLoad:false,
      num:700,
      isExport : false,
      filterOptions:[{value:'0',label:'全部'},{value:'1',label:'追问'}],
      timeOptions:[{value:'0',label:'全部'},{value:'1',label:'今日'},{value:'2',label:'本周'},{value:'3',label:'本月'},{value:'4',label:'本季度'},{value:'5',label:'本年度'}],
      statusList:[{value:'1',text:'新问政待审'},{value:'2',text:'新问政已审'},{value:'3',text:'追问待审'},{value:'4',text:'追问已审'},{value:'5',text:'回复待审'},{value:'6',text:'回复已审'},{value:'7',text:'退回待审'},{value:'8',text:'退回已审'},{value:'9',text:'退回驳回'},{value:'10',text:'回复驳回'},{value:'11',text:'新问政不予处理'},{value:'12',text:'追问不予处理'},{value:'13',text:'新问政撤销'},{value:'14',text:'已评价'},{value:'15',text:'已办结'},{value:'16',text:'追问撤回'}],
      tableList:[],//------------表格列表
      amount:0,//----------------表格数据总数
      typeList:[],//-------------类型筛选列表
      deptList:[],//-------------部门.......
      provinceList:[],//---------省级列表
      cityList:[],//-------------市.....
      regionList:[],//-----------区.....
      provinceID:0,//------------省ID        
      cityID:0,//----------------市..
      regionID:0,//--------------区..
      batchList:[],//------------已选列表
      listData:{//---------------表格请求参数
        hide:2,
        status:'',
        expand:'attachments',
        type_id:'',
        dept_id:'',
        area:'',
        order:'',
        f:'',
        t:'',
        title:'',
        page:1,
        limit:0
      },
      reason:''
    }
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

    // 省级筛选列表
    api.request({
      url: "province",
      method: "GET"
    }).then(res=>{
      if(res.status == 200){
        let list = res.data.data.common
        for(let i=0;i<list.length;i++){
          let item = {
            text:list[i].name,
            value:list[i].id
          }
          this.provinceList[i] = item
        }
        //console.log(this.provinceList)
      }
    },res => {
      this.$notify.error({
          title: "错误",
          message: "数据请求失败"
        });
    })

    // 部门筛选列表
    api.request({
      url: "dept",
      method: "GET",
      data:{
        limit:0
      }
    }).then(res=>{
      if(res.status == 200){
        let list = res.data.data.common
        for(let i=0;i<list.length;i++){
          let item = {
            text:list[i].dept_name,
            value:list[i].user_id
          }
          this.deptList[i] = item
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
    fChange(){
      this.handleCurrentChange(1)
      
    },
    tChange(){
      this.handleCurrentChange(1)
    },
    titleChange(){
      this.handleCurrentChange(1)
    },
    getTableData(){
      let exportUrl = []
      for (let key in this.listData) {
          let value = this.listData[key]
          exportUrl.push( key + '=' + value)
      }
      exportUrl = "&" + exportUrl.join('&') + '&is_export=1'
      exportUrl = domain.testUrl + 'suggest' + domain.testToken +  exportUrl
      this.isExport = true
      setTimeout(() =>{
        this.isExport = false
      },800);
      console.log(exportUrl);
      window.location = exportUrl
    },
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
      //筛选部门
      if(filters.dept_id){
        if(filters.dept_id.length == 0){
          this.listData.dept_id = ''
        }else{
          this.listData.dept_id = filters.dept_id[0]
        }
        this.handleCurrentChange(1)

      }
      //筛选省
      if(filters.province){
        if(filters.province.length == 0){
          this.provinceID = 0
          this.cityList = []
          this.regionList = []
          this.listData.area = ''
        }else{
          this.provinceID = filters.province[0]
          this.getCityList({
            pid:this.provinceID,
            type:2
          })
          this.listData.area = this.provinceID
        }
        this.$refs.filterTable.clearFilter('city');
        this.$refs.filterTable.clearFilter('region');
        this.handleCurrentChange(1)

      }

      //筛选市
      if(filters.city){
        if(filters.city.length == 0){
          this.cityID = 0
          this.regionList = []
          this.listData.area = this.provinceID
        }else{
          this.cityID = filters.city[0]
          this.getRegionList({
            pid:this.cityID,
            type:3
          })
          this.listData.area = this.provinceID + '|' + this.cityID
        }
        this.$refs.filterTable.clearFilter('region');
        this.handleCurrentChange(1)

      }

      //筛选区
      if(filters.region){
        if(filters.region.length == 0){
          this.regionID = 0
          if(this.cityID == 0){
            this.listData.area = this.provinceID
          }else{
            this.listData.area = this.provinceID + '|' + this.cityID
          }
        }else{
          this.regionID = filters.region[0]
          this.listData.area = this.provinceID + '|' + this.cityID + '|' + this.regionID
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

      //筛选状态
      if(filters.statusName){
        if(filters.statusName.length == 0){
          this.listData.status = ''
        }else{
          this.listData.status = filters.statusName[0]
        }
        this.handleCurrentChange(1)
      }

    },
    //---      排序函数      ----//
    sortChange(value){
      
      //按提问时间排序
      if(value.prop == "created_at"){{
        if(value.order == 'ascending'){
          this.listData.order = 'id asc'
        }else if(value.order == 'descending'){
          this.listData.order = 'id desc'
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
    
    //获取回复结果
    getReason(row){
      api.request({
        url: "suggest/detail",
        method: "GET",
        data:{
          id:row.id,
          expand:'replyList,chaseList.replyList'
        }
      }).then(res=>{
        if(res.status == 200){
          // console.log(res.data.data.common);
          // console.log(res.data.data.common.reply_list);
          if(res.data.data.common.chase_list && res.data.data.common.chase_list.reply_list.length > 0 ){
            this.reason = res.data.data.common.chase_list.reply_list[0].reply
          }else if(res.data.data.common.reply_list && res.data.data.common.reply_list.length > 0){
            this.reason = res.data.data.common.reply_list[0].reply
          }else{
            this.reason = '暂无部门回复该问题'
          }
        }
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    },
    //获取更多操作信息
    handleCommand(command) {
      console.log(command);
      if(command.is_pub==1){
        api.request({
          url: "suggest/hide",
          method: "GET",
          data:{
            id:command.id,
            is_top:'1'
          }
        }).then(res=>{
          if(res.status == 200){
            //console.log(res)
            if(res.data.state == false){
              this.$notify.error({
                title: "错误",
                message: res.data.message
              });
            }
            this.handleCurrentChange(1)
          }
        },res => {
          this.$notify.error({
              title: "错误",
              message: "数据请求失败"
            });
        })
      }else{
        this.$notify.error({
            title: "错误",
            message:"用户非公开的问政不能取消隐藏"
        });
      }
    },

    //多选
    batchOperation(selection){
      this.batchList = selection
    },
    //批量取消
    hideSelect(value){
      let ids = ''
      if(this.batchList.length == 0){
        this.$notify.error({
          title: "错误",
          message: "请先勾选要操作的问题"
        });
      }else{
        for (let i = 0; i < this.batchList.length; i++) {
          let item = this.batchList[i].id;
          if(ids == ''){
            ids = item
          }else{
            ids += ',' + item
          }
        }
        api.request({
          url: "suggest/all/hide",
          method: "GET",
          data:{
            ids,
            is_show:value
          }
        }).then(res=>{
          if(res.status == 200){
            //console.log(res.data.message)
            if(res.data.state == false){
              this.$notify.error({
                title: "错误",
                message: res.data.message
              });
            }
            this.handleCurrentChange(1)
          }
        },res => {
          this.$notify.error({
              title: "错误",
              message: "数据请求失败"
            });
        })
      }
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
    },
    //更新市级筛选列表
    getCityList:function(data){
      api.request({
        url: "province",
        method: "GET",
        data
      }).then(res=>{
        if(res.status == 200){
          let list = res.data.data.common
          this.cityList = []
          for(let i=0;i<list.length;i++){
            let item = {
              text:list[i].name,
              value:list[i].id
            }
            this.cityList[i] = item
          }
          //console.log(this.cityList)
        }
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    },
    //更新区级筛选列表
    getRegionList:function(data){
      api.request({
        url: "province",
        method: "GET",
        data
      }).then(res=>{
        if(res.status == 200){
          let list = res.data.data.common
          this.regionList = []
          for(let i=0;i<list.length;i++){
            let item = {
              text:list[i].name,
              value:list[i].id
            }
            this.regionList[i] = item
          }
          console.log(this.regionList)
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
<style>
.cryptic{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
</style>