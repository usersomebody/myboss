let isDev = window.location.host.indexOf('test') > -1 || window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('192.168') > -1 ? true : false
const baseURL = isDev ? 'http://test.crm.mnancheng.com:10001' : 'http://crm.mnancheng.com:10001'
const uploadUrl = isDev ? 'https://test.yoga.mnancheng.com' : 'https://yoga.mnancheng.com'
// 192.168.2.16：8080
export {
    baseURL,
    uploadUrl
}
