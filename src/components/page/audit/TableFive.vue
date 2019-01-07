<template>
  <el-table
    :data="tableList"
    height="100%"
    empty-text="没有更多数据了"
    header-row-class-name="table-header"
    style="width:100%;">
    <el-table-column
      type="selection"
      width="32">
    </el-table-column>
    <el-table-column
      fixed
      prop="title"
      label="标题"
      width="320">
    </el-table-column>
    <el-table-column
      prop="genre"
      label="类型"
      :filters="[{text:'咨询',value:'咨询'},{text:'建议',value:'建议'},{text:'投诉',value:'投诉'}]"
      :filter-method="filterHandler"
      width="72">
    </el-table-column>
    <el-table-column
      prop="region"
      label="地域"
      :filters="[{text:'武汉',value:'武汉'},{text:'荆州',value:'荆州'},{text:'宜昌',value:'宜昌'},{text:'襄阳',value:'襄阳'},{text:'孝感',value:'孝感'},{text:'恩施',value:'恩施'}]"
      :filter-method="filterHandler"
      width="72">
    </el-table-column>
    <el-table-column
      prop="branch"
      label="部门"
      :filters="[{text:'房产局',value:'房产局'},{text:'交通局',value:'交通局'},{text:'情报局',value:'情报局'},{text:'警察局',value:'警察局'},{text:'城管局',value:'城管局'},{text:'消防局',value:'消防局'}]"
      :filter-method="filterHandler"
      width="72">
    </el-table-column>
    <el-table-column
      prop="recoverytime"
      label="审核时间"
      sortable
      width="144">
    </el-table-column>
    <el-table-column
      prop="rejectReason"
      label="退回原因"
      width="104">
    </el-table-column>
    <el-table-column
      prop="approvalResult"
      label="审批结果"
      :filters="[{text:'审核通过',value:'审核通过'},{text:'审核不通过',value:'审核不通过'}]"
      :filter-method="filterHandler"
      width="144">
      <template slot-scope="scope">
        <span :class="scope.row.approvalResult == '审核不通过'?'font-red':''">{{ scope.row.approvalResult }}</span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="驳回原因"
      width="184">
      <template slot-scope="scope">
        <el-tooltip class="table-tooltip" visible-arrow="" effect="light" v-if="scope.row.rebutReason">
        <div slot="content">{{scope.row.rebutReason}}</div>
        <el-button type="text">驳回原因</el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:"TableFive",
  props:{
    tableList:{
      type: Array,
      required: true,
      default:()=>{
        return []
      }
    }
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick(row) {
      console.log(row);
    }
  }
}
</script>