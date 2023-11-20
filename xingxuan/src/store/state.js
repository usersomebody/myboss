export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    get UserInfo() {
        return localStorage.getItem('userInfo')
    },
    set UserInfo(value) {
        localStorage.setItem('userInfo', JSON.stringify(value))
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false,
    /* 面包屑导航列表 */
    crumbList: []
}
