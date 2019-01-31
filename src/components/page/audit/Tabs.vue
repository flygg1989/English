<template>
  <el-tabs type="border-card" @tab-click="refreshTab">
    <el-tab-pane>
      <span slot="label">新问政待审<span v-if="amount1 !== 0" class="amount">{{amount1}}</span></span>
      <Operation v-if="hackReset == '0'" :filterOptions="filterOptions1"/>
      <TableOne v-if="hackReset == '0'"/>
      <MaskOne v-if="hackReset == '0'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">追问待审<span v-if="amount2 !== 0" class="amount">{{amount2}}</span></span>
      <Operation v-if="hackReset == '1'" :filterOptions="filterOptions3"/>
      <TableTwo v-if="hackReset == '1'"/>
      <MaskTwo v-if="hackReset == '1'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">回复待审<span v-if="amount3 !== 0" class="amount">{{amount3}}</span></span>
      <OperationThree v-if="hackReset == '2'" :filterOptions="filterOptions2" v-on:listenTableThreeChange="changeTableThree"/>
      <TableThree v-if="tabsThreeTable == 1 && hackReset == '2'"/>
      <TableThreeTwo v-if="tabsThreeTable == 2 && hackReset == '2'"/>
      <MaskThree v-if="tabsThreeTable == 1 && hackReset == '2'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">部门退回待审<span v-if="amount4 !== 0" class="amount">{{amount4}}</span></span>
      <OperationFour v-if="hackReset == '3'" :filterOptions="filterOptions2" v-on:listenTableFourChange="changeTableFour"/>
      <TableFour v-if="tabsFourTable == 1 && hackReset == '3'"/>
      <TableFourTwo v-if="tabsFourTable == 2 && hackReset == '3'"/>
      <MaskFive v-if="tabsFourTable == 1 && hackReset == '3'"/>
    </el-tab-pane>
    <MaskFour v-if="tabsThreeTable == 2 && hackReset == '2'"/>
    <MaskFour v-if="tabsFourTable == 2 && hackReset == '3'"/>
  </el-tabs>
</template>
<script>
import api from "@/utils/api";

import Operation from './Operation'
import TableOne from './TableOne'
import TableTwo from './TableTwo'
import OperationThree from './OperationThree'
import TableThree from './TableThree'
import TableThreeTwo from './TableThreeTwo'
import OperationFour from './OperationFour'
import TableFour from './TableFour'
import TableFourTwo from './TableFourTwo'

import MaskOne from '../mask/maskOne' //平台待审核 弹窗
import MaskTwo from '../mask/maskTwo' //平台 追问待审核 弹窗
import MaskThree from '../mask/maskThree' //平台 回复待审核 弹窗
import MaskFour from '../mask/maskFour' //平台 回复待审核 弹窗
import MaskFive from '../mask/maskFive' //平台 回复待审核 弹窗

export default {
  name:'Tabs',
  components: { 
    Operation,
    TableOne,
    TableTwo,
    OperationThree,
    TableThree,
    TableThreeTwo,
    OperationFour,
    TableFour,
    TableFourTwo,
    MaskOne,
    MaskTwo,
    MaskThree,
    MaskFour,
    MaskFive
  },
  data(){
    return {
      hackReset:'0',
      amount1:0,
      amount2:0,
      amount3:0,
      amount4:0,
      filterOptions1 : [{
        value: '0',
        label: '全部'
      }, {
        value: '2',
        label: '撤回待审'
      }],
      filterOptions2 : [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '追问'
      }],
      filterOptions3 : [{
        value: 'b',
        label: '全部'
      }, {
        value: '16',
        label: '追问撤回待审'
      }],
      tabsThreeTable:"1",
      tabsFourTable:"1"
    }
  },
  mounted(){
    this.getAmount()
  },
  methods:{
    refreshTab:function(data){
      //console.log(data.index);
      this.hackReset = data.index
      this.tabsThreeTable = '1'
      this.tabsFourTable = '1'
      this.getAmount()
    },

    changeTableThree:function(value){
      this.tabsThreeTable = value
    },
    changeTableFour:function(value){
      this.tabsFourTable = value
    },
    getAmount:function(){
      api.request({
        url: "suggest/statistics",
        method: "GET"
      }).then(res=>{
          res = res.data.data.common
          this.amount1 = res.a
          this.amount2 = res.b
          this.amount3 = res.c
          this.amount4 = res.d
      },res => {
        this.$notify.error({
            title: "错误",
            message: "数据请求失败"
          });
      })
    }
  },
  mounted(){
    
  }
}
</script>
<style scoped>

</style>

