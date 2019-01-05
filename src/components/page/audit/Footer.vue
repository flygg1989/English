<template>
  <div class="footer">
      <div class="footer-left">
        <el-button>刷新</el-button>
        <el-button>转办</el-button>
        <el-button>不予处理</el-button>
      </div>
      <div class="footer-center">
            <el-button>置顶</el-button>
            <el-button>隐藏</el-button>
      </div>
      <div class="footer-right">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="100">
            </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name:'Footer',
}
</script>
<style scoped>
    .footer{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .footer-right{
         display: flex;
    }
</style>