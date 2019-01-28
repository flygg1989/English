<template>
  <div class="refuse-to-handle">
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
          prop="updated_at"
          label="审核时间"
          sortable="custom"
          width="144">
          <template slot-scope="scope">
            <div>{{scope.row.updated_at.substring(0,scope.row.updated_at.length-3)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="不予处理原因"
          min-width="136">
          <template slot-scope="scope">
            <div class="table-tooltip-box" @mouseenter="getReason(scope.row)">
              <el-tooltip class="table-tooltip" visible-arrow="" effect="light" :open-delay='num'>
                <div slot="content">{{reason}}</div>
                <el-button type="text" class="hover-btn">不予处理原因</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="56">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.is_show != '2' && scope.row.is_chase == '1'" :command="{type:'top',id:scope.row.id,is_top:scope.row.is_top == '2'? '1':'2'}">{{scope.row.is_top == '2'?'取消置顶':'置顶'}}</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.is_top != '2'" :command="{type:'hide',id:scope.row.id,is_show:scope.row.is_show == '2'? '1':'2'}">{{scope.row.is_show == '2'?'取消隐藏':'隐藏'}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="footer-left">
          <el-button plain type="primary">刷新</el-button>
          <el-button plain type="primary" @click="topSelect(2)" v-if="this.listData.f == '1'">置顶</el-button>
          <el-button plain type="primary" @click="topSelect(1)" v-if="this.listData.f == '1'">取消置顶</el-button>
          <el-button plain type="primary" @click="hideSelect(2)">隐藏</el-button>
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
    <MaskTen/>
  </div>
</template>
<script>
import api from "@/utils/api";
import Bus from "@/components/common/bus.js";
import domain from '../../../domain.js';
import MaskTen from '../mask/maskTen' //平台 不予处理 弹窗

export default {
  components: { 
    MaskTen
  },
  data(){
    return {
      isLoad:false,
      num:700,
      isExport : false,
      filterOptions:[{value:'0',label:'全部'},{value:'1',label:'追问'}],
      timeOptions:[{value:'0',label:'全部'},{value:'1',label:'今日'},{value:'2',label:'本周'},{value:'3',label:'本月'},{value:'4',label:'本季度'},{value:'5',label:'本年度'}],
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
        status:'i',
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
    //获取不予处理原因内容
    getReason(row){
      api.request({
        url: "suggest/log",
        method: "GET",
        data:{
          id:row.id
        }
      }).then(res=>{
        if(res.status == 200){
            this.reason = res.data.data.common.reason
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

      //根据command.id隐藏单条数据
      if(command.type == 'hide'){
        api.request({
          url: "suggest/hide",
          method: "GET",
          data:{
            id:command.id,
            is_show:command.is_show
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
            this.handleCurrentChange(this.listData.page)
          }
        },res => {
          this.$notify.error({
              title: "错误",
              message: "数据请求失败"
            });
        })
      }

      //根据command.id置顶单条数据
      if(command.type == 'top'){
        api.request({
          url: "suggest/top",
          method: "GET",
          data:{
            id:command.id,
            is_top:command.is_top
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
            this.handleCurrentChange(this.listData.page)
          }
        },res => {
          this.$notify.error({
              title: "错误",
              message: "数据请求失败"
            });
        })
      }


    },

    //多选
    batchOperation(selection){
      this.batchList = selection
    },
    //批量隐藏/取消隐藏
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
            //console.log(res)
            if(res.data.state == false){
              this.$notify.error({
                title: "错误",
                message: res.data.message
              });
            }
            this.handleCurrentChange(this.listData.page)
          }
        },res => {
          this.$notify.error({
              title: "错误",
              message: "数据请求失败"
            });
        })
      }
    },

    topSelect(value){
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
          url: "suggest/all/top",
          method: "GET",
          data:{
            ids,
            is_top:value
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
            this.handleCurrentChange(this.listData.page)
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
.refuse-to-handle{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
</style>