<template> 
  <el-tabs type="border-card" @tab-click="refreshTab">
    <el-tab-pane>
      <span slot="label">待处理<span v-if="amount1 !== 0" class="amount">{{amount1}}</span></span>
      <OperationOne v-if="hackReset == '0'" v-on:listenTableOneChange="changeTableOne" />
      <TableOne v-if="tabsOneTable == 1 && hackReset == '0'"/>
      <TableOneTwo v-if="tabsOneTable == 2 && hackReset == '0'"/>
      <MaskTwelve v-if="tabsOneTable == 1 && hackReset == '0'"/>
      <MaskFourteen v-if="tabsOneTable == 2 && hackReset == '0'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已回复<span v-if="amount2 !== 0" class="amount">{{amount2}}</span></span>
      <Operation v-if="hackReset == '1'" />
      <TableTwo v-if="hackReset == '1'"/>
      <MaskFifteen v-if="hackReset == '1'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已评价<span v-if="amount3 !== 0" class="amount">{{amount3}}</span></span>
      <Operation v-if="hackReset == '2'" />
      <TableThree v-if="hackReset == '2'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已办结<span v-if="amount4 !== 0" class="amount">{{amount4}}</span></span>
      <Operation v-if="hackReset == '3'" />
      <TableFour v-if="hackReset == '3'"/>
    </el-tab-pane>
    <MaskEighteen  v-if="hackReset == '2' || hackReset == '3'"/>
  </el-tabs>
</template>
<script>
import api from "@/utils/api";

import OperationOne from './OperationOne'
import TableOne from './TableOne'
import TableOneTwo from './TableOneTwo'
import Operation from './Operation'
import TableTwo from './TableTwo'
import TableThree from './TableThree'
import TableFour from './TableFour'

import MaskTwelve from '../mask/maskTwelve' //部门 待处理 弹窗
import MaskFourteen from '../mask/maskFourteen' //部门 待处理 退回记录 弹窗
import MaskFifteen from '../mask/maskFifteen' //部门 待处理 已回复 弹窗
import MaskEighteen from '../mask/maskEighteen' //部门 已评价 已办结 弹窗

export default {
  name:'Tabs',
  components: { 
    OperationOne,
    TableOne,
    TableOneTwo,
    Operation,
    TableTwo,
    TableThree,
    TableFour,
    MaskTwelve,
    MaskFourteen,
    MaskFifteen,
    MaskEighteen,
  },
  data(){
    return {
      hackReset:'0',
      amount1:0,
      amount2:0,
      amount3:0,
      amount4:0,
      tabsOneTable:"1",
    }
  },
  created(){
    this.getAmount()
  },
  methods:{
    changeTableOne:function(value){
      this.tabsOneTable = value
      console.log(this.tabsOneTable);
    },
    refreshTab:function(data){
      //console.log(data.index);
      this.hackReset = data.index
      this.tabsOneTable = 1
      this.getAmount()
    },
    getAmount:function(){
      api.request({
        url: "suggest/statistics",
        method: "GET"
      }).then(res=>{
          res = res.data.data.common
          this.amount1 = res.j
          this.amount2 = res.k
          this.amount3 = res.g
          this.amount4 = res.h
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    }
  }
}
</script>
<style scoped>

</style>

