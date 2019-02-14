<template>
  <el-tabs type="border-card" @tab-click="refreshTab">
    <el-tab-pane>
      <span slot="label">部门待回复<span v-if="amount1 !== 0" class="amount">{{amount1}}</span></span>
      <Operation v-if="hackReset == '0'" :filterOptions="filterOptions" :timeOptions="timeOptions1" />
      <TableOne v-if="hackReset == '0'"/>
      <MaskSix v-if="hackReset == '0'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已回复<span v-if="amount2 !== 0" class="amount">{{amount2}}</span></span>
      <Operation v-if="hackReset == '1'" :filterOptions="filterOptions" :timeOptions="timeOptions2" />
      <TableTwo v-if="hackReset == '1'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已评价<span v-if="amount3 !== 0" class="amount">{{amount3}}</span></span>
      <Operation v-if="hackReset == '2'" :filterOptions="filterOptions" :timeOptions="timeOptions2" />
      <TableThree  v-if="hackReset == '2'"/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">已办结<span v-if="amount4 !== 0" class="amount">{{amount4}}</span></span>
      <Operation v-if="hackReset == '3'" :filterOptions="filterOptions" :timeOptions="timeOptions2" />
      <TableFour v-if="hackReset == '3'"/>
      <MaskNine v-if="hackReset == '3'"/>
    </el-tab-pane>
    <MaskSeven v-if="hackReset == '1' || hackReset == '2'"/>
  </el-tabs>
</template>
<script>
import api from "@/utils/api";

import Operation from './Operation'
import TableOne from './TableOne'
import TableTwo from './TableTwo'
import TableThree from './TableThree'
import TableFour from './TableFour'

import MaskSix from '../mask/maskSix' //平台 已审核已回复 弹窗
import MaskSeven from '../mask/maskSeven' //平台 已审核已回复 弹窗
import MaskNine from '../mask/maskNine' //平台 已审核已办结 弹窗


export default {
  name:'Tabs',
  components: { 
    Operation,
    TableOne,
    TableTwo,
    TableThree,
    TableFour,
    MaskSix,
    MaskSeven,
    MaskNine,
  },
  data(){
    return {
      hackReset:'0',
      amount1:0,
      amount2:0,
      amount3:0,
      amount4:0,
      filterOptions : [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '追问'
      }],
      timeOptions1: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '今日'
      }, {
        value: '2',
        label: '本周'
      }, {
        value: '3',
        label: '本月'
      }],
      timeOptions2: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '今日'
      }, {
        value: '2',
        label: '本周'
      }, {
        value: '3',
        label: '本月'
      }, {
        value: '4',
        label: '本季度'
      }, {
        value: '5',
        label: '本年度'
      }]
    }
  },
  mounted(){
    this.getAmount()
  },
  created(){
    this.getAmount()
  },
  methods:{

    refreshTab:function(data){
      //console.log(data);
      this.hackReset = data.index
      this.getAmount()
    },

    getAmount:function(){
      api.request({
        url: "suggest/statistics",
        method: "GET"
      }).then(res=>{
          res = res.data.data.common
          this.amount1 = res.e
          this.amount2 = res.f
          this.amount3 = res.g
          this.amount4 = res.h
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