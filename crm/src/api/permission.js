import axios from '@/config/httpConfig'

export function fetchPermission() {
    return { avatar: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220117/bf424cb7b0dea050a42b9739eb261a3a.png', name: '123', data: [] }
    // return axios.get('/user/info')
}
// 获取分类数据
export function getVideoType() {
    return axios.get('/goods/cate_list')
}

// 获取视频分类列表
export function getVideoList(param) {
    return axios.post('/goods/video_list', param)
}

// 获取商品分类列表
export function getGoodsList(param) {
    return axios.post('/goods/goods_list', param)
}

// 登录
export function login(data) {
    return axios.post('/user/login', data)
}

// 客户列表
export function getCustomerList(param) {
    return axios.post('/admin/customer/customer_list', param)
}

//添加客户
export function addCustomer(param) {
    return axios.post('/admin/customer/customer_add', param)
}

//修改客户
export function editCustomer(param) {
    return axios.post('/admin/customer/customer_edit', param)
}

//删除客户
export function delCustomer(param) {
    return axios.post('/admin/customer/customer_del', param)
}

// 客户添加确认
export function addconfirmCustomer(param) {
    return axios.post('/admin/customer/customer_addconfirm', param)
}

// select配置列表
export function selectConfigType(param) {
    return axios.post('/admin/customer/customer_config', param)
}

// 用户列表
export function userList(param) {
    return axios.post('/admin/user/user_list', param)
}

// 联系人列表contacts-list
export function getContactsList(param) {
    return axios.post('/admin/linkman/linkman_list', param)
}

// 联系人修改
export function editContacts(param) {
    return axios.post('/admin/linkman/linkman_edit', param)
}

// 联系人添加
export function addContacts(param) {
    return axios.post('/admin/linkman/linkman_add', param)
}

// 联系人删除
export function delContacts(param) {
    return axios.post('/admin/linkman/linkman_del', param)
}

// 媒体资源列表
export function getMediaList(param) {
    return axios.post('/admin/media/media_list', param)
}

// 媒体资源添加
export function addMedia(param) {
    return axios.post('/admin/media/media_add', param)
}

// 媒体资源修改
export function editMedia(param) {
    return axios.post('/admin/media/media_edit', param)
}

// 媒体资源删除
export function delMedia(param) {
    return axios.post('/admin/media/media_del', param)
}

// 获取查询的分类等级
export function typeLevel(param) {
    return axios.post('/admin/user/user_search_type', param)
}

// 所有人
export function allPerson(param) {
    return axios.post('/admin/user/user_list_search', param)
}

// 排期列表
export function scheduleList(param) {
    return axios.post('/admin/schedule/schedule_list', param)
}

// 排期添加
export function scheduleAdd(param) {
    return axios.post('/admin/schedule/schedule_add', param)
}

// 排期修改
export function scheduleEdit(param) {
    return axios.post('/admin/schedule/schedule_edit', param)
}

// 排期删除
export function scheduleDel(param) {
    return axios.post('/admin/schedule/schedule_del', param)
}

// 渠道付款申请列表
export function paymentList(param) {
    return axios.post('/admin/payment/payment_list', param)
}

// 渠道付款申请添加
export function paymentAdd(param) {
    return axios.post('/admin/payment/payment_add', param)
}

// 渠道付款申请编辑
export function paymentEdit(param) {
    return axios.post('/admin/payment/payment_edit', param)
}

// 渠道付款申请删除
export function paymentDel(param) {
    return axios.post('/admin/payment/payment_del', param)
}

// 渠道付款账号列表
export function paymentAccountList(param) {
    return axios.post('/admin/payment/payment_account_list', param)
}

// 渠道付款账号添加
export function paymentAccountAdd(param) {
    return axios.post('/admin/payment/payment_account_add', param)
}

// 渠道付款账号添加
export function paymentAccountEdit(param) {
    return axios.post('/admin/payment/payment_account_edit', param)
}

// 渠道付款账号删除
export function paymentAccountDel(param) {
    return axios.post('/admin/payment/payment_account_del', param)
}

// 排期开票列表
export function invoiceList(param) {
    return axios.post('/admin/invoice/invoice_list', param)
}

// 排期开票添加
export function invoiceAdd(param) {
    return axios.post('/admin/invoice/invoice_add', param)
}

// 排期开票修改
export function invoiceEdit(param) {
    return axios.post('/admin/invoice/invoice_edit', param)
}

// 排期开票删除
export function invoiceDel(param) {
    return axios.post('/admin/invoice/invoice_del', param)
}

// 合同列表
export function contractList(param) {
    return axios.post('/admin/contract/contract_list', param)
}

// 合同添加
export function contractAdd(param) {
    return axios.post('/admin/contract/contract_add', param)
}

// 合同修改
export function contractEdit(param) {
    return axios.post('/admin/contract/contract_edit', param)
}

// 合同删除
export function contractDel(param) {
    return axios.post('/admin/contract/contract_del', param)
}

// 回款列表
export function receiveList(param) {
    return axios.post('/admin/receive/receive_list', param)
}

// 回款添加
export function receiveAdd(param) {
    return axios.post('/admin/receive/receive_add', param)
}

// 回款修改
export function receiveEdit(param) {
    return axios.post('/admin/receive/receive_edit', param)
}

// 回款删除
export function receiveDel(param) {
    return axios.post('/admin/receive/receive_del', param)
}

// 角色列表
export function roleList(param) {
    return axios.post('/admin/role/role', param)
}

// 所有权限
export function getAllAuth(param) {
    return axios.post('/admin/role/auth', param)
}

// 修改权限
export function editAuth(param) {
    return axios.post('/admin/role/edit_auth', param)
}

export function chooseRole(param) {
    return axios.post('/admin/role/choose_role', param)
}

// 删除员工
export function delRole(param) {
    return axios.post('/admin/user/user_del', param)
}

// 系统日志
export function systemLog(param) {
    return axios.post('/admin/user/user_log', param)
}

// 添加管理员
export function addAdminMember(param) {
    return axios.post('/admin/user/user_add', param)
}

// 获取所有部门
export function allDepartment(param) {
    return axios.post('/admin/user/department_list', param)
}

// 获取省
export function getProvince(param) {
    return axios.post('/user/code_list', param)
}

// 修改用户信息
export function updateUserInfo(param) {
    return axios.post('/admin/user/user_edit', param)
}
// 修改密码
export function updatePassword(param) {
    return axios.post('/admin/user/user_edit_password', param)
}
// 获取所有部门
export function getDepartmentList(param) {
    return axios.post('/admin/dingding/department', param)
}
// 获取部门下面的员工
export function getDepartmentUser(param) {
    return axios.post('/admin/dingding/department_user', param)
}
// 获取首页数据
export function getHomeData(param) {
    return axios.post('/admin/index/index', param)
}
// 渠道开票列表
export function getChannelInvoiceList(param) {
    return axios.post('/admin/channel/channel_invoice_list', param)
}
// 新增渠道开票
export function addChannelInvoice(param) {
    return axios.post('/admin/channel/channel_invoice_add', param)
}
// 修改渠道开票
export function editChannelInvoice(param) {
    return axios.post('/admin/channel/channel_invoice_edit', param)
}
// 渠道开票删除
export function delChannelInvoice(param) {
    return axios.post('/admin/channel/channel_invoice_del', param)
}
export function testList() {
    return {
        data: [{
            id: 1,
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 8
        }, {
            id: 2,
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 8
        }]
    }
    // return axios.get('/user/info')
}
