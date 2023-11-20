import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/layout/index'
import Login from '@/pages/login/login'
import NotFound from '@/pages/errorPage/404'
import Forbidden from '@/pages/errorPage/403'
import OrderDetail from '@/pages/order-manage/order-detail'
import pushOrderDetail from '@/pages/push-customers/push-customer-order'
import backPage from '@/pages/backPage/index'
import authPage from '@/pages/authPage/index'
Vue.use(Router)

/* 初始路由 */
export default new Router({
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/backPage',
            name: 'backPage',
            component: backPage,
            meta: {
                name: '',
                cover: '',
                checkCover: ''
            }
        },
        {
            path: '/authPage',
            name: 'authPage',
            component: authPage,
            meta: {
                name: '',
                cover: '',
                checkCover: ''
            }
        }
    ]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [
    {
        path: '',
        component: Layout,
        name: 'container',
        redirect: '/goodsList',
        meta: {
            requiresAuth: true,
            name: '首页'
        },
        children: [
            {
                path: '/orderDetail/:id?',
                name: 'orderDetail',
                component: OrderDetail,
                meta: {
                    name: '',
                    icon: ''
                }
            },
            {
                path: '/pushOrderDetail/:aid?',
                name: 'pushOrderDetail',
                component: pushOrderDetail,
                meta: {
                    name: '',
                    cover: '',
                    checkCover: ''
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
