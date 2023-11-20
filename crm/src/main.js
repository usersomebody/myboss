import Vue from 'vue'
import App from '@/App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import store from '@/store/index'
import router from '@/router/index'

import axios from './config/httpConfig'
import * as globalFilter from './filters/filters'
// import * as echarts from 'echarts'
import '@/icons'

Vue.prototype.$http = axios

for (var key in globalFilter) {
    Vue.filter(key, globalFilter[key])
}

Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (!store.state.UserToken) {
        if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
            next()
        } else {
            next({ path: '/login' })
        }
    } else {
        // TOKEN存在验证用户登录信息是否有效
        if (!store.state.permission.permissionList) {
            store.dispatch('permission/FETCH_PERMISSION').then(() => {
                next({ path: to.path })
            })
        } else {
            if (to.path !== '/login') {
                next()
            } else {
                next(from.fullPath)
            }
        }
    }
})

router.afterEach((to, from, next) => {
    var routerList = to.matched
    console.log('routerList', routerList)
    store.commit('setCrumbList', routerList)
    store.commit('permission/SET_CURRENT_MENU', to.name)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
