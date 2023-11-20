let isDev = false
// baseUrl:'https://yoga.mnancheng.com',//正式
//baseUrl:'https://yg.mnancheng.com'
const baseUrl = isDev ? 'https://test.api.xingxuan.mnancheng.com' : 'https://api.xingxuan.mnancheng.com'
const api = {
    wx_login: '/user/wx_login',
    product_list: '/applet/getProductList', //首页产品数据
    index_banner:'/applet/activity_list',//首页banner数据
    theme_list: '/applet/getActivityVenueDetails',//活动专区数据
    store_product_list: '/applet/getStoreProduct',//商户商品列表
    cate_list: '/cate_list',// 获取类目
    updateUserInfo: '/applet/updateUserInfo',// 修改用户基本信息
    product_detail: '/applet/getProductDetails',// 产品详情
    promoter_list: '/applet/getPromoterListToApplet',//推客列表
    checkProductStatus: '/applet/checkProductStatus',//验证产品是否还在联盟库
    user_center: '/applet/getUserCenter',//用户个人中心
    // 地址相关
    get_pca_all: '/comm/getPcaAll',//获取所有地区地址
    get_pca:'/comm/getPca',// 获取省市区 （不调取）
    get_default_address: '/applet/getDefAddressInfo', //获取默认地址
    get_address_detail: '/applet/getAddressInfo', //获取地址详情
    get_address_list: '/applet/address_list', //获取地址列表
    del_address: '/applet/address_del', //删除地址
    edit_address: '/applet/address_edit', //编辑地址
    add_address: '/applet/address_add', //添加地址
    set_default_address: '/applet/address_isDef',//设置默认地址 （不调取）
    // 提现
    store_info: '/applet/getStoreInfo',// 商户基本信息
    withdraw_apply: '/applet/withdrawApply',//提现申请

    // 客服
    system_service: '/applet/system_get',//客服
    promoter_order_num: '/applet/getPromoterOrderNum',//推客下单验证
    // 推客授权
    promoter_auth: '/account/auth',

    // 订单
    create_order: '/applet/createOrder', //微信统一下单
    unified_order: '/applet/unifiedOrder', // 待支付订单 重新下单
    order_list: '/applet/getOrderList', // 订单列表
    modify_address: '/applet/modifyAddress',// 修改地址
    user_order_check: '/applet/userOrderCheck', // 订单操作
    order_detail: '/applet/getOrderDetails', // 订单详情

    // 物流
    express_info: '/comm/queryExpressInfo'
}
export {
    api,
    baseUrl,
    isDev
}