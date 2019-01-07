<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label">新问政待审<span class="amount">428</span></span>
      <Operation :filterOptions="filterOptions1"/>
      <TableOne :tableList="auditList"/>
      <FooterOne/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">追问待审<span class="amount">323</span></span>
      <Operation :filterOptions="filterOptions2" />
      <TableTwo :tableList="auditList"/>
      <FooterTwo/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">回复待审<span class="amount">34</span></span>
      <Operation :filterOptions="filterOptions2" />
      <TableThree :tableList="ListThree"/>
      <FooterThree/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">部门退回待审<span class="amount">21</span></span>
      <OperationFour :filterOptions="filterOptions2" v-on:listenToRadioChange="changeTable"/>
      <TableFour v-if="tabsFourTable == 1" :tableList="ListFour"/>
      <FooterFour v-if="tabsFourTable == 1"/>
      <TableFive v-if="tabsFourTable == 2" :tableList="ListFive"/>
      <FooterFive v-if="tabsFourTable == 2"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Operation from './Operation'
import TableOne from './TableOne'
import FooterOne from './FooterOne'
import TableTwo from './TableTwo'
import FooterTwo from './FooterTwo'
import TableThree from './TableThree'
import FooterThree from './FooterThree'
import OperationFour from './OperationFour'
import TableFour from './TableFour'
import FooterFour from './FooterFour'
import TableFive from './TableFive'
import FooterFive from './FooterFive'

export default {
  name:'Tabs',
  components: { 
    Operation,
    TableOne,
    FooterOne,
    TableTwo,
    FooterTwo,
    TableThree,
    FooterThree,
    OperationFour,
    TableFour,
    FooterFour,
    TableFive,
    FooterFive
  },
  data(){
    return {
      filterOptions1 : [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '撤回待审'
      }],
      filterOptions2 : [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '追问'
      }],
      auditList:[],
      ListThree:[{
        title:"房产局办事效率可以提高吗",
        countdown:"2",
        genre:"咨询",
        region:"武汉",
        recoverytime:"2018-03-10 15:30",
        branch:"房产局"
      }],
      tabsFourTable:"1",
      ListFour:[{
        title:"房产局办事效率可以提高吗",
        countdown:"2",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        recoverytime:"2018-03-10 15:30",
        rejectReason:"找交通局"
      }],
      ListFive:[{
        title:"房产局办事效率可以提高吗",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        recoverytime:"2018-03-10 15:30",
        rejectReason:"找交通局",
        approvalResult:"审核不通过",
        rebutReason:"我是不予处理的原因的详细描述hover显示全部，我还可以显示更多的。"
      },{
        title:"房产局办事效率可以提高吗",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        recoverytime:"2018-03-11 15:30",
        rejectReason:"找交通局",
        approvalResult:"审核通过"
      },{
        title:"房产局办事效率可以提高吗",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        recoverytime:"2018-03-09 15:30",
        rejectReason:"找交通局",
        approvalResult:"审核不通过",
        rebutReason:"我是不予处理的原因的详细描述hover显示全部，我还可以显示更多的。我是不予处理的原因的详细描述hover显示全部，我还可以显示更多的。我是不予处理的原因的详细描述hover显示全部，我还可以显示更多的。我是不予处理的原因的详细描述hover显示全部，我还可以显示更多的。"
      }]
    }
  },
  methods:{
    changeTable:function(value){
      this.tabsFourTable = value
    }
  },
  mounted(){
    this.auditList = [{
      title:"房产局办事效率可以提高吗",
      countdown:"2",
      genre:"咨询",
      region:"武汉",
      branch:"房产局",
      questiontime:"2018-03-10 15:30",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6",
      genre:"建议",
      region:"武汉",
      branch:"交通局",
      questiontime:"2018-03-11 15:30",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4",
      genre:"投诉",
      region:"荆州",
      branch:"情报局",
      questiontime:"2018-02-9 15:30",
      questioner:"崔没没"
    },{
      title:"房产局办事效率可以提高吗",
      countdown:"2",
      genre:"咨询",
      region:"荆州",
      branch:"房产局",
      questiontime:"2018-03-10 15:31",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6",
      genre:"建议",
      region:"宜昌",
      branch:"交通局",
      questiontime:"2018-03-11 15:33",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4",
      genre:"投诉",
      region:"襄阳",
      branch:"情报局",
      questiontime:"2018-02-9 15:40",
      questioner:"崔没没"
    },{
      title:"房产局办事效率可以提高吗",
      countdown:"2",
      genre:"咨询",
      region:"襄阳",
      branch:"房产局",
      questiontime:"2018-03-10 15:20",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6",
      genre:"建议",
      region:"孝感",
      branch:"交通局",
      questiontime:"2018-03-11 15:10",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4",
      genre:"投诉",
      region:"孝感",
      branch:"情报局",
      questiontime:"2018-02-9 15:50",
      questioner:"崔没没"
    }]
  }
}
</script>
<style scoped>

</style>

