<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label">部门待回复<span class="amount">428</span></span>
      <Operation :filterOptions="filterOptions"/>
      <TableOne :tableList="auditList"/>
      <FooterOne/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已回复<span class="amount">323</span></span>
      <Operation :filterOptions="filterOptions" />
      <TableTwo :tableList="ListTwo"/>
      <FooterTwo/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已评价<span class="amount">34</span></span>
      <Operation :filterOptions="filterOptions" />
      <TableThree :tableList="ListThree"/>
      <FooterThree/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已办结<span class="amount">21</span></span>
      <Operation :filterOptions="filterOptions" />
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
// import TableFour from './TableFour'
// import FooterFour from './FooterFour'

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
    // TableFour,
    // FooterFour,
  },
  data(){
    return {
      filterOptions : [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '追问'
      }],
      auditList:[],
      ListTwo:[{
        title:"房产局办事效率可以提高吗",
        countdown:"2",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        recoverytime:"2018-03-10 15:30"
      }],
      ListThree:[{
        title:"房产局办事效率可以提高吗",
        countdown:"2",
        genre:"咨询",
        region:"武汉",
        branch:"房产局",
        evaluatetime:"2018-03-10 15:30",
        evaluatetype:"用户评价",
        evaluateresult:"基本满意"
      }],
      ListFour:[{
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