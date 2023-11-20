const miniStoreList = [{
    id: 1,
    name: '全部'
}, {
    id: 2,
    name: '部分'
}]
const statusMap = [{
    id: 2,
    name: '未认证'
}, {
    id: 1,
    name: '已认证'
}]
const approveStatusMap = {
    1: {
        id: 1,
        name: '待审核'
    },
    2: {
        id: 2,
        name: '审核通过'
    },
    3: {
        id: 3,
        name: '审核拒绝'
    }
}

const goodsRenderList = [{
    name: '商品名称',
    prop: 'title',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: 'SupId',
    prop: 'product_id',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '价格',
    prop: 'min_price_float',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '佣金',
    prop: 'commission_value_float',
    width: '',
    fixed: false,
    isInput: false
}]

const selfGoodsRenderList = [{
    name: '商品名称',
    prop: 'title',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: 'SupId',
    prop: 'product_id',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '价格',
    prop: 'min_price_float',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '销量',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '佣金',
    prop: 'commission_value_float',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '操作',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false,
    isAction: true
}]
export {
    miniStoreList,
    statusMap,
    approveStatusMap,
    goodsRenderList,
    selfGoodsRenderList
}
