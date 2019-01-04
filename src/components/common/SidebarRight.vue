<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes"  background-color="#EBECF1"
            text-color="#2D3557" active-text-color="#fff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.title }}</span>
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
                        index: '2',
                        title: '问政大厅',
                        subs: [
                            {
                                index: '2-1',
                                title: '待审核（999+）'
                            },
                            {
                                index: '2-2',
                                title: '已审核（496）',
                            },
                            {
                                index: '2-3',
                                title: '不予处理（67）'
                            },
                            {
                                index: '2-4',
                                title: '置顶（496）',
                            },
                            {
                                index: '2-5',
                                title: '隐藏（67）'
                            }
                        ]
                    },
                    {
                        index: '3',
                        title: '基础设置',
                        subs: [
                            {
                                index: '3-1',
                                title: '基础设置'
                            },
                            {
                                index: '3-2',
                                title: '终端管理',
                            },
                            {
                                index: '3-3',
                                title: '提醒设置'
                            }
                        ]
                    },
                    {
                        index: '4',
                        title: '统计管理',
                        subs: [
                            {
                                index: '4-1',
                                title: '统计'
                            }
                        ]
                    },
                    {
                        index: '5',
                        title: '用户管理',
                        subs: [
                            {
                                index: '5-1',
                                title: '部分管理'
                            }
                        ]
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
        left: 64px;
        top: 0px;
        bottom:0;
        overflow-y: scroll;
        z-index: 996;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 192px;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-menu-item:hover{
        background: #4D84FF !important;
        color: #fff !important;
    }
</style>
