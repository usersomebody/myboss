import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getStoreInfo, withdrawList, wxLogin } = api
Page({
    data:{
        statusBarHeight:'',
        balance:{
            total_balance:0,
            check_balance:0,
            balance:0,
            expense_balance:0
        },
        accountMap:{
            1:'account_name',
            2:'account_name',
            3:'nickname'
        },
        remark:{
            2:'check_remark',
            3:'check_remark',
            4:'pay_remark',
            5:'check_remark'
        },
        page:1,
        limit:10,
        list:[],
        isLast:false,
        totalCount:0,
        statusMap:{
            1:'提现中',
            2:'已通过',
            3:'已拒绝',
            4:'已打款',
            5:'打款失败'
        },
        showOverlayer:false,
        withdrawDetail:{}
    },
    onLoad(){
        this.setData({
            statusBarHeight:app.globalData.statusBarHeight,
            
        })
        // wx.login({
        //     success (res) {
        //       console.log('res',res)
        //     }
        //   })
        this.getBaseInfo()
    },
    onShow(){
        this.setData({
            list:[],
            page:1,
            limit:10,
            isLast:false,
            totalCount:0
        })
        this.getWithdrawalList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getWithdrawalList(this.contactList)
    },
    getWithdrawalList(callback) {
        const { limit, page } = this.data
        request({
          url:baseUrl + withdrawList,
          isTologin:true,
          data:{
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
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    getBaseInfo(){
        request({
            url:baseUrl + getStoreInfo,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const { total_balance, check_balance, balance, expense_balance} = res
                let balanceData = {
                    total_balance,
                    check_balance,
                    balance,
                    expense_balance
                }
                this.setData({
                    balance:balanceData
                })
            }
        })
    },
    checkDetail(e){
        const { item } = e.currentTarget.dataset
        this.setData({
            withdrawDetail:item,
            showOverlayer:!this.data.showOverlayer
        })
    },
    toggleDetail(){
        this.setData({
            showOverlayer:!this.data.showOverlayer
        })
    },
    login(){
        wx.getUserProfile({
            desc: '用于获取提现会员资料',
            success: (res) => {
                wx.login({
                    success: result => {
                        let data = {jscode:result.code,...res}
                        this.withdrawIng(data)
                    }
                })
            }
        })
    },
    //前往授权提现
    withdrawIng(data){
        request({
            url:baseUrl + wxLogin,
            data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.setStorageSync('withdrawBalance', res)
                wx.navigateTo({
                    url: '/pages/withdrawal/withdrawal'
                })
            }
        })
        
    },

    back(){
        wx.navigateBack({
            delta: 1
        })
    }
    
})