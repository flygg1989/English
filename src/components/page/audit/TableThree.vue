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
      prop="countdown"
      label="剩余时间"
      sortable
      width="120">
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
      prop="recoverytime"
      label="回复时间"
      sortable
      width="144">
    </el-table-column>
    <el-table-column
      prop="branch"
      label="回复部门"
      :filters="[{text:'房产局',value:'房产局'},{text:'交通局',value:'交通局'},{text:'情报局',value:'情报局'},{text:'警察局',value:'警察局'},{text:'城管局',value:'城管局'},{text:'消防局',value:'消防局'}]"
      :filter-method="filterHandler"
      width="104">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="216">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" plain size="mini" type="primary">通过</el-button>
        <el-button @click="handleClick(scope.row)" plain size="mini" type="primary">修改</el-button>
        <el-button @click="handleClick(scope.row)" plain size="mini" type="primary">驳回</el-button>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i @click="handleClick(scope.row)" class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>隐藏</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:"TableThree",
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