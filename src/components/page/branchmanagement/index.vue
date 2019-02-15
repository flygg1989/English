<template>
  <div class="branchmanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" class="creat-branch-btn"
                     @click="handleClick('新建部门')">新建部门</el-button>
        </div>
        <div class="operation-right">
          <el-input
            class="search-ipt"
            placeholder="请输入要查询的部门名称"
            prefix-icon="el-icon-search"
            v-model="searchValue">
          </el-input>
          <el-button type="primary" class="search-btn" @click="handleSreach">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableList"
        height="100%"
        empty-text="没有更多数据了"
        header-row-class-name="table-header"
        @sort-change="sortChange"
        style="width:100%;">

        <el-table-column
          fixed
          prop="dept_name"
          label="部门名称"
          min-width="7.25%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          min-width="10.87%">
        </el-table-column>
        <el-table-column
          prop="uname"
          label="责任人"
          min-width="7.25%">
        </el-table-column>
        <el-table-column
          prop="email"
          label="账号"
          min-width="14.49%">
        </el-table-column>
        <el-table-column
          prop="dep_type.type_name"
          label="部门分类"
          min-width="7.25%">
        </el-table-column>
        <el-table-column
          prop="address"
          label="行政级别"
          min-width="14.49%">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          sortable
          min-width="14.49%">
            <template slot-scope="scope">
                <div>{{scope.row.created_at.substring(0,scope.row.created_at.length-3)}}</div>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="232">
          <template slot-scope="scope">
            <div class="table2-2">
              <el-button @click="handleClick(scope.row)" plain size="mini" type="primary">修改</el-button>
              <el-switch
                :value="scope.row.status==2?true:false"
                @change="switchList(scope.row)"
                inactive-text="启用开关"
                active-color="#3CD970"
                inactive-color="#DFE5EB">
              </el-switch>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="footer-left">
        </div>
        <div class="footer-right">
          <el-pagination
            background
            v-show="tableList.length!==0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next"
            :total="total"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
          >
          </el-pagination>
        </div>
      </div>
    </div>

        <CreateDepartment/>

  </div>

</template>
<script>
import api from '@/utils/api'
import Bus from "@/components/common/bus.js";
const deptList = 'dept'
const ChangeDeptStaut = 'dept/status'
import CreateDepartment from '../mask/CreateDepartment' //创建部门 弹窗

export default {

  data(){
    return {
      searchValue:'',
      tableList:[],
      currentPage:1,
        total:0,
        pageSize:5,
      dialogFormVisible: false,
        form:{
            name:'',
            region:''
        },
        pagenum:1, //当前页数
    }
  },
  components: {
    CreateDepartment
  },
  methods: {
      async sortChange(val){
          console.log(val.order)
          let order=''
          if(val.prop == "created_at"){{
              if(val.order == 'ascending'){
                  order = 'user_id asc'
              }else if(val.order == 'descending'){
                  order = 'user_id desc'
              }
          }}
          console.log(order)
          try{
              let postTime = await api.request({
                  url:deptList,
                  method:'GET',
                  data:{
                      order:order,
                      limit:this.pageSize
                  }
              })
              let arr=postTime.data.data.common.data
              this.tableList=arr
              this.total=postTime.data.data.common.total;
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
     async getSreach(){
         try{
           let res =  await api.request({
                 url:deptList,
                 method:'GET',
                 data:{
                     dept_name:this.searchValue
                 }
             });
            this.tableList=res.data.data.common.data
             console.log(this.tableList)
         }catch (e) {
             console.log(e)
             this.$notify.error({
                 title: "错误",
                 message: "数据请求失败"
             })
         }
      },
    handleSreach(){
        this.getSreach()
      },
      async switchList(item){
          item.status==1?item.status=2:item.status=1
          try{
              await api.request({
                  url:ChangeDeptStaut,
                  method:'GET',
                  data:{
                      id:item.user_id
                  }
              });
              this.$notify({
                  title: "成功",
                  message: "用户屏蔽切换成功",
                  type: 'success'
              });
              this.initList()
          }catch (e) {
              console.log(e)
              this.$notify.error({
                  title: "错误",
                  message: "数据请求失败"
              })
          }
      },
      async initList(page,limit){
          try{
              let postTime = await api.request({
                  url:deptList,
                  method:'GET',
                  data:{
                      page:page,
                      limit: limit,
                  }
              })
              let arr=postTime.data.data.common.data
              this.tableList=arr
              this.total=postTime.data.data.common.total;
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
      //每页数量
      async handleSizeChange(val) {
          this.pageSize=val
          this.currentPage=1
          this.initList(this.currentPage,this.pageSize)
      },

      //当前选择页
      async handleCurrentChange(val) {
          console.log(val)
          this.pagenum = val;
          this.initList(val,this.pageSize)
      },

      //创建部门
      handleClick(value){
          var state =true;
          Bus.$emit('sendstate', {state,value})//-------发送信息到弹窗组件
      },
  },
  mounted(){
      this.initList(this.currentPage,this.pageSize)
      //监听弹窗成功操作单条数据事件
    Bus.$on('detailChange',(data) => {
      if(data == true){
        this.currentPage = this.pagenum ;
        this.initList(this.currentPage,this.pageSize)
      }
    })
  }
}
</script>
<style>

.branchmanagement{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:8px 16px 0 16px;
}
</style>

