

import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { getStorageSync } from '../../utils/storageSync.js'
import { login, isLogin,
    isUserProfileAuthed,
    invokeUserProfileAuth } from '../../utils/auth.js'
import { promiseAuthedCallback } from '../../utils/userInfo.js'
import { accSub } from '../../utils/common.js'
const { promoter_list, get_default_address, create_order, promoter_order_num } = api
const app = getApp()
Page({
    data:{
        productInfo:{

        },
        addressInfo:{},
        pushRadio: '',
        textValue: '',
        promoterList: [],
        iPhonex: false,
        optimizationPrice: '',
        disableBtn: false
    },
    onLoad(){
        // 关于地址
        // 如果本地存贮没有数据就用默认 如果本地存储有数据永远取本地存储  页面进入拉取默认地址数据 同时更新本地存贮的地址数据 下单成功或者回到首页或者订单列表 直接清除存贮 产品详情和地址详情的数据
        let productInfo = getStorageSync('productDetail')
        this.setData({
            statusBarHeight:app.globalData.statusBarHeight,
            iPhonex:app.globalData.isIphoneX || false,
            productInfo: productInfo,
            optimizationPrice: accSub(productInfo.min_price, productInfo.buy_price_float)
        })
        wx.setNavigationBarTitle({
            title: this.data.productInfo.leadSample == 1 ? '成本领样' : '免费领样'
        })
    },
    onShow(){
        login(()=>{
            this.get_default_address()
            this.getPromoterList()
        })
        if (!isUserProfileAuthed()) {
            invokeUserProfileAuth();
        }
    },
    // 获取推客列表
    getPromoterList(){
        const that = this
        request({
            url:  baseUrl + promoter_list,
            data: {
                limit: 20
            },
            isTologin:true,
            method:'POST',
            success:res => {
                if(!res.list.length){
                    wx.showModal({
                        title: '提示',
                        content:'没有授权的推客账号',
                        showCancel: false,
                        success:res=>{
                            wx.redirectTo({
                                url: '/pages/pushCustomers/index'
                            })
                        }
                    })
                    return
                }
                this.setData({
                    pushRadio: res.list[0].authorizer_appid,
                    promoterList: res.list
                })
                console.log('res', res)
            },
            refreshToken(){
                that.getPromoterList()
            }
        }).catch((err)=>{
            
        })
    },
    // 获取默认地址
    get_default_address(){
        const that = this
        request({
            url:  baseUrl + get_default_address,
            data: {
            },
            isTologin:true,
            method:'POST',
            success:res => {
                console.log('res', res)
                this.setData({
                    addressInfo: Object.keys(getStorageSync('addressInfo')).length ? getStorageSync('addressInfo') : res
                })
            },
            refreshToken(){
                that.get_default_address()
            }
        }).catch((err)=>{
            
        })
    },
    // 获取当前选择的推客账号是否达到领样要求  免费领样 && 有规则限定
    get_order_num(authId){
        const { sell_order_num, leadSample } = this.data.productInfo
        const that = this
        return new Promise((resolve,reject)=>{
            if(leadSample == 1){
                resolve(2)
                return
            }
            request({
                url:  baseUrl + promoter_order_num,
                data: {
                    authorizer_appid: authId
                },
                isTologin:true,
                method:'POST',
                success:res => {
                    if(res.total < sell_order_num){
                        wx.showModal({
                            title:'提示',
                            content: '推客订单数量未达平台领样标准',
                            showCancel: false
                        })
                        resolve(1)
                        return 
                    }
                    resolve(2)
                },
                refreshToken(){
                    that.get_order_num(authId)
                }
            }).catch((err)=>{
                this.setData({
                    disableBtn: false
                })
                resolve(1)
            })
        })
    },
    selectPushCustomer(event){
        this.setData({
            pushRadio: event.detail,
        });
        
    },
    bindTextAreaBlur(e){
        console.log(e.detail.value)
        this.setData({
            textValue: e.detail.value
        })
    },
    goAddress(){
        wx.navigateTo({
            url:'/pages/address/list'
        })
    },
    checkAuth(){
        promiseAuthedCallback(() => {
            this.startCreateOrder()
        });
    },
    startCreateOrder(){
        const { productInfo, textValue, addressInfo, pushRadio } = this.data
        if(this.data.disableBtn){
            return
        }
        this.setData({
            disableBtn: true
        })
        if(!addressInfo.id){
            wx.showModal({
                title: '收货地址不可为空',
                showCancel: false
            })
            this.setData({
                disableBtn: false
            })
            console.log(1)
            return
        }
        if(!pushRadio){
            wx.showModal({
                title: '推客账号不可为空',
                showCancel: false
            })
            this.setData({
                disableBtn: false
            })
            console.log(2)
            return
        }

        this.get_order_num(pushRadio).then((val)=>{
            if(val == 2){
                let param = {
                    promoter_app_id: pushRadio,
                    remark: textValue,
                    address_id: addressInfo.id,
                    product_id: productInfo.product_id,
                    order_type: productInfo.leadSample == 1 ? 2 : 1
                }
                wx.showLoading({
                    title: '订单创建中...',
                })
                this.orderCreated(param)
            }
        })
        
    },
    // 去付款
    orderCreated(data){
        const { orderId, productInfo } = this.data
        let that = this
        wx.login({
            success(res){
                if(res.code){
                    request({
                        url:  baseUrl + create_order,
                        data,
                        isTologin:true,
                        method:'POST',
                        success:res => {
                            const { appid, timestamp, nonceStr, prepay_id, paySign } = res.order_pay
                            that.setData({
                                disableBtn: false
                            })
                            if(productInfo.leadSample == 2){
                                wx.hideLoading()
                                wx.showModal({
                                    title:'领样成功',
                                    showCancel:false,
                                    success:res=>{
                                        wx.switchTab({
                                            url:'/pages/my/index'
                                        })
                                    }
                                })
                                return
                            }
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
                        },
                        fail(){
                            that.setData({
                                disableBtn: false
                            })     
                        }
                      }).catch((err)=>{
                        console.log(5)
                        that.setData({
                            disableBtn: false
                        })
                      })
                }
            },
            fail(){
                that.setData({
                    disableBtn: false
                }) 
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
                    wx.redirectTo({
                        url: '/pages/order/list?type=2&id=1'
                    })
                }
            })
        }
    },
    paySuccessCallback() {
        wx.hideLoading();
        wx.showToast({
            title:'支付完成'
        })
        wx.redirectTo({
            url: '/pages/order/list?type=2&id=2'
        })
    },
    
})