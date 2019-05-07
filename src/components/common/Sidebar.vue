<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes"  background-color="#EBECF1"
            text-color="#2D3557" active-text-color="#fff" unique-opened router v-loading="loading">
            <template v-for="item in menus">
                <template v-if="item.children">
                    <el-submenu :index="item.id" :key="item.id">
                        <template slot="title">
                            <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.front_url" :key="subItem.level">
                                <template slot="title">{{ subItem.name }}</template>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.front_url" :key="subItem.id">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.level">
                        <span slot="title" style="font-size:16px;font-weight:bold;color:#2D3557">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
       
    </div>
</template>

<script>
   
    import bus from '../common/bus';
    import api from '@/utils/api'
    export default {
        data() {
            return {
              loading:true,
              collapse: false,
              menus:[],
            }
        },
        
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created() {
            this.getmenus(); // 获取菜单
        },
        mounted(){
            // this.loading=false
        },
        methods:{
            getmenus(){
                api.request({
                    url: "getMenuList",
                    method: "POST",
                }).then(res=>{
                    console.log(res.data.data)
                    if(res.data.state ==true){
                        this.menus =res.data.data
                        this.loading=false
                    }
                },res => {
                    this.$notify.error({
                    title: "错误",
                    message: "数据请求失败"
                    });
                    this.loading=false
                })
            },
            // 侧边栏折叠
            collapseChage(){
                //console.log( this.collapse )
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
       overflow: visible;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 190px;
    }
    .sidebar-el-menu{
        height: 100%;
    }
    .sidebar > ul {
        height:100%;
    }
    .sidebar .is-active{
        background: #4D84FF !important;
        color: #fff !important;
    }
    .sidebar .el-menu-item{
        min-width: auto;
    }
    
    .sidebar .el-submenu{
        overflow: hidden;
    }
</style>
