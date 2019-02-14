<template>
  <div class="statistics">
    <div class="tabs-content">
      <div class="operation">
        <div class="operation-left">
          <span class="ipt-label">选取时间段 :</span>
          <el-date-picker
              @change="choseDone"
            v-model="selectTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="operation-center" >
          <el-radio-group v-model="radio" fill="#4D84FF" class="radio-group">
            <el-radio-button label="1">回复率排行榜</el-radio-button>
            <el-radio-button label="2">满意度排行榜</el-radio-button>
          </el-radio-group>
        </div>
        <div class="operation-right">
          <el-button type="primary" class="export-table-btn" @click="exportExl">导出表格</el-button>
        </div>
      </div>
      <TableOne v-if="radio == 1" :tableList="tableListOne" :selectTime="selectTime"/>
      <TableTwo v-if="radio == 2" :tableList="tableListTwo" :selectTime="selectTime"/>
    </div>
  </div>
</template>
<script>
import api from '@/utils/api'
import TableOne from './TableOne'
import TableTwo from './TableTwo'
const exportUrl ='politics/exportCount'

export default {
  components:{ TableOne,TableTwo },
  data(){
    return {
      timeType:null,
      radio:'1',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
            this.timeType=1
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
            this.timeType=2
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
            this.timeType=3
          }
        }]
      },
      tableListOne:[],
      tableListTwo:[],
      selectTime:[]
    }

  },
  methods: {
      //请求表格
      async getExport(){
          if(this.selectTime.length===2 ){
              window.location.href=(domain.testUrl+exportUrl+`?token=${localStorage.getItem('sk')}&sort_type=${this.radio}&date_type=4&start_time=${this.selectTime[0]}&end_time=${this.selectTime[1]}`)
          }else {
              window.location.href=(domain.testUrl+exportUrl+'?token='+localStorage.getItem('sk')+'&sort_type='+this.radio)
          }

      },
      //日期选择
     choseDone(){
        let d = new Date(this.selectTime[0])
        let d1 = new Date(this.selectTime[1])
        let startTime =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        let endTime =d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + d1.getHours() + ':' + d1.getMinutes() + ':' + d1.getSeconds()
        this.selectTime= [startTime,endTime]
    },
      //导出事件
      exportExl(){
          this.getExport()
      }
  },
  mounted(){

  },
    watch:{
        //监听切换，清空时间
        radio(val){
            this.selectTime=[]
        }
    }
}
</script>
<style scoped>
   .radio-group{
       width: 240px;
   }
.statistics{
  height:100%;
  background:#fff;
  border-radius:8px;
  box-sizing: border-box;
  padding:0px 16px;
}
.statistics .operation{
  height:80px;
  padding-bottom:0px;
}
.statistics .operation-left,.statistics .operation-right{
  width:40%;
}
.statistics .operation-left{
  display: flex;
  align-items: center;
  justify-content:flex-start;
}
.statistics .operation-right{
  display: flex;
  align-items: center;
  justify-content:flex-end;
}
.statistics .tabs-content{
  height:100%;
  display: flex;
  flex-direction: column;
}
</style>
