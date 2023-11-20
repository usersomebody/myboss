import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accSub, accMul, accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { withdraw } = api
Page({
    data:{
        withdrawInfo:{},
        withdrawalBalance:'',
        disabled:false
    },
    onLoad(){
        const { withdrawalBalance } = this.data
        let  withdrawInfo = wx.getStorageSync('withdrawBalance')
        let actualAmount =  accSub(withdrawalBalance,accMul(withdrawalBalance,accDiv(withdrawInfo.service_charge_rate,1000)))
        withdrawInfo.actualAmount = Number(actualAmount).toFixed(2)
        this.setData({
            withdrawInfo:withdrawInfo
        })
    },
    getBalance(e){
        const { value } = e.detail
        const { withdrawInfo  } = this.data
        let val = 0
        if(parseFloat(value) >  parseFloat(withdrawInfo.balance)){
            val = parseFloat(withdrawInfo.balance)
        }else{
            val = parseFloat(value)
        }
        let actualAmount = accSub(val,accMul(val,accDiv(withdrawInfo.service_charge_rate,1000)))
        withdrawInfo.actualAmount = Number(actualAmount).toFixed(2)
        
        this.setData({
            withdrawalBalance:val,
            withdrawInfo
        })
    },
    eliminateVal(){
        this.setData({
            withdrawalBalance:''
        })
    },
    withdrawalAll(){
        const { withdrawInfo } = this.data
        let actualAmount = accSub(withdrawInfo.balance,accMul(withdrawInfo.balance,accDiv(withdrawInfo.service_charge_rate,1000)))
        withdrawInfo.actualAmount = Number(actualAmount).toFixed(2)
        
        this.setData({
            withdrawalBalance:withdrawInfo.balance,
            withdrawInfo
        })
    },
    withdrawal(){
        const { withdrawInfo, withdrawalBalance, disabled } = this.data
        if(disabled){
            return
        }
        this.setData({
            disabled:true
        })
        if(Number(withdrawalBalance) < 100){
            wx.showModal({
                title:'提现金额不可小于100元',
                showCancel:false,
            })
            this.setData({
                disabled:false
            })
            return
        }
        if(withdrawInfo.week_withdraw_times == 0){
            wx.showModal({
                title:'提现次数已达上限',
                showCancel:false,
            })
            this.setData({
                disabled:false
            })
            return
        }
        let data = {
            openid:withdrawInfo.openid,
            money:withdrawalBalance,
            type:3,
            remark:''
        }
        request({
            url:baseUrl + withdraw,
            data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'提现成功',
                    showCancel:false,
                    success:(res)=>{
                        wx.redirectTo({
                            url: '/pages/withdrawal/examine'
                        })
                        this.setData({
                            disabled:false
                        })
                    }
                })
            }
        }).catch(()=>{
            this.setData({
                disabled:false
            })
        })
    }
})