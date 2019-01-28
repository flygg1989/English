<template>
  <div class="operation">
    <div class="operation-left">
      <span class="ipt-label">筛选 :</span>
      <el-select v-model="operationData.filterValue" placeholder="请选择" @change="operationDataChange">
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="ipt-label">时间段 :</span>
      <el-select v-model="operationData.timeValue" placeholder="请选择" @change="operationDataChange">
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
        @change="operationDataChange"
        v-model="operationData.searchValue">
      </el-input>
      <el-button type="primary" class="search-btn" @click="operationDataChange">查询</el-button>
      <el-button type="primary" class="export-table-btn" @click="getTableData" :loading="isExport">导出表格</el-button>
    </div>
  </div>
</template>
<script>
import Bus from "@/components/common/bus.js";
import domain from '../../../domain.js';

export default {
  name:'Operation',
  props:{
    filterOptions:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      timeOptions: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '今日'
      }, {
        value: '2',
        label: '本周'
      }, {
        value: '3',
        label: '本月'
      }],
      isExport : false,
      operationData:{
        filterValue:'',
        timeValue:'',
        searchValue:''
      },
      tableData:{}
    }
  },
  methods:{

    //发送 筛选/搜索值 至table
    operationDataChange: function () {
      Bus.$emit('operationDataChange', this.operationData)
    },
    getTableData(){
      let exportUrl = []
      for (let key in this.tableData) {
          let value = this.tableData[key]
          exportUrl.push( key + '=' + value)
      }
      
      exportUrl = "&" + exportUrl.join('&') + '&is_export=1'
      exportUrl = domain.testUrl +'suggest' + domain.testToken +  exportUrl
      this.isExport = true
      setTimeout(() =>{
        this.isExport = false
      },800);
      console.log(exportUrl);
      window.location = exportUrl
    }
  },
  beforeUpdate(){
    
  },
  mounted(){

    //获取table组件所带参数
        Bus.$on('tableDataChange', (data) => {
          this.tableData = data
        })


  }
}
</script>

