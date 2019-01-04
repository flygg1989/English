<template>
  <el-table
    :data="tableList"
    height="100%"
    style="width:100%;">
    <el-table-column
      type="selection"
      width="32">
    </el-table-column>
    <el-table-column
      v-for="(item,index) in tableLabel"
      :key="index"
      :fixed="item.prop == 'title'"
      :prop="item.prop"
      :label="item.label"
      :width="item.width">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="168">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:"Table",
  props:{
    tableList:{
      type: Array,
      required: true,
      default:()=>{
        return []
      }
    },
    tableLabel:{
      type: Array,
      required: true,
      default:()=>{
        return []
      }
    }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
  }
}
</script>

