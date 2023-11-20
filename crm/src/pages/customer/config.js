const customerTypeList = [{
    id: 1,
    name: '我负责的客服'
}]
// {
//     name: '客户类型',
//     prop: 'type',
//     width: '',
//     fixed: false,
//     isInput: false
// }
const customerRenderData = [{
    name: '客户名称',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '所有人姓名',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '联系人',
    prop: 'linkman',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: 'QQ账号',
    prop: 'link_qq',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '微信账号',
    prop: 'link_wx',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '行业类型',
    prop: 'business_type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {}
}, {
    name: '客户级别',
    prop: 'level_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '手机号',
    prop: 'phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '省',
    prop: 'province',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '市',
    prop: 'city',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '区',
    prop: 'area',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '详细地址',
    prop: 'address',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '拜访数',
    prop: 'visit_count',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '客户来源',
    prop: 'origin',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {}
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '电话',
    prop: 'tel_phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票抬头',
    prop: 'invoice_title',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票账户',
    prop: 'invoice_account',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开户行',
    prop: 'invoice_bank',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票税号',
    prop: 'invoice_tax',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票地址',
    prop: 'invoice_tax',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票电话',
    prop: 'invoice_phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '发票邮寄信息',
    prop: 'invoice_to_address',
    width: '',
    fixed: false,
    isInput: false
}]

// , {
//     name: '行业名称',
//     prop: 'business_name',
//     width: '',
//     fixed: false,
//     isInput: false
// }

const contactsRenderData = [{
    name: '姓名',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '公司名称',
    prop: 'customer_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '电话',
    prop: 'tel_phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '手机',
    prop: 'phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '电子邮件',
    prop: 'email',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建日期',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '微信',
    prop: 'wx_code',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: 'QQ',
    prop: 'qq_code',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '关系程度',
    prop: 'relation',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,//关系程度 1亲密 2熟悉 3普通 4陌生 5破裂
    judge: {
        1: '亲密',
        2: '熟悉',
        3: '普通',
        4: '陌生',
        5: '破裂'
    }
}, {
    name: '常驻地址',
    prop: 'address',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '性别',
    prop: 'sex',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '未知',
        1: '男',
        2: '女'
    }
}, {
    name: '免打扰',
    prop: 'disturb',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '关闭',
        2: '开启'
    }
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '出生日期',
    prop: 'birthday_name',
    width: '',
    fixed: false,
    isInput: false
}]

const customerSortList = [{
    id: 1,
    name: '创建时间降序'
}, {
    id: 2,
    name: '创建时间升序'
}]

const customerLevel = [{
    id: 1,
    name: '(A)重点客户'
}, {
    id: 2,
    name: '(B)普通客户'
}, {
    id: 3,
    name: '(C)非优先客户'
}]

const relationList = [{
    id: 1,
    name: '亲密'
}, {
    id: 2,
    name: '熟悉'
}, {
    id: 3,
    name: '普通'
}, {
    id: 4,
    name: '陌生'
}, {
    id: 5,
    name: '破裂'
}]
// 类型 1客户公司行业类型 2我司主体公司名称 3我司开票公司 4媒体属性 5客户来源
const customerLevelDefaultData = [{
    id: 1,
    name: '我负责的客户'
}, {
    id: 2,
    name: '我下属负责的客户'
}, {
    id: 3,
    name: '全部的客户'
}]

const contactsLevelDefaultData = [{
    id: 1,
    name: '我负责的联系人'
}, {
    id: 2,
    name: '我下属负责的联系人'
}, {
    id: 3,
    name: '全部的联系人'
}]
export {
    customerSortList,
    customerTypeList,
    customerRenderData,
    contactsRenderData,
    customerLevel,
    relationList,
    customerLevelDefaultData,
    contactsLevelDefaultData
}
