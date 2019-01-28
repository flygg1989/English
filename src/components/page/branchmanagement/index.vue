<template>
  <div class="branchmanagement">
    <div class="notabs-content">
      <div class="operation">
        <div class="operation-left">
          <el-button type="primary" class="creat-branch-btn" @click="handleClick">新建部门</el-button>
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
          <!--<template slot-scope="scope">-->
            <!--&lt;!&ndash;{{scope.row.personliable.charAt(0)+'**'}}&ndash;&gt;-->
          <!--</template>-->
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
          <!--<el-button plain type="primary">刷新</el-button>-->
          <!--<el-button plain type="primary">启用</el-button>-->
          <!--<el-button plain type="primary">停用</el-button>-->
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
      <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
          <!--<el-form :model="form" label-width="100px">-->
              <!--<el-form-item label="部门名称">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="责任人">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="手机号">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="邮箱">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="选部分分类">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="选行政级别">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="默认密码">-->
                  <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
                  <!--<el-upload-->
                      <!--width="80%"-->
                      <!--class="upload-box"-->
                      <!--:action='url'-->
                      <!--:show-file-list="false"-->
                      <!--:on-success="handleAvatarSuccess"-->
                      <!--:before-upload="beforeAvatarUpload">-->
                      <!--<div class="box-inline">-->
                          <!--<img src="static/img/icon-photo.png">-->
                          <!--<div class="el-upload__text">点击上传部门头像</div>-->
                      <!--</div>-->
                  <!--</el-upload>-->

          <!--</el-form>-->
          <!--<div slot="footer" class="dialog-footer">-->
              <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
              <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
          <!--</div>-->
      <!--</el-dialog>-->
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
        }
    }
  },
  components: {
    CreateDepartment
  },
  methods: {
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
        this.searchValue? this.getSreach():this.$notify.error({
            title: "错误",
            message: "请输入关键字"
        })
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
    handleClick(row) {
      console.log(row);
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
      },

      //创建部门
      handleClick(){
          var state =true;
          Bus.$emit('sendstate', state)//-------发送信息到弹窗组件
      },
  },
  mounted(){
      this.initList(this.currentPage,this.pageSize)
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
