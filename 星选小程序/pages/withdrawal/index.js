
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { setStorageSync } from '../../utils/storageSync.js'
import {
    login,
    isLogin,
    isUserProfileAuthed,
    invokeUserProfileAuth
  } from '../../utils/auth.js'
  import { promiseAuthedCallback } from '../../utils/userInfo.js'
const { store_info, withdraw_apply } = api
const app = getApp()
Page({
    data:{
        show_pre_auth_pannel: false,
        withdrawalMoney: '',
        showClear:false,
        allMoney: '',
        authId: '',
        userInfo: {}
    },
    onLoad(options){
        const scene = {};
        try {
          if (options.scene) {
            JSON.parse('{"' + decodeURIComponent(options.scene).replace(/&/g, '","').replace(/=/g, '":"') + '"}', (k, v) => {
              scene[k] = v
            })
          }
        } catch (error) {
          console.error(error);
        }
        console.log('scene',scene)
        this.setData({
            authId:scene.appid
        })
    },
    onShow(){
        this.setData({
            isLogin: isLogin(),
            userId: app.globalData.userId || ''
        });
        if (!isUserProfileAuthed()) {
            invokeUserProfileAuth();
        }

        login(() => {
           this.getStoreInfo()
        })
    },
    getStoreInfo(){
        const { authId } = this.data
        const that = this
        request({
            url:  baseUrl + store_info,
            data: {
                authorizer_appid: authId
            },
            method:'POST',
            isTologin: true,
            success:res=> {
                console.log('res',res)
              this.setData({
                  userInfo: res,
                  allMoney: res.balance_float,
                //   withdrawalMoney: res.balance_float
              })
            },
            refreshToken(){
                that.getStoreInfo()
            }
        })
    },
    clearInput(){
        this.setData({
            withdrawalMoney: ''
        })
    },
    withdrawalAllMoney(){

        this.setData({
            withdrawalMoney: this.data.allMoney
        })
        // this.withdrawalMoney()
    },
    getVal(e){
        const { value } = e.detail
        this.setData({
            withdrawalMoney:value
        })
    },
    withdrawalMoney(){
        promiseAuthedCallback(() => {
            this.withDrawReal()
        });
    },
    withDrawReal(){
        const { authId, withdrawalMoney, allMoney } = this.data
        if(!withdrawalMoney){
            wx.showModal({
                title:'提现金额不可为空',
                showCancel:false,
            })
            return
        }
        if(parseFloat(withdrawalMoney) > allMoney){
            wx.showModal({
                title:'提现金额大于可提现金额',
                showCancel:false,
            })
            return
        }
        if(parseFloat(withdrawalMoney) < 0.3){
            wx.showModal({
                title:'提现金额不能小于0.3',
                showCancel:false,
            })
            return
        }
        login(() => {
            request({
                url:  baseUrl + withdraw_apply,
                data: {
                    authorizer_appid: authId,
                    money:withdrawalMoney
                },
                method:'POST',
                isTologin: true,
                success:res=> {
                  wx.showToast({
                      title:'提现申请成功',
                      duration: 1500,
                  })
                  this.getStoreInfo()
                }
            })
        })
    }
})