<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span class="basic-tabs-label" slot="label">开关设置</span>
      <SwitchSettings />
    </el-tab-pane>
    <el-tab-pane>
      <span class="basic-tabs-label" slot="label">条件设置</span>
      <ConditionSettings />
    </el-tab-pane>
    <el-tab-pane>
      <span class="basic-tabs-label" slot="label">问题类型</span>
      <QuestionType />
    </el-tab-pane>
    <el-tab-pane>
      <span class="basic-tabs-label" slot="label">部门分类</span>
      <BranchType />
    </el-tab-pane>
    <el-tab-pane>
      <span class="basic-tabs-label" slot="label">问政声明</span>
      <PoliticsStatement />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import SwitchSettings from './SwitchSettings'
import ConditionSettings from './ConditionSettings'
import QuestionType from './QuestionType'
import BranchType from './BranchType'
import PoliticsStatement from './PoliticsStatement'

export default {
  name:'Tabs',
  components: { 
    SwitchSettings,
    ConditionSettings,
    QuestionType,
    BranchType,
    PoliticsStatement
  },
  data(){
    return {
      
    }
  }
}
</script>