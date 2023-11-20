import { fetchPermission } from '@/api/permission'
import router, { DynamicRoutes } from '@/router/index'
import { recursionRouter } from '@/utils/recursion-router'
import dynamicRouter from '@/router/dynamic-router'

export default {
    namespaced: true,
    state: {
        permissionList: null /** 所有路由 */,
        sidebarMenu: [] /** 导航菜单 */,
        currentMenu: '' /** 当前active导航菜单 */,
        control_list: [] /** 完整的权限列表 */,
        avatar: ''/** 头像 */,
        account: ''/** 用户角色 */,
        btn_permission: []/** 页面按钮权限 */,
        userData: {}/** 用户展示数据 */
    },
    getters: {},
    mutations: {
        SET_AVATAR(state, avatar) {
            state.avatar = avatar
        },
        SET_ACCOUNT(state, account) {
            state.account = account
        },
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
        CLEAR_PERMISSION(state) {
            state.permissionList = null
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        SET_CURRENT_MENU(state, currentMenu) {
            state.currentMenu = currentMenu
        },
        SET_CONTROL_LIST(state, list) {
            state.control_list = list
        },
        SET_BTN_PERMISSION(state, data) {
            state.btn_permission = data // url_type 1列表 2添加 3修改 4删除
        },
        SET_USER_DATA(state, data) {
            state.userData = data
        }
    },
    actions: {
        async FETCH_PERMISSION({ commit, state }) {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            // let permissionList = await fetchPermission()
            let permission = userInfo.permission.map((item) => {
                return item.path
            })
            commit('SET_USER_DATA', userInfo)
            commit('SET_BTN_PERMISSION', userInfo.permission)
            commit('SET_AVATAR', userInfo.avatar)
            commit('SET_ACCOUNT', userInfo.name)
            let routes = recursionRouter(permission || [], dynamicRouter)
            let MainContainer = DynamicRoutes.find(v => v.path === '')
            let children = MainContainer.children
            commit('SET_CONTROL_LIST', [...children, ...dynamicRouter])
            children.push(...routes)
            commit('SET_MENU', children)
            let initialRoutes = router.options.routes
            DynamicRoutes[0].redirect = userInfo.permission.length ? userInfo.permission[0].vue_route : '/home'
            console.log('DynamicRoutes', DynamicRoutes)
            router.addRoutes(DynamicRoutes)
            commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        }
    }
}
