<template>
    <div class="Emailreminder">
        <el-dialog title="邮件提醒" :visible.sync="denyVisible" :close-on-click-modal="false" width="424px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-input type="textarea" rows="5" v-model="form.desc" :maxlength="200"  @input="removeActive($event)" placeholder=""></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="denyVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提  交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            denyVisible: true,
            form:{
                region:'',
                desc:'',
            },
           
        }
    },

    methods: {
        submit(){
            this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
            });
            this.denyVisible =false
        },
    }
}
</script>

<style>
     textarea{
        font-family: Microsoft YaHei;
    }
    .el-dialog__header{
        text-align: center ;
        color: #2D3557 !important;
        font-size: 20px !important;
    }

</style>


