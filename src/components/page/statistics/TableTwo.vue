<template>
  <div class="tabs-content">
    <el-table
      :data="tableList"
      height="100%"
      empty-text="没有更多数据了"
      header-row-class-name="table-header"
      style="width:100%;">
      <el-table-column
        prop="deptName"
        label="部门名称"
        min-width="320">
        <template slot-scope="scope">
          <div class="branch-name">
            <div v-if="(currentPage-1) * currentSize + scope.$index + 1 == 1" class="bg-1">{{ (currentPage-1) * currentSize + scope.$index + 1 }}</div>
            <div v-if="(currentPage-1) * currentSize + scope.$index + 1 == 2" class="bg-2">{{ (currentPage-1) * currentSize + scope.$index + 1 }}</div>
            <div v-if="(currentPage-1) * currentSize + scope.$index + 1 == 3" class="bg-3">{{ (currentPage-1) * currentSize + scope.$index + 1 }}</div>
            <div v-if="(currentPage-1) * currentSize + scope.$index + 1 > 3">{{ (currentPage-1) * currentSize + scope.$index + 1 }}</div>
            <span>{{scope.row.deptName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="transferNum"
        label="转办数"
        min-width="144">
      </el-table-column>
      <el-table-column
        prop="acceptNum"
        label="受理数"
        min-width="144">
      </el-table-column>
      <el-table-column
        prop="replyNum"
        label="满意数"
        min-width="144">
      </el-table-column>
      <el-table-column
        prop="replyRate"
        label="满意度"
        min-width="144">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="footer-right">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="sizes, prev, pager, next"
          :total="total"
          :page-sizes="[5, 10, 15 ,20]"
          :page-size="currentSize"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
    import api from '@/utils/api'
    const url='politics/getCount'

export default {
  name:"TableTwo",
  props:{
      selectTime:{
          type: Array,
      }
  },
  data() {
    return {
        tableList:[],
        currentPage:1,
        total:0,
        currentSize:10,
    };
  },

  methods: {
      async initList(page,limit){ //当前页，一页数量
          try{
              let postTime = await api.request({
                  url:url,
                  method:'post',
                  data:{
                      date_type:2,
                      current_page:page,
                      per_page_count: limit,
                  }
              })
              let arr=postTime.data.data.common.data
              this.tableList=arr
              this.total=postTime.data.data.common.page_param.all_page_count;
          }catch (e) {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },

    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick(row) {
      console.log(row);
    },
      //每页数量
      async handleSizeChange(val) {
          this.currentSize=val
          this.currentPage=1

          this.initList(this.currentPage,val)

      },
      //当前选择页
      async handleCurrentChange(val) {
          this.currentPage=val
          this.initList(val,this.currentSize)
      }
  },
   mounted(){
       this.initList(this.currentPage,this.currentSize)
   },
    watch:{
        async selectTime(val){
            console.log(val)
            let postTime = await api.request({
                url:url,
                method:'post',
                data:{
                    date_type:2,
                    start_time:val[0],
                    end_time:val[1],
                    current_page:this.currentPage,
                    per_page_count: this.currentSize,
                }
            })
            let arr=postTime.data.data.common.data
            this.tableList=arr
            console.log(this.tableList)
        }
    }
}
</script>
<style scoped>
.table-footer{
  justify-content:flex-end;
}
</style>
