const customerTypeList = [{
    id: 1,
    name: '我负责的客服'
}]

const contractTableRenderData = [{
    name: '主题',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '客户名称',
    prop: 'customer_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '合同开始日期',
    prop: 'start_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '结束日期',
    prop: 'end_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '总金额',
    prop: 'money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '合同状态',//合同状态 1执行中 2结束 3意外终止
    prop: 'contract_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '执行中',
        2: '结束',
        3: '意外终止'
    }
}, {
    name: '所有人',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '签约日期',
    prop: 'sign_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '合同类型',
    prop: 'contract_type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {}
}, {
    name: '合同编号',
    prop: 'contract_num',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '付款方式', // 1支票 2现金 3银行转账 4支付宝 5微信 6其他
    prop: 'pay_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '支票',
        2: '现金',
        3: '银行转账',
        4: '支付宝',
        5: '微信',
        6: '其他'
    }
}, {
    name: '我方签约人',
    prop: 'company_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}]
const contractStatus = [{
    id: 1,
    name: '执行中'
}, {
    id: 2,
    name: '结束'
}, {
    id: 3,
    name: '意外终止'
}]

const payType = [{
    id: 1,
    name: '支票'
}, {
    id: 2,
    name: '现金'
}, {
    id: 3,
    name: '银行转账'
}, {
    id: 4,
    name: '支付宝'
}, {
    id: 5,
    name: '微信'
}, {
    id: 6,
    name: '其他'
}]

const contractSortList = [{
    id: 1,
    name: '创建时间降序'
}, {
    id: 2,
    name: '创建时间升序'
}]

const contactLevelDefaultData = [{
    id: 1,
    name: '我负责的合同'
}, {
    id: 2,
    name: '我下属负责的合同'
}, {
    id: 3,
    name: '全部的合同'
}]
export {
    customerTypeList,
    contractStatus,
    payType,
    contractTableRenderData,
    contractSortList,
    contactLevelDefaultData
}
