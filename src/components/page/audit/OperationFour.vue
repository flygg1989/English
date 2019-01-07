<template>
  <div class="operation">
    <div class="operation-left">
      <span class="ipt-label">筛选 :</span>
      <el-select v-model="filterValue" placeholder="请选择">
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="ipt-label">时间段 :</span>
      <el-select v-model="timeValue" placeholder="请选择">
        <el-option
          v-for="item in timeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="operation-center">
      <el-radio v-model="radio" label="1" @change="radioChange">待审</el-radio>
      <el-radio v-model="radio" label="2" @change="radioChange">退回审批记录</el-radio>
    </div>
    <div class="operation-right">
      <el-input
        class="search-ipt"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="searchValue">
      </el-input>
      <el-button type="primary" class="search-btn">查询</el-button>
      <el-button type="primary">导出列表</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'OperationFour',
  props:{
    filterOptions:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      filterValue: '',
      timeOptions: [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '今日'
      }, {
        value: '选项3',
        label: '本周'
      }, {
        value: '选项4',
        label: '本月'
      }],
      timeValue:'',
      searchValue:'',
      radio:'1'
    }
  },
  methods:{
    radioChange:function(value){
      this.$emit("listenToRadioChange",value)
    }
  }
}
</script>
<style scoped>
.operation{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height:56px;
}
  .operation-right{
    display: flex;
    align-items: center;
  }
</style>

