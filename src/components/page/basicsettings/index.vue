<template>
  <div class="basic-settings">
    <tabs/>
  </div>
</template>
<script>
import Tabs from './Tabs'

export default {
  components: { Tabs },
  data(){
    return {
      
    }
  },
  mounted(){
    
  }
}
</script>
<style>
.basic-settings{
  height:100%;
}
.basic-settings .el-tabs__content{
  padding-top:0;
}
.basic-settings .el-tabs__item.is-top{
  text-align:center;
}
</style>