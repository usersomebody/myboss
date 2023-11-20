const payCollectionLevelDefaultData = [{
    id: 1,
    name: '我负责的回款'
}, {
    id: 2,
    name: '我下属负责的回款'
}, {
    id: 3,
    name: '全部的回款'
}]
const paymentCollectionChildRenderData = [ {
    name: '排期主题',
    prop: 'name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '客户报价',
    prop: 'customer_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '客户发票是否已开', // 1是 2否
    prop: 'invoice_get_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '客户是否需要发票', // 1需要 2不需要
    prop: 'invoice_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '需要',
        2: '不需要'
    }
}, {
    name: '媒体成本价',
    prop: 'media_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '排期状态', //1待提交 2审批中 3审批通过 4审批拒绝 5撤销  6已废弃
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '待提交',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '撤销',
        6: '已废弃',
        7: '已投放'
    }
}]
const paymentCollectionRenderData = [{
    name: '客户名称',
    prop: 'customer_name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '回款日期',
    prop: 'receive_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '回款金额',
    prop: 'receive_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '回款方式', //  1支票 2现金 3银行转账 4支付宝 5微信 6其他
    prop: 'receive_type',
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
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '审批状态', //1待提交 2审批中 3审批通过 4审批拒绝 5撤销6已废弃
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '待提交',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '撤销',
        6: '已废弃'
    }
}, {
    name: '回款编号',
    prop: 'receive_num',
    width: '',
    isInput: false,
    fixed: false
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}
// , {
//     name: '客户报价',
//     prop: 'schedule_detail',
//     sProp: 'customer_money',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true
// }, {
//     name: '客户发票是否已开', // 1是 2否
//     prop: 'schedule_detail',
//     sProp: 'invoice_get_status',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true,
//     isJudge: true,
//     judge: {
//         1: '是',
//         2: '否'
//     }
// }, {
//     name: '客户是否需要发票', // 1需要 2不需要
//     prop: 'schedule_detail',
//     sProp: 'invoice_status',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true,
//     isJudge: true,
//     judge: {
//         1: '需要',
//         2: '不需要'
//     }
// }, {
//     name: '媒体成本价',
//     prop: 'schedule_detail',
//     sProp: 'media_money',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true
// }, {
//     name: '排期主题',
//     prop: 'schedule_detail',
//     sProp: 'name',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true
// }, {
//     name: '排期状态', //1待提交 2审批中 3审批通过 4审批拒绝 5撤销  6已废弃
//     prop: 'schedule_detail',
//     sProp: 'type',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isSecond: true,
//     isJudge: true,
//     judge: {
//         1: '待提交',
//         2: '审批中',
//         3: '审批通过',
//         4: '审批拒绝',
//         5: '撤销',
//         6: '已废弃'
//     }
// }
]

const payCollectionSortList = [{
    id: 1,
    name: '创建时间降序'
}, {
    id: 2,
    name: '创建时间升序'
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

const receiveStatus = [{
    id: 1,
    name: '待提交'
}, {
    id: 2,
    name: '审批中'
}, {
    id: 3,
    name: '审批通过'
}, {
    id: 4,
    name: '审批拒绝'
}, {
    id: 5,
    name: '撤销'
}, {
    id: 6,
    name: '已废弃'
}]
export {
    payCollectionLevelDefaultData,
    paymentCollectionChildRenderData,
    paymentCollectionRenderData,
    payCollectionSortList,
    payType,
    receiveStatus
}
