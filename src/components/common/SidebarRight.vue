<template>
    <div class="sidebar sidebar_right">
        <!--平台菜单-->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapseb"  background-color="#EBECF1"
            text-color="#2D3557" active-text-color="#fff" unique-opened router v-if="utype == 1">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }} <span v-if="subItem.num">（{{subItem.num}}）</span></template>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}<span v-if="subItem.num">（{{subItem.num}}）</span>
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
        <!--部门菜单-->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapseb"  background-color="#EBECF1"
            text-color="#2D3557" active-text-color="#fff" unique-opened router v-if="utype == 2">
            <template v-for="item in departmentitems">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }} <span v-if="subItem.num">（{{subItem.num}}）</span></template>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}<span v-if="subItem.num">（{{subItem.num}}）</span>
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
        <!-- <div class="btn_return" @click="collapseChage"><i :class="icon"></i></div> -->
    </div>
</template>

<script>
    import api from "@/utils/api";  
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapseb: false,
                icon:'el-icon-caret-right',
                utype:'',
                //平台
                items: [
                    {
                        index: '2',
                        title: '问政大厅',
                        subs: [
                            {
                                index: 'audit',
                                title: '待审核',
                                num:'',
                            },
                            {
                                index: 'audited',
                                title: '已审核',
                                num:'',
                            },
                            {
                                index: 'refusetohandle',
                                title: '不予处理',
                                num:'',
                            },
                            {
                                index: 'prior',
                                title: '置顶',
                                num:'',
                            },
                            {
                                index: 'cryptic',
                                title: '隐藏',
                                num:'',
                            }
                        ]
                    },
                    {
                        index: '3',
                        title: '问政设置',
                        subs: [
                            {
                                index: 'basicsettings',
                                title: '基础设置'
                            },
                        ]
                    },
                    {
                        index: '4',
                        title: '统计分析',
                        subs: [
                            {
                                index: 'statistics',
                                title: '数据统计'
                            }
                        ]
                    },
                    {
                        index: '5',
                        title: '用户管理',
                        subs: [
                            {
                                index: 'usermanagement',
                                title: '用户管理'
                            },
                            {
                                index: 'branchmanagement',
                                title: '部门管理'
                            }
                        ]
                    },
                   
                ],
                //部门
                departmentitems: [
                    {   
                        index:'1',
                        title: '部门大厅',
                        subs: [
                            {
                                index: 'politicshandle',
                                title: '问政处理',
                            },
                            {
                                index: 'personalcenter',
                                title: '个人中心',
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
            //通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapseb', msg => {
                this.collapseb = msg;
            })
            this.getutype() //判断是平台还是部门
            this.getplatformNum() //获取平台菜单数字
        },
        methods:{
            //判断是平台还是部门
            getutype(){
                let utype = localStorage.getItem('utype');  //判断是平台还是部门
                //console.log(utype)
                if(utype == 1){
                    this.utype = 1
                }else{
                    this.utype = 2
                }
            },

            // 侧边栏折叠
            collapseChage(){
                this.collapseb = !this.collapseb;
                bus.$emit('collapseb', this.collapseb);
                console.log(this.collapseb)
                if(this.collapseb == true){
                    this.icon = 'el-icon-caret-right'
                }else{
                    this.icon = 'el-icon-caret-left'
                }
            },

            //获取平台菜单数字
            getplatformNum(){
                api.request({
                    url: "suggest/statistics",
                    method: "GET"
                }).then(res=>{
                    //console.log(res)
                    if(res.status == 200){
                        if(res.data.state ==true){
                            this.items[0].subs[0].num = res.data.data.common.a1;
                            this.items[0].subs[1].num = res.data.data.common.a2;
                            this.items[0].subs[2].num = res.data.data.common.i;
                            this.items[0].subs[3].num = res.data.data.common.top_count;
                            this.items[0].subs[4].num = res.data.data.common.hide_count;
                            this.departmentitems[0].subs[0].num = res.data.data.common.a3
                        }else{
                            this.$notify.error({
                                title: "错误",
                                message: res.data.message
                            }); 
                        };
                    }
                },res => {
                    this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                    });
                    this.$confirm('此账号已在别处登录，请知悉！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push('/login'); 
                    }).catch(() => {
                                 
                    });
                    
                })
            },
        }
    }
</script>

<style scoped>
    .sidebar_right{
        display: block;
        position: absolute;
        left: 0;
        top: 0px;
        bottom:0;
        overflow: visible;
        z-index: 996;
    }
    .sidebar_right{
        overflow: visible;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar_right .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
    .sidebar_right .is-active{
        background: #4D84FF !important;
        color: #fff !important;
    }
    .sidebar_right .el-menu-item{
        min-width: auto;
    }
    .btn_return{
        width: 16px;
        height: 64px;
        line-height:64px;
        text-align: center;
        background:rgba(231,232,237,1);
        z-index: 998;
        position: absolute;
        top: 50%;
        right: -16px;
        border-radius: 0 8px 8px 0;
    }
    .sidebar_right .el-menu--collapse{
        width: 0px;
    }
    .sidebar_right .el-menu--collapse .btn_return{
        right: -16px;
    }
    .sidebar_right .el-submenu{
        overflow: hidden;
    }
</style>
