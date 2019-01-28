<template>
    <el-dialog title="不予处理原因" :visible.sync="denyVisible" :close-on-click-modal="false" width="704px">
        <el-input type="textarea" rows="10" v-model="desc" :maxlength="200"  @input="removeActive($event)" placeholder="请输入驳回原因，200个字符以内"></el-input>
        <i class="num">{{textlength}}/200</i>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="denyVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="submit"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提   交 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </el-button>
        </span>
    </el-dialog>
</template>

<script>
import api from "@/utils/api";

import Bus from "@/components/common/bus.js";



export default {
  name:'Notreatment',
  
  data(){
    return {
      //不予处理
            denyVisible:false,
            desc:'',
            textlength:'0',
    }
  },
  created(){
      
    // Bus.$on('sendID',(data)=>{
    //     this.denyVisible = true;
    //         console.log(data+'555')
    //     })
  },
  methods:{
    submit(){
            if(this.desc.length == 0){
                this.$notify.error({
                title: '错误',
                message: '原因不能为空！'
                });
            }else{
                this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                });
                this.denyVisible =false
            }
        },
  },
  mounted(){
    
  }
}
</script>
<style scoped>

</style>