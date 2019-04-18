import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },  
                //欢迎页
                {
                    path: '/Welcome',
                    component: resolve => require(['../components/page/Welcome.vue'], resolve),
                    meta: { title: '欢迎页' }
                },               
                {
                    //个人中心
                    path: '/PersonalCenter',
                    component: resolve => require(['../components/page/PersonalCenter/PersonalCenter'], resolve),
                    meta: { title: '个人中心' }
                },
                //用户管理
                {
                    // 平台用户管理
                    path: '/platformUser',
                    component: resolve => require(['../components/page/usermanagement/platformUser'], resolve),
                    meta: { title: '平台用户' }
                },
                {
                    // 普通用户管理
                    path: '/commonUser',
                    component: resolve => require(['../components/page/usermanagement/commonUser'], resolve),
                    meta: { title: '普通用户' }
                },
                //系统管理
                {
                    //组织架构管理
                    path: '/Organizationmanagement',
                    component: resolve => require(['../components/page/systemmanagement/Organizationmanagement'], resolve),
                    meta: { title: '组织架构' }
                },
                {
                    //角色管理
                    path: '/UserRoles',
                    component: resolve => require(['../components/page/systemmanagement/UserRoles'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    //全局配置
                    path: '/GlobalManagement',
                    component: resolve => require(['../components/page/systemmanagement/GlobalManagement'], resolve),
                    meta: { title: '全局配置' }
                },
                //学习管理
                {
                    //学习栏目管理
                    path: '/Column',
                    component: resolve => require(['../components/page/Learningmanagement/Column'], resolve),
                    meta: { title: '学习栏目' }
                },
                //场景管理
                {
                    //场景分类
                    path: '/Sceneclassification',
                    component: resolve => require(['../components/page/scene/Sceneclassification'], resolve),
                    meta: { title: '场景分类' }
                },
                {
                    //场景对话
                    path: '/Scenedialogue',
                    component: resolve => require(['../components/page/scene/Scenedialogue'], resolve),
                    meta: { title: '场景对话' }
                },
                //单词管理
                {
                    //单词列表
                    path: '/Word',
                    component: resolve => require(['../components/page/Wordmanagement/WordList'], resolve),
                    meta: { title: '单词列表' }
                },
                {
                //单词练习
                path: '/Wordpractice',
                component: resolve => require(['../components/page/Wordmanagement/Wordpractice'], resolve),
                meta: { title: '单词练习' }
                },

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {   //找回密码
            path: '/Retrievepassword',
            component: resolve => require(['../components/page/Retrievepassword.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
