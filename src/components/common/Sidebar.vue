<template>
    <div class="sidebar">
         <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened router>
            <v-SidebarL></v-SidebarL>
            <v-SidebarR></v-SidebarR>
            <div class="btn_return" @click="collapseChage"><i class="el-icon-lx-back"></i></div>
        </el-menu>
       
    </div>
</template>

<script>
    import vSidebarL from '../common/SidebarLeft.vue';
    import vSidebarR from '../common/SidebarRight.vue';
    import bus from '../common/bus';
    export default {
        data() {
            return {
              collapse: false,
            }
        },
        components:{
            vSidebarL, vSidebarR
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
        }
     
       
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 64px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar-el-menu{
        height: 100%;
    }
    .sidebar > ul {
        height:100%;
    }
    .btn_return{
        width: 16px;
        height: 64px;
        line-height:64px;
        text-align: center;
        background:#dedede;
        z-index: 998;
        position: absolute;
        top: 50%;
        right: -2px;
        border-radius: 0 8px 8px 0;
    }
</style>
