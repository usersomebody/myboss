import {
    login,
    isLogin,
    isUserProfileAuthed,
    invokeUserProfileAuth
  } from '../../utils/auth.js'
import { promiseAuthedCallback } from '../../utils/userInfo.js'
import { getUserProfile, removeStorageSync } from '../../utils/storageSync.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const { user_center } = api
const app = getApp()

Page({
    data:{
        show_pre_auth_pannel: false,
        userInfo: {},
        freeStatusList: [{
            id: 2,
            name: '待发货',
            value: 0
        }, {
            id: 3,
            name: '待收货',
            value: 0
        }, {
            id: 4,
            name: '已完成',
            value: 0
        }, {
            id: 5,
            name: '已取消',
            value: 0
        }],
        costStatusList:[{
            id: 1,
            name: '待支付',
            icon: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/72da39713207edb8539bf2f29f576b42.png',
            num:1
        }, {
            id: 2,
            name: '待发货',
            icon: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/d83efa276f6d903304d39aa816926b9f.png',
            num:1
        }, {
            id: 3,
            name: '待收货',
            icon: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/8633e3538549d37121cea28c561252bd.png',
            num:1
        }, {
            id: 4,
            name: '已完成',
            icon: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/67c27ad15d9bcbf71570cd73faff09db.png',
            num:0
        }, {
            id: 5,
            name: '已取消',
            icon: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/4e71e8d1b717aa5e8b9ea1f95c851c3d.png',
            num:0
        }],
        promoterCount: {
            count: 0
        }
    },
    onLoad(){
        removeStorageSync('addressInfo')
        removeStorageSync('productDetail')
    },
    onShow(){
        this.setData({
            isLogin: isLogin(),
            userId: app.globalData.userId || '',
            userInfo: getUserProfile()
        });
        login(() => {
            this.getUserCenter()
        })
        
        if (!isUserProfileAuthed()) {
            invokeUserProfileAuth();
        }
    },
    getUserCenter(){
        const { freeStatusList, costStatusList } = this.data
        const that = this
        request({
            url:  baseUrl + user_center,
            data: {},
            method:'POST',
            isTologin: true,
            success:res=> {
              const { orderCount,  promoterCount, wechatUser } = res
              freeStatusList[0].value = orderCount.status2_1
              freeStatusList[1].value = orderCount.status3_1
              freeStatusList[2].value = orderCount.status4_1
              freeStatusList[3].value = orderCount.status5_1
              costStatusList[0].num = orderCount.status1_2
              costStatusList[1].num = orderCount.status2_2
              costStatusList[2].num = orderCount.status3_2
              this.setData({
                freeStatusList,
                costStatusList,
                promoterCount
              })
            },
            fail(err){
                console.log('err', err)
            },
            refreshToken(){
                that.getUserCenter()
            }
        })
    },
    goOrder(e){
        const { id, type } = e.currentTarget.dataset
        console.log('e',e)
        wx.navigateTo({
            url: `/pages/order/list?type=${type}&id=${id}`
        })
    },
    goCustomer(){
        promiseAuthedCallback(() => {
            wx.navigateTo({
                url: `/pages/pushCustomers/index`
            })
        });
    },
    goAddress(){
        wx.navigateTo({
            url: `/pages/address/list?type=1`
        })
    },
    goService(){
        wx.navigateTo({
            url: `/pages/customerService/index`
        })
    }
})