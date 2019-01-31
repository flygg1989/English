<template>
  <div class="usermanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入要查询的手机号或昵称"
            prefix-icon="el-icon-search"
            v-model="searchValue">
          </el-input>
          <el-button type="primary" @click="handleSreach" class="search-btn">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        height="100%"
        empty-text="没有更多数据了"
        header-row-class-name="table-header"

        style="width:100%;">
        <el-table-column

        >
        </el-table-column>
        <el-table-column
          fixed
          prop="m_id"
          label="用户ID"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="lastlogin_time"
          label="最后登陆时间"

          min-width="144">
        </el-table-column>
        <el-table-column
          prop="day_suggest_count"
          label="已提问数"
          min-width="144">
        </el-table-column>
        <el-table-column
          prop="todayleft"
          label="今日提问剩余次数"
          min-width="160">
          <template slot-scope="scope">
          <div>
            {{scope.row.suggest_count-scope.row.day_suggest_count}}
          </div>
        </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        min-width="100">
        <template slot-scope="scope">
          <div class="table2-2">
            <el-switch
              :value="scope.row.status==2?true:false"
              inactive-text="屏蔽开关"
              active-color="#3CD970"
              @change="switchList(scope.row)"
              inactive-color="#DFE5EB">

            </el-switch>
          </div>
        </template>
      </el-table-column>
      </el-table>
      <div class="table-footer">
        <!--<div class="footer-left">-->
          <!--<el-button plain type="primary">刷新</el-button>-->
          <!--<el-button plain type="primary" @click="handleShield">屏蔽</el-button>-->
          <!--<el-button plain type="primary">取消屏蔽</el-button>-->
        <!--</div>-->
        <div class="footer-right">
          <el-pagination
            background
            v-show="tableList.length!==0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import api from '@/utils/api'
    const memberList ='member'
    const changMeberStaut='member/save'
export default {
  data(){
    return {
      searchValue:"",
      tableList:[],
      currentPage:1,
      selectList:[],
      total:0,
      pageSize:5
    }
  },
  methods: {
      async getSreach(){
          try{
              let res =  await api.request({
                  url:memberList,
                  method:'GET',
                  data:{
                      wd:this.searchValue
                  }
              });
              this.tableList=res.data.data.common.data
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
      handleSreach(){
          this.searchValue? this.getSreach():this.$notify.error({
              title: "错误",
              message: "请输入关键字"
          })
      },


      // handleSelectionChange(val){
      //     this.switchList=val
      //     console.log(this.switchList)
      // },
      //列表切换
      async switchList(item){
          item.status==1?item.status=2:item.status=1
          try{
              let postTime = await api.request({
                  url:changMeberStaut,
                  method:'GET',
                    data:{
                      id:item.m_id
                    }
              });
              this.$notify({
                  title: "成功",
                  message: "用户屏蔽切换成功",
                  type: 'success'
              });
              this.initList()
          }catch (e) {
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
      //初始化
      async initList(page,limit){
          console.log('init')
          try{
              let get = await api.request({
                  url:memberList,
                  method:'GET',
                  data:{
                      page:page,
                      limit: limit,
                  }
              })
              let arr=get.data.data.common.data
              this.tableList=arr
              this.total=get.data.data.common.total;
              console.log(  this.tableList)
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
    async handleClick(row) {

    },
      //每页数量
    async handleSizeChange(val) {
        this.pageSize=val
        this.currentPage=1
      this.initList(this.currentPage,this.pageSize)

    },
      //当前选择页
    async handleCurrentChange(val) {

        this.initList(val,this.pageSize)
    }
  },
  mounted(){
    this.initList(this.currentPage,this.pageSize)
  }
}
</script>
<style>
.usermanagement{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
.usermanagement .operation{
  justify-content:flex-end;
}
</style>
