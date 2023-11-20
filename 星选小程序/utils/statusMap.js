const statusMap = {
    1:{
        name: '待支付',
        action: [{
            id: 1,
            name: '取消订单',
            hasBg: 2,
        }, {
            id: 2,
            name: '去付款',
            hasBg: 1,
        }]
    },
    2:{
        name: '待发货',
        action: [{
            id: 1,
            name: '取消订单',
            hasBg: 2,
        }]
    },
    3:{
        name: '待收货',
        action: [{
            id: 3,
            name: '查看物流',
            hasBg: 2,
        }, {
            id: 4,
            name: '确认收货',
            hasBg: 1,
        }]
    },
    4:{
        name: '已完成',
        action: [{
            id: 3,
            name: '查看物流',
            hasBg: 2,
        }]
    },
    5:{
        name: '已取消',
        action: []
    }
}
const orderStatusList = [{
    id: 0,
    name: '全部'
}, {
    id: 1,
    name: '待支付'
}, {
    id: 2,
    name: '待发货'
}, {
    id: 3,
    name: '待收货'
}, {
    id: 4,
    name: '已完成'
}, {
    id: 5,
    name: '已取消'
}]
export {
    statusMap,
    orderStatusList
}
