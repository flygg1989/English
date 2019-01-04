<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#2E313E"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                
                <template>
                    <el-menu-item :index="item.index" :key="item.index" style="overflow:hidden">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span><i class="el-icon-lx-right" style="float:right;position:relative;top:20px;"></i>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: '1',
                        title: '问政'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '2',
                        title: '问政2'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: '3',
                        title: '问政3'
                    },
                   
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top:0px;
        bottom:0;
        overflow-y: scroll;
        background: #2E313E;
        z-index: 997;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 236px;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-menu-item{
        font-size: 16px;
    }
</style>
