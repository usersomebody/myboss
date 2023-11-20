import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { integralList, accountInfo, checkAccount } = api
Page({
    data:{
        statusBarHeight:'',
        list:[],
        page:1,
        limit:10,
        isLast:false,
        totalCount:0,
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
            page:1,
            limit:10,
            isLast:false,
            totalCount:0
        })
        this.getIntegralList(this.contactList)
        this.getIntegralInfo()
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getIntegralList(this.contactList)
    },
    getIntegralList(callback) {
        const { limit, page, phone, type } = this.data
        request({
          url:baseUrl + integralList,
          isTologin:true,
          data:{
            phone,
            type,
            account_type:'credit',
            page,
            limit,
          },
          method: 'POST',
          success: (res => {
            if (callback) callback(res.list)
            this.setData({
              list: this.data.list,
              totalCount: res.count
            })
            if (isLast(this.data.page, this.data.totalCount, this.data.limit)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          })
        }).catch(()=>{
            this.setData({
                isLast: true
            })
        })
    },
    contactList(list) {
        list.forEach(item => {
            item.number = parseInt(item.number) < 0 ?  item.number : parseInt(item.number) == 0 ? 0 : '+' + item.number
        });
        this.data.list = this.data.list.concat(list)
    },
    getNumberVal(e){
        const { value } = e.detail
        this.setData({
            integralVal:value
        })
    },
    getMemoVal(e){
        const { value } = e.detail
        this.setData({
            memoVal:value
        })
    },
    back(){
        wx.navigateBack({
            delta: 1
        })
    },
    cancle(){
        this.setData({
            showOverlayer:!this.data.showOverlayer
        })
    },
    add(){
        let that = this
        const { phone, type, credit_total, showContent, memoVal, integralVal } = this.data
        request({
            url:  baseUrl + checkAccount,
            data: {
                number:integralVal,
                check_type:showContent.type,
                remark:memoVal,
                phone,
                type,
                account_type:'credit'
            },
            isTologin:true,
            method:'POST',
            success(res) {
               wx.showModal({
                   title:showContent.type == 1 ? '增加成功' : '扣减成功',
                   showCancel:false
               })
               that.setData({
                list:[],
                page:1,
                limit:10,
                isLast:false,
                totalCount:0
            })
            that.getIntegralList(that.contactList)
            that.getIntegralInfo()
            },
          })
          that.cancle()
    },
    showBox(e){
        const { type } = e.currentTarget.dataset
        console.log('e',e)
        let showContent = {}
        if(type == 1){
            showContent = {
                title:'添加积分',
                btnName:'添加',
                type:1
            }
        }else{
            showContent = {
                title:'扣减积分',
                btnName:'减少',
                type:2
            }
        }
        this.setData({
            showOverlayer:true,
            showContent,
        })
    },
    getIntegralInfo(){
        const { phone, type } = this.data
        let that = this
        request({
            url:  baseUrl + accountInfo,
            data: {
                phone,
                type
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                credit_total:res.credit || 0
               })
            },
          })
    }
})