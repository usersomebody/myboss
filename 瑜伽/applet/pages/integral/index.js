import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const baseUrl = app.globalData.baseUrl
const { user } = api
Page({
    data:{
        statusBarHeight:'',
        list:[],
        showOverlayer:false,
        integralVal:'',
        memoVal:'',
        showContent:{
            title:'添加积分',
            btnName:'添加'
        },
        phone:'',
        type:'',
        credit_total:'0'
    },
    onLoad(options){
        this.setData({
            statusBarHeight:app.globalData.statusBarHeight,
            phone:options.phone,
            type:options.type
        })
    },
    onShow(){
        this.setData({
            list:[],

        })
        this.getIntegralInfo()
        this.getIntegralList()
    },
    back(){
        wx.navigateBack({
            delta: 1
        })
    },


    getIntegralInfo(){
        const { phone, type } = this.data
        let that = this
        request({
            url:  baseUrl + user,
            data: {
                method:'user.accountinfo',
                store_id: wx.getStorageSync('store_id'),
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                credit_total:res.credit || 0
               })
            },
          })
    },
    getIntegralList(){
        const { phone, type } = this.data
        let that = this
        request({
            url:  baseUrl + user,
            data: {
                method:'user.credit',
                store_id: wx.getStorageSync('store_id'),
                account_type:'credit',
                size:100
            },
            isTologin:true,
            method:'POST',
            success(res) {
                if(res == null){
                    return
                }
                res.forEach(item => {
                    item.number = parseInt(item.number) < 0 ?  item.number : parseInt(item.number) == 0 ? 0 : '+' + item.number
                });
                that.setData({
                    list:res || []
               })
            },
          })
    }
})