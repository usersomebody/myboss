import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { statusMap, orderStatusList } from '../../utils/statusMap.js'
const { user_order_check, unified_order, order_detail, express_info } = api
const app = getApp()
Page({
    data:{
        orderInfo:{
            id: 1,
            store_cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            store_name: '店铺名称',
            status: 3,
            product_cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            product_name: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称',
            product_price: '99.99',
            orderTotal: 100,
            sampleType:2
        },
        statusMap,
        logisticsShow: false,
        stepActive: 1,
        steps: [
            {
              text: '步骤一',
              desc: '描述信息'
            },
            {
              text: '步骤二',
              desc: '描述信息'
            },
            {
              text: '步骤三',
              desc: '描述信息'
            },
            {
              text: '步骤四',
              desc: '描述信息'
            },
        ],
        iPhonex: false,
        expressInfo: {},
        orderId: '',
        shopInfo: {},
        orderInfo: {},
        isInOrderTime: false,
        now_time: '',
        end_time: '',
        closeTypeStatus: {
            1:'用户自主取消',
            2:'商户拒绝而取消',
            3:'支付超时而取消'
        }
    },
    onLoad(options){
        this.setData({
            statusBarHeight:app.globalData.statusBarHeight,
            iPhonex:app.globalData.isIphoneX || false,
            orderId: options.id || ''
        })
        this.getDetail()
    },
    onShow(){
        this.getDetail()
    },
    getDetail(){
        const { orderId } = this.data
        const that = this
        request({
            url:  baseUrl + order_detail,
            data: {
                order_sn: orderId,
            },
            isTologin:true,
            method:'POST',
            success:res => {
                console.log('orderInfo', res)
                let end_time = res.order_info.info.order_close_time * 1000
                let now_time = new Date().getTime()

                this.setData({
                    orderInfo: res.order_info,
                    shopInfo: res.shop_info,
                    end_time,
                    now_time,
                    isInOrderTime: this.calculateInOrderTime(end_time, now_time)
                })
            },
            refreshToken(){
                that.getDetail()
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
    updateAddress(){
        const { orderId } = this.data
        wx.navigateTo({
            url: '/pages/address/list?linkType=' + orderId
        })
    },
    actionOrder(e){
        const { logisticsShow, orderInfo, orderId } = this.data
        const { id } = e.currentTarget.dataset
        // 1 取消订单 2 去付款 3 查看物流 4 确认收货
        if(id == 1){
            wx.showModal({
                title:'确认取消订单',
                success:(res)=>{
                    if(res.confirm){
                        // 调接口
                        this.orderAction(5).then(()=>{
                            wx.showModal({
                                title:'操作成功'
                            })
                            this.getDetail()
                        })
                    }
                }
            })
            return
        }

        if(id == 2){
            this.orderCreated()
            return
        }

        if(id == 3){
            this.getExpressInfo(orderInfo.express_info.express_code, orderInfo.express_info.expresssn)
            return
        }

        if(id == 4){
            this.orderAction(4).then(()=>{
                wx.showModal({
                    title:'操作成功'
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
    orderAction(type){
        const that = this
        return new Promise((resolve,reject)=>{
            const { orderId } = this.data
            request({
              url:  baseUrl + user_order_check,
              data: {
                type:type,
                order_sn: orderId
              },
              isTologin:true,
              method:'POST',
              success:res => {
                resolve(res)
              },
              refreshToken(){
                that.orderAction(type)
              }
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    // 去付款
    orderCreated(type){
        const { orderId } = this.data
        let that = this
        wx.login({
            success(res){
                if(res.code){
                    request({
                        url:  baseUrl + unified_order,
                        data: {
                          order_sn: orderId
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
        this.getDetail()
    },
    getExpressInfo(express_code, expresssn){
        const { logisticsShow  } = this.data
        const that = this
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
                    expressInfo:res.expressInfo
                })
            },
            refreshToken(){
                that.getExpressInfo(express_code, expresssn)
            }
          }).catch((err)=>{

          })
    },
    back(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    updateOrderStatus(){
        this.getDetail()
    },
    calculateInOrderTime(end_time, now_time){
        //数据不存在
        if(!end_time){
            return
        }
        //活动期间
        let isActivityTime = now_time < end_time
        console.log('isActivityTime',isActivityTime)
        return isActivityTime
    },
})