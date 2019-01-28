<template>
    <div class="Emailreminder">
        <el-dialog title="邮件提醒" :visible.sync="denyVisible" :close-on-click-modal="false" width="704px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-select v-model="form.region" placeholder="选择常用回复语">
                    <el-option key="1" label="回复语1" value="h1"></el-option>
                    <el-option key="2" label="回复语2" value="h2"></el-option>
                    <el-option key="3" label="回复语3" value="h3"></el-option>
                </el-select>
                <el-input type="textarea" rows="10" v-model="form.desc" :maxlength="200"  @input="removeActive($event)" placeholder=""></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer btn_border">
                <el-button type="primary" @click="submit"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提   交 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </el-button>
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
            }
            
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
    .el-input {
        margin-bottom:16px; 
    }
    .btn_border button{
        border-color: #4D84FF;
        color: #4D84FF;
        background: none;
    }
</style>


