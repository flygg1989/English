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
                {
                    //平台待审核
                    path: '/audit',
                    component: resolve => require(['../components/page/audit'], resolve),
                    meta: { title: '待审核' }
                },
                {
                    //平台已审核
                    path: '/audited',
                    component: resolve => require(['../components/page/audited'], resolve),
                    meta: { title: '已审核' }
                },
                {
                    //问政大厅>不予处理
                    path: '/refusetohandle',
                    component: resolve => require(['../components/page/refusetohandle'], resolve),
                    meta: { title: '不予处理' }
                },
                {
                    //问政大厅>置顶
                    path: '/prior',
                    component: resolve => require(['../components/page/prior'], resolve),
                    meta: { title: '置顶' }
                },
                {
                    //问政大厅>隐藏
                    path: '/cryptic',
                    component: resolve => require(['../components/page/cryptic'], resolve),
                    meta: { title: '隐藏' }
                },
                {
                    //部门大厅>问政处理
                    path: '/politicshandle',
                    component: resolve => require(['../components/page/politicshandle'], resolve),
                    meta: { title: '问政处理' }
                },
                {
                    //用户管理>用户管理
                    path: '/usermanagement',
                    component: resolve => require(['../components/page/usermanagement'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    //用户管理>部门管理
                    path: '/branchmanagement',
                    component: resolve => require(['../components/page/branchmanagement'], resolve),
                    meta: { title: '部门管理' }
                },
                {
                    //统计分析>数据统计
                    path: '/statistics',
                    component: resolve => require(['../components/page/statistics'], resolve),
                    meta: { title: '数据统计' }
                },
                {
                    //顶部Header登陆状态个人中心
                    path: '/personalcenter',
                    component: resolve => require(['../components/page/personalcenter'], resolve),
                    meta: { title: '个人中心' }
                },
                {
                    //问政设置>基本设置
                    path: '/basicsettings',
                    component: resolve => require(['../components/page/basicsettings'], resolve),
                    meta: { title: '基本设置' }
                },
                {
                    // 待审核 弹窗
                    path: '/maskOne/:id',
                    component: resolve => require(['../components/page/mask/maskOne'], resolve),
                    meta: { title: '待审核' }
                },
                {
                    // 追问待审核 弹窗
                    path: '/maskTwo',
                    component: resolve => require(['../components/page/mask/maskTwo'], resolve),
                    meta: { title: '追问待审核' }
                },
                {
                    // 邮件提醒 弹窗
                    path: '/Emailreminder',
                    component: resolve => require(['../components/page/mask/Emailreminder'], resolve),
                    meta: { title: '邮件提醒' }
                },
                {
                    // 邮件提醒(小) 弹窗
                    path: '/EmailreminderOne',
                    component: resolve => require(['../components/page/mask/EmailreminderOne'], resolve),
                    meta: { title: '邮件提醒' }
                },
                {
                    //回复待审核 弹窗
                    path: '/maskThree',
                    component: resolve => require(['../components/page/mask/maskThree'], resolve),
                    meta: { title: '回复待审核' }
                },
                {
                    //审核通过 弹窗
                    path: '/maskFour',
                    component: resolve => require(['../components/page/mask/maskFour'], resolve),
                    meta: { title: '审核通过' }
                },
                {
                    //审核通过 弹窗
                    path: '/maskFive',
                    component: resolve => require(['../components/page/mask/maskFive'], resolve),
                    meta: { title: '退回待审核' }
                },
                {
                    //平台  审核通过 处理中 弹窗
                    path: '/maskSix',
                    component: resolve => require(['../components/page/mask/maskSix'], resolve),
                    meta: { title: '审核通过' }
                },
                {
                    //平台  已审核/已回复 弹窗
                    path: '/maskSeven',
                    component: resolve => require(['../components/page/mask/maskSeven'], resolve),
                    meta: { title: '已审核' }
                },
                {
                    //平台  已审核/已评价 弹窗
                    path: '/maskEight',
                    component: resolve => require(['../components/page/mask/maskEight'], resolve),
                    meta: { title: '已审核' }
                },
                {
                    //平台  已审核/已办结 弹窗
                    path: '/maskNine',
                    component: resolve => require(['../components/page/mask/maskNine'], resolve),
                    meta: { title: '已办结' }
                },
                {
                    //平台  不予处理 弹窗
                    path: '/maskTen',
                    component: resolve => require(['../components/page/mask/maskTen'], resolve),
                    meta: { title: '不予处理' }
                },
                {
                    //平台  已审核/已办结/已置顶/已隐藏  弹窗
                    path: '/maskEleven',
                    component: resolve => require(['../components/page/mask/maskEleven'], resolve),
                    meta: { title: '已置顶/已隐藏' }
                },

                //部门  弹窗
                {
                    //部门待处理 弹窗
                    path: '/maskTwelve',
                    component: resolve => require(['../components/page/mask/maskTwelve'], resolve),
                    meta: { title: '待处理' }
                },
                {
                    //部门 审核通过 /待审核 弹窗
                    path: '/maskFourteen',
                    component: resolve => require(['../components/page/mask/maskFourteen'], resolve),
                    meta: { title: '审核通过/待审核' }
                },
                {
                    //部门 审核不通过 弹窗
                    path: '/maskFifteen',
                    component: resolve => require(['../components/page/mask/maskFifteen'], resolve),
                    meta: { title: '审核不通过' }
                },
                {
                    //部门 已评价 弹窗
                    path: '/maskEighteen',
                    component: resolve => require(['../components/page/mask/maskEighteen'], resolve),
                    meta: { title: '已评价' }
                },
                {
                    //部门 创建部门 弹窗
                    path: '/CreateDepartment',
                    component: resolve => require(['../components/page/mask/CreateDepartment'], resolve),
                    meta: { title: '创建部门' }
                },
                {
                    //个人中心 修改密码 弹窗
                    path: '/ChangePassword',
                    component: resolve => require(['../components/page/mask/ChangePassword'], resolve),
                    meta: { title: '修改密码' }
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
