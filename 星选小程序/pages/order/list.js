import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { statusMap, orderStatusList } from '../../utils/statusMap.js'
import { accDiv } from '../../utils/common.js'
const { order_list, user_order_check, unified_order, express_info } = api
const app = getApp()
Page({
    data:{
        sampleTypeList: [{
            id: 1,
            name: '免费领样'
        }, {
            id: 2,
            name: '成本购样'
        }],
        statusList: [{
            id: 0,
            name: '全部'
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
        }],
        orderList:[{
            id: 1,
            store_cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            store_name: '店铺名称',
            status: 2,
            product_cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            product_name: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
            product_price: '99.99',
            orderTotal: 100,
        }],
        steps:[],
        page: 1,
        count: 10,
        totalCount: 0,
        isLast: true,
        statusMap,
        sampleType: 1,
        statusId:0,
        logisticsShow: false,
        expressInfo: {}
    },
    onLoad(options){
        let statusList = options.type == 1 ? orderStatusList.filter((item)=>{
            return item.id != 1
        }) : orderStatusList
        this.setData({
            sampleType: options.type || 1,
            statusId: options.id || 0,
            statusList
        })

    },
    onShow(){
        this.initOrderList()
        this.getList(this.contactList)
    },
    initOrderList(){
        this.setData({
            orderList:[],
            page:1,
            isLast:false,
            totalCount: 0
        })
    },
    switchSample(e){
        const { id } = e.currentTarget.dataset
        let statusList = id == 1 ? orderStatusList.filter((item)=>{
            return item.id != 1
        }) : orderStatusList
        this.setData({
            sampleType: id,
            statusList,
        })
        this.initOrderList()
        this.getList(this.contactList)
    },
    switchOrderStatus(e){
        const { id } = e.currentTarget.dataset
        this.setData({
            statusId: id
        }) 
        this.initOrderList()
        this.getList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getList(this.contactList)
    },
    getList(callback){
        const { page, count, sampleType, statusId } = this.data
        const that = this
        request({
          url:  baseUrl + order_list,
          data: {
            status:statusId,
            order_type:sampleType,
            page,
            limit:count,
          },
          isTologin:true,
          method:'POST',
          success:res => {
            res.list.forEach((item)=>{
                item.product_info.min_price_float = accDiv(item.product_info.min_price, 100)
            })
            if (callback) callback(res.list)
            this.setData({
                orderList: this.data.orderList,
                totalCount: res.total
            })
            if (isLast(page, this.data.totalCount, count)) {
                this.setData({
                    isLast: true
                })
            }else{
                this.setData({
                    isLast: false
                })
            }
            this.setData({
              loading: false
            })
          },
          refreshToken(){
            that.getList(this.contactList)
          }
        }).catch((err)=>{
            this.setData({
                isLast: true
            })
        })
    },
    contactList(list) {
        this.data.orderList = this.data.orderList.concat(list)
    },
    actionOrder(e){
        const { id, orderid, expresscode, expresssn,  } = e.currentTarget.dataset
        const { logisticsShow } = this.data
        // 1 取消订单 2 去付款 3 查看物流 4 确认收货
        if(id == 1){
            wx.showModal({
                title:'确认取消订单',
                success:(res)=>{
                    if(res.confirm){
                        // 调接口
                        this.orderAction(orderid,5).then(()=>{
                            wx.showModal({
                                title:'操作成功'
                            })
                            this.initOrderList()
                            this.getList(this.contactList)
                        })
                    }
                }
            })
            return
        }

        if(id == 2){
            this.orderCreated(orderid)
            return
        }

        if(id == 3){
            this.getExpressInfo(expresscode, expresssn)
            return
        }

        if(id == 4){
            this.orderAction(orderid,4).then(()=>{
                wx.showModal({
                    title:'操作成功',
                    showCancel: false,
                })
                this.initOrderList()
                this.getList(this.contactList)
            })
            return
        }
    },
    toggleLogisticsSheet(){
        const { logisticsShow } = this.data
        this.setData({
            logisticsShow: !logisticsShow
        })
    },
    godetail(e){
        const { id, ordersn } = e.currentTarget.dataset
        wx.navigateTo({
            url:'/pages/order/detail?id=' + ordersn
        })
    },
    // 取消订单 确认收货
    orderAction(orderid,type){
        const that = this
        return new Promise((resolve,reject)=>{
            const { orderId } = this.data
            request({
              url:  baseUrl + user_order_check,
              data: {
                type:type,
                order_sn: orderid
              },
              isTologin:true,
              method:'POST',
              success:res => {
                resolve(res)
              },
              refreshToken(){
                that.orderAction(orderid,type)
              }
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    // 去付款
    orderCreated(orderid,type){
            let that = this
            wx.login({
                success(res){
                    if(res.code){
                        request({
                            url:  baseUrl + unified_order,
                            data: {
                              order_sn: orderid
                            },
                            isTologin:true,
                            method:'POST',
                            success:res => {
                                const { appid, timestamp, nonceStr, prepay_id, paySign } = res
                                wx.showLoading({
                                    title: '正在支付中...',
                                })
                                wx.requestPayment({
                                    'appId':`${appid}`,
                                    'timeStamp': `${timestamp}`,
                                    'nonceStr': nonceStr,
                                    'package': `prepay_id=${prepay_id}`,
                                    'signType': 'MD5',
                                    'paySign': paySign,
                                    'success'() {
                                        that.paySuccessCallback();
                                    },
                                    complete(result) {
                                        console.log('result',result)
                                        wx.hideLoading()
                                        if (result.errMsg == 'requestPayment:ok') {
                                            //清空产品数据
                                            app.globalData.confirmOrder = {};
                                            return
                                        }
                                        that.cancelPay(result)
                                    }
                                })
                            }
                          }).catch((err)=>{
              
                          })
                    }
                }
            })
            
    },
    //  取消支付
    cancelPay(res) {
        let that = this
        if (res.isPayFail || res.errMsg == 'requestPayment:fail cancel' || res.errMsg == 'requestPayment:cancel' || /^requestPayment:fail connect ETIMEDOUT/.test(res.errMsg)) {
        wx.showModal({
            title: '订单未支付',
            // content: '订单会保留一段时间，请尽快完成支付',
            showCancel: false,
            success() {
            //清空产品数据
            app.globalData.confirmOrder = {};
            // wx.redirectTo({
            //   url: router('orderList')
            // })
            }
        })
        }
    },
    paySuccessCallback() {
        wx.hideLoading();
        wx.showToast({
            title:'支付完成'
        })
        this.initOrderList()
        this.getList(this.contactList)
    },
    getExpressInfo(express_code, expresssn){
        const that = this
        const { logisticsShow  } = this.data
        request({
            url:  baseUrl + express_info,
            data: {
              express_code,
              expresssn
            },
            isTologin:true,
            method:'POST',
            success:res => {
                let steps = res.data.map((item)=>{
                    let obj = {
                        text:`${item.status} ${item.ftime}`,
                        desc:`${item.context}`
                    }
                    return obj 
                })
                res.expressInfo.expresssn = expresssn
                this.setData({
                    logisticsShow: !logisticsShow,
                    steps,
                    expressInfo: res.expressInfo
                })
            },
            refreshToken(){
                that.getExpressInfo(express_code, expresssn)
            }
          }).catch((err)=>{

          })
    },
    // 复制剪贴
    clipboardText(e){
        const { text } = e.currentTarget.dataset
        wx.setClipboardData({
            data: text,
            success (res) {
              
            }
        })
    },
})