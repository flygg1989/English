<template>
  <div class="table-footer">
    <div class="footer-left">
      <el-button plain type="primary">刷新</el-button>
      <el-button plain type="primary">通过</el-button>
      <el-button plain type="primary">驳回</el-button>
    </div>
    <div class="footer-center">
      <el-button>置顶</el-button>
      <el-button>隐藏</el-button>
    </div>
    <div class="footer-right">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="sizes, prev, pager, next"
        :total="100">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name:'FooterThree',
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  data() {
    return {
      currentPage:1
    };
  }
}
</script>
<style scoped>
  
</style>