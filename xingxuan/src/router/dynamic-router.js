
import Home from '@/pages/home/index'
/* 商品列表 */
const GoodsList = () => import('@/pages/goods-manage/index')
/* 选品中心 */
const GoodsCenter = () => import('@/pages/goods-center/index')
/* 订单管理 */
const OrderList = () => import('@/pages/order-manage/order-list')
/* 小商店管理 */
const MiniProgramManage = () => import('@/pages/mini-program-manage/index')
/* 提现管理 */
const WithdrawalManage = () => import('@/pages/withdrawal-manage/index')
/* 账户管理 */
const AccountManage = () => import('@/pages/account-manage/index')
/* 平台管理 */
const PlatformManage = () => import('@/pages/platform-manage/index')
/* 活动管理 */
const ActivityManage = () => import('@/pages/activity-manage')
// 活动列表
const ActivityList = () => import('@/pages/activity-manage/activity-list')
// 新建活动
const ActivityAdd = () => import('@/pages/activity-manage/activity-add')
// 推客管理
const PushCustomers = () => import('@/pages/push-customers')
// 推客列表
const PushCustomersList = () => import('@/pages/push-customers/push-customer-list')
// 推客订单
const PushCustomersOrder = () => import('@/pages/push-customers/push-customer-order')
/* 需要权限判断的路由 */
const dynamicRoutes = [
    // {
    //     id: 1,
    //     path: 'home',
    //     component: Home,
    //     name: 'home',
    //     meta: {
    //         name: '首页',
    //         icon: 'tree'
    //     }
    // },
    {
        id: 2,
        path: '/goodsList',
        component: GoodsList,
        name: 'GoodsList',
        meta: {
            name: '商品列表',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/goods_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/goods_selected.png'
        },
        children: []
    },
    {
        id: 3,
        path: '/goodsCenter',
        component: GoodsCenter,
        name: 'GoodsCenter',
        meta: {
            name: '选品库',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/Selection_noraml.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/Selection_selected.png'
        },
        children: []
    },
    {
        id: 4,
        path: '/orderList',
        component: OrderList,
        name: 'OrderList',
        meta: {
            name: '订单管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/account_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/account_selected.png'
        },
        children: []
    },
    {
        id: 5,
        path: '/miniProgramManage',
        component: MiniProgramManage,
        name: 'MiniProgramManage',
        meta: {
            name: '小商店管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/shop_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/w_shop.png'
        },
        children: []
    },
    {
        id: 6,
        path: '/pushCustomers',
        component: PushCustomers,
        name: 'PushCustomers',
        meta: {
            name: '推客管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/anchor_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/anchor_selected.png'
        },
        children: [
            {
                id: '6-1',
                path: 'pushCustomersList',
                name: 'pushCustomersList',
                component: PushCustomersList,
                meta: {
                    name: '推客列表',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/anchorlist_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/anchorlist_selected.png'
                }
            }
            // {
            //     id: '6-2',
            //     path: 'pushCustomersOrder',
            //     name: 'pushCustomersOrder',
            //     component: PushCustomersOrder,
            //     meta: {
            //         name: '推客订单',
            //         cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_list_normal.png',
            //         checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_list_selected.png'
            //     }
            // }
        ]
    },
    {
        id: 7,
        path: '/withdrawalManage',
        component: WithdrawalManage,
        name: 'WithdrawalManage',
        meta: {
            name: '提现管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/Withdrawal_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/Withdrawal_selected.png'
        },
        children: []
    },
    {
        id: 8,
        path: '/accountManage',
        component: AccountManage,
        name: 'AccountManage',
        meta: {
            name: '账户管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/order_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/order_selected.png'
        },
        children: []
    },
    {
        id: 9,
        path: '/platformManage',
        component: PlatformManage,
        name: 'PlatformManage',
        meta: {
            name: '平台管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/set_noraml.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/set_selected.png'
        },
        children: []
    },
    {
        id: 10,
        path: '/activityManage',
        component: ActivityManage,
        name: 'ActivityManage',
        meta: {
            name: '活动管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/activity_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/activity_selected.png'
        },
        children: [
            {
                id: '10-1',
                path: 'activityList',
                name: 'activityList',
                component: ActivityList,
                meta: {
                    name: '活动列表',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/activity_list_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/activity_list_selected.png'
                }
            },
            {
                id: '10-2',
                path: 'activityAdd',
                name: 'activityAdd',
                component: ActivityAdd,
                meta: {
                    name: '新建活动',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/add_activity.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/add_activity_selected.png'
                }
            }
        ]
    }
]

export default dynamicRoutes
