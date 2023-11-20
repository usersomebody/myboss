let isDev = window.location.host.indexOf('test') > -1 || window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('192.168') > -1 ? true : false
const baseURL = isDev ? 'https://test.api.xingxuan.mnancheng.com' : 'https://api.xingxuan.mnancheng.com'
// const baseURL = isDev ? '192.168.2.195:8082' : 'https://xingxuan.mnancheng.com' //后台本地 拦截调试
const uploadUrl = isDev ? 'https://test.yoga.mnancheng.com' : 'https://yoga.mnancheng.com'
// 192.168.2.16：8080
export {
    baseURL,
    uploadUrl,
    isDev
}
