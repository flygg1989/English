<template>
  <div class="footer">
      <div class="footer-left">
        <el-button >刷新</el-button>
        <el-button >转办</el-button>
        <el-button >不予处理</el-button>
      </div>
      <div class="footer-center">
            <el-button >隐藏</el-button>
            <el-button >隐藏</el-button>
      </div>
      <div class="footer-right">
            每页<el-input class="input__inner"></el-input>条 
            <el-pagination
                background
                layout="prev, pager, next"
                :pager-count="2"
                :total="1000">
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
    .input__inner{
        width: 20px;
        height: 20px;
        font-size: 12px;
    }
    .input__inner input{
        padding: 0;
    }
</style>