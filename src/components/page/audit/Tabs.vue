<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label">新问政待审<span class="amount">428</span></span>
      <Operation :filterOptions="filterOptions1"/>
      <Tableone :tableList="auditList"/>
      <Footer />
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">追问待审<span class="amount">323</span></span>
      <Operation :filterOptions="filterOptions2" />
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">回复待审<span class="amount">34</span></span>
      <Operation :filterOptions="filterOptions2" />
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">部门退回待审<span class="amount">21</span></span>
      <Operation :filterOptions="filterOptions2" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Operation from './Operation'
import Tableone from './TableOne'
import Footer from './Footer'

export default {
  name:'Tabs',
  components: { Operation,Tableone,Footer },
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
      // auditLabel:[
      //   {prop:"title",label:"标题",width:320},
      //   {prop:"countdown",label:"剩余时间",width:104},
      //   {prop:"genre",label:"类型",width:72},
      //   {prop:"region",label:"地域",width:72},
      //   {prop:"branch",label:"部门",width:72},
      //   {prop:"questiontime",label:"提问时间",width:144},
      //   {prop:"questioner",label:"提问人",width:72}
      // ],
       auditList:[]
    }
  },
  mounted(){
    this.auditList = [{
      title:"房产局办事效率可以提高吗",
      countdown:"2小时",
      genre:"咨询",
      region:"武汉",
      branch:"房产局",
      questiontime:"2018-03-10 15:30",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6小时",
      genre:"建议",
      region:"武汉",
      branch:"交通局",
      questiontime:"2018-03-11 15:30",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4小时",
      genre:"投诉",
      region:"荆州",
      branch:"情报局",
      questiontime:"2018-02-9 15:30",
      questioner:"崔没没"
    },{
      title:"房产局办事效率可以提高吗",
      countdown:"2小时",
      genre:"咨询",
      region:"荆州",
      branch:"房产局",
      questiontime:"2018-03-10 15:31",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6小时",
      genre:"建议",
      region:"宜昌",
      branch:"交通局",
      questiontime:"2018-03-11 15:33",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4小时",
      genre:"投诉",
      region:"襄阳",
      branch:"情报局",
      questiontime:"2018-02-9 15:40",
      questioner:"崔没没"
    },{
      title:"房产局办事效率可以提高吗",
      countdown:"2小时",
      genre:"咨询",
      region:"襄阳",
      branch:"房产局",
      questiontime:"2018-03-10 15:20",
      questioner:"崔有有"
    },{
      title:"交通局办事效率可以提高吗",
      countdown:"6小时",
      genre:"建议",
      region:"孝感",
      branch:"交通局",
      questiontime:"2018-03-11 15:10",
      questioner:"崔没有"
    },{
      title:"情报局办事效率可以提高吗",
      countdown:"4小时",
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

