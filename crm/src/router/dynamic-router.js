
import Home from '@/pages/home/index'
// 客户管理
const Customer = () => import('@/pages/customer')
const ContactsAdmin = () => import('@/pages/customer/contacts-list')
const CustomerAdmin = () => import('@/pages/customer/customer-list')
// 媒体排期
const Media = () => import('@/pages/media')
const MediaResources = () => import('@/pages/media/media-resources')
const MediaScheduling = () => import('@/pages/media/media-scheduling')
const MediaPaymentApply = () => import('@/pages/media/media-payment-apply')
const MediaPaymentAccount = () => import('@/pages/media/media-payment-account')
const ScheduledInvoicing = () => import('@/pages/media/scheduled-invoicing')
const ChannelInvoicing = () => import('@/pages/media/channel-invoicing')
const MediaSchedulingDetails = () => import('@/pages/media/media-scheduling-details')

// 合同管理

const Contract = () => import('@/pages/contract/index')
// 回款管理
const PayCollection = () => import('@/pages/payCollection/index')
// 审批管理
// const Approve = () => import('@/pages/approve/index')
// const ApproveRecord = () => import('@/pages/approve/approve-record')
// 系统管理
const Setting = () => import('@/pages/setting/index')
const RoleManagement = () => import('@/pages/setting/role-management')
const EmployeeAdmin = () => import('@/pages/setting/employee')
// 系统日志
const Log = () => import('@/pages/log/index')

// const BusinessApproval = () => import('@/pages/setting/business-approval')

// /* 订单管理 */
// const Order = () => import('@/pages/order-manage')
// const OrderList = () => import('@/pages/order-manage/order-list')
// const ProductManage = () => import('@/pages/order-manage/product-manage')
// const ProductionList = () =>
//     import('@/pages/order-manage/product-manage/production-list')
// const ReviewManage = () =>
//     import('@/pages/order-manage/product-manage/review-manage')
// const ReturnGoods = () => import('@/pages/order-manage/return-goods')

// /* 产品管理 */
// const Goods = () => import('@/pages/goods-manage')
// const GoodsList = () => import('@/pages/goods-manage/goods-list')
// const GoodsClassify = () => import('@/pages/goods-manage/goods-classify')
// // 权限管理
// const Permission = () => import('@/pages/permission')
// const UserManage = () => import('@/pages/permission/user-manage')
// const RoleManage = () => import('@/pages/permission/role-manage')
// const MenuManage = () => import('@/pages/permission/menu-manage')
/* 需要权限判断的路由 */
const dynamicRoutes = [
    {
        id: 1,
        path: 'home',
        component: Home,
        name: 'home',
        meta: {
            name: '首页',
            icon: 'tree'
        }
    },
    {
        id: 3,
        path: '/customer',
        component: Customer,
        name: 'customer',
        meta: {
            name: '客户管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_selected.png'
        },
        children: [
            {
                id: '3-1',
                path: 'customerList',
                name: 'customer-admin',
                component: CustomerAdmin,
                meta: {
                    name: '客户列表',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_list_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/customer_list_selected.png'
                }
            },
            {
                id: '3-2',
                path: 'contacts',
                name: 'contacts-admin',
                component: ContactsAdmin,
                meta: {
                    name: '联系人',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/contacts_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/contacts_selected.png'
                }
            }
        ]
    },
    {
        id: 4,
        path: '/media',
        component: Media,
        name: 'media',
        meta: {
            name: '媒体排期',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_list_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_list_selected.png'
        },
        children: [
            {
                id: '4-1',
                path: 'mediaResources',
                name: 'media-resources',
                component: MediaResources,
                meta: {
                    name: '媒体资源',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_resources_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_resources_selected.png'
                }
            },
            {
                id: '4-2',
                path: 'mediaScheduling',
                name: 'media-scheduling',
                component: MediaScheduling,
                meta: {
                    name: '媒体排期',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_scheduling_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Media_scheduling_selected.png'
                }
            },
            {
                id: '4-3',
                path: 'mediaPaymentApply',
                name: 'media-payment-apply',
                component: MediaPaymentApply,
                meta: {
                    name: '渠道付款申请',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Payment _application_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Payment _application_selected.png'
                }
            },
            {
                id: '4-4',
                path: 'mediaPaymentAccount',
                name: 'media-payment-account',
                component: MediaPaymentAccount,
                meta: {
                    name: '渠道付款账号',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Payment_account_normal-1.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/Payment_account_normal.png'
                }
            },
            {
                id: '4-5',
                path: 'scheduledInvoicing',
                name: 'scheduled-invoicing',
                component: ScheduledInvoicing,
                meta: {
                    name: '排期开票',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/invoice_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/invoice_selected.png'
                }
            },
            {
                id: '4-6',
                path: 'channelInvoicing',
                name: 'channel-invoicing',
                component: ChannelInvoicing,
                meta: {
                    name: '渠道开票',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/invoice_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/invoice_selected.png'
                }
            }
            // {
            //     path: 'mediaSchedulingDetails',
            //     name: 'media-scheduling-details',
            //     component: MediaSchedulingDetails,
            //     meta: {
            //         name: '媒体排期明细',
            //         icon: 'eye'
            //     }
            // }
        ]
    },
    {
        id: 5,
        path: '/contract',
        component: Contract,
        name: 'contract',
        meta: {
            name: '合同管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/contract_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/contract_selected.png'
        },
        children: []
    },
    {
        id: 6,
        path: '/payCollection',
        component: PayCollection,
        name: 'payCollection',
        meta: {
            name: '回款管理',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/return_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/return_selected.png'
        },
        children: []
    },
    // {
    //     path: '/approve',
    //     component: Approve,
    //     name: 'approve',
    //     meta: {
    //         name: '审批管理',
    //         icon: 'table'
    //     },
    //     children: [
    //         {
    //             path: 'ApproveRecord',
    //             name: 'approve-Record',
    //             component: ApproveRecord,
    //             meta: {
    //                 name: '审批记录',
    //                 icon: 'table'
    //             }
    //         }
    //     ]
    // },
    {
        id: 7,
        path: '/setting',
        component: Setting,
        name: 'setting',
        meta: {
            name: '系统设置',
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/setting_normal.png',
            checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/setting_selected.png'
        },
        children: [
            {
                id: '7-1',
                path: 'RoleManagement',
                name: 'role-management',
                component: RoleManagement,
                meta: {
                    name: '角色管理',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/role_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/role_selected.png'
                }
            },
            {
                id: '7-2',
                path: 'EmployeeAdmin',
                name: 'employee-admin',
                component: EmployeeAdmin,
                meta: {
                    name: '部门/员工管理',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/department_normal.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/crm/sys/department_selected.png'
                }
            },
            {
                id: '7-3',
                path: '/log',
                name: 'log',
                component: Log,
                meta: {
                    name: '系统日志',
                    cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220505/d41e0226e58b07e8c66f651ec3af3fe3.png',
                    checkCover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220505/f08428f72f3e6501dee5088a7cbd591e.png'
                }
            }
            // {
            //     path: 'BusinessApproval',
            //     name: 'business-approval',
            //     component: BusinessApproval,
            //     meta: {
            //         name: '业务审批',
            //         icon: 'table'
            //     }
            // }
        ]
    }
]

export default dynamicRoutes
