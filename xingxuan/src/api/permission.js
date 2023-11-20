import axios from '@/config/httpConfig'

// 获取视频分类列表
export function getVideoList(param) {
    return axios.post('/goods/video_list', param)
}
// 登录
export function login(param, options) {
    return axios.post('/account/login', param, options)
}
// 授权
export function getAuthUrl(param) {
    return axios.post('/account/auth', param)
}
// 绑定门店
export function bindStore(param, options) {
    return axios.post('/store_bind', param, options)
}
// 门店列表
export function storeList(param) {
    return axios.post('/store_list', param)
}
// 获取平台信息
export function getPlatformInfo(param) {
    return axios.post('/system_get', param)
}
// 修改平台信息
export function editPlatformInfo(param) {
    return axios.post('/system_edit', param)
}
// 商品类目
export function getCateList(param) {
    return axios.post('/cate_list', param)
}
// 商品列表
export function getProductList(param) {
    return axios.post('/shop_list', param)
}
// 联盟商品列表
export function getLeagueList(param) {
    return axios.post('/shop_find', param)
}
// 商品绑定
export function bindLeagueProduct(param) {
    return axios.post('/shop_bind', param)
}
// 平台操作商品
export function actionProducts(param) {
    return axios.post('/system_check_shop', param)
}
// 商品设置领样
export function productSetStock(param) {
    return axios.post('/account_sample_shop', param)
}
// 商家设置领样规则
export function productSetRule(param) {
    return axios.post('/account_check_shop', param)
}
// 商家商品重新审核
export function productSetSampleRest(param) {
    return axios.post('/account_deal_shop', param)
}
// 活动列表
export function activityList(param) {
    return axios.post('/activity_list', param)
}
// 活动列表
export function activityAdd(param) {
    return axios.post('/activity_add', param)
}
// 活动列表
export function activityEdit(param) {
    return axios.post('/activity_edit', param)
}
// 活动列表
export function activityAction(param) {
    return axios.post('/activity_deal', param)
}
// 商品导入是否需要自动审核
export function isAutoCheck(param) {
    return axios.post('/store_check', param)
}
// 推客列表
export function getPromoterList(param) {
    return axios.post('/promoter_list', param)
}
// 推客订单
export function getPromoterOrder(param) {
    return axios.post('/promoter_order_list', param)
}
// 店铺列表 不分页
export function getAllStore(param) {
    return axios.post('/store_all', param)
}
// 提现列表
export function getWithdrawList(param) {
    return axios.post('/withdraw_list', param)
}
// 提现处理
export function withdrawCheck(param) {
    return axios.post('/withdraw_check', param)
}
// 账户列表
export function accountList(param) {
    return axios.post('/store_balance', param)
}
// 提现二维码
export function storeQrCode(param) {
    return axios.post('/store_qr', param)
}
// 订单列表
export function shopOrderList(param) {
    return axios.post('/store_order_list', param)
}
// 订单详情
export function shopOrderDetail(param) {
    return axios.post('/store_order_detail', param)
}
// 操作订单
export function actionShopOrder(param) {
    return axios.post('/store_order_check', param)
}
// 批量发货
export function bulkShipment(param, options) {
    return axios.post('/store_order_multi', param, options)
}
// 快递公司
export function getAllExpress(param) {
    return axios.post('/comm/getExpress', param)
}
// 修改商家
export function accountEdit(param) {
    return axios.post('/account_edit', param)
}
// 新建商户
export function accountAdd(param) {
    return axios.post('/account_add', param)
}
// 修改物流
export function updateExpress(param) {
    return axios.post('/store_edit_express', param)
}
// h5-TO-Min
export function getTOMiniUrl(param) {
    return axios.post('/comm/getUrlScheme', param)
}
// 客户列表
export function getCustomerList(param) {
    return axios.post('/admin/customer/customer_list', param)
}
