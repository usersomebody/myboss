import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/layout/index'
import User from '@/pages/user/index'
import Login from '@/pages/login/login'
import NotFound from '@/pages/errorPage/404'
import Forbidden from '@/pages/errorPage/403'
Vue.use(Router)

/* 初始路由 */
export default new Router({
    routes: [
        {
            path: '/login',
            component: Login
        }
    ]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [
    {
        path: '',
        component: Layout,
        name: 'container',
        redirect: '/',
        meta: {
            requiresAuth: true,
            name: '首页'
        },
        children: [
            {
                id: 2,
                path: '/user',
                component: User,
                name: 'user',
                meta: {
                    name: '',
                    icon: ''
                }
            }
        ]
    },
    {
        path: '/403',
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
]
