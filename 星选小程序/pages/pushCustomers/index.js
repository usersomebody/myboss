
import { api, baseUrl, isDev } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import {
    login,
    isLogin,
    isUserProfileAuthed,
    invokeUserProfileAuth
  } from '../../utils/auth.js'
import { setStorageSync, getStorageSync } from '../../utils/storageSync.js'
const { promoter_list, promoter_auth } = api
const app = getApp()
Page({
    data:{
        customerList:[],
        linkType: '',
        auth_url: ''
    },
    onLoad(options){
        this.setData({
            linkType: options.linkType || ''
        })
        login(() => {
            this.getList()
            // this.getAuthUrl()
        })
    },
    getAuthUrl(){
        const that = this
        request({
            url:  baseUrl + promoter_auth,
            data: {
                url: encodeURIComponent(`${ isDev ? 'http://test.xingxuan.mnancheng.com/#/backPage' : ''}`),
                keyword: getStorageSync('userId').unionid,
                auth_type: 'promoter',
            },
            method:'POST',
            isTologin: true,
            success:res=> {
                console.log('res___________', res)
                this.setData({
                    auth_url: res.url
                })
            },
            refreshToken(){
                that.getAuthUrl()
            }
        })
    },
    getList(){
        request({
            url:  baseUrl + promoter_list,
            data: {
              page:1,
              limit:20,
            },
            method:'POST',
            success:res=> {
              this.setData({
                customerList: res.list
              })
            },
        })
    },
    // 前往授权
    editAddress(e){
        const { id } = e.currentTarget.dataset
        // const { auth_url } = this.data
        // const link = `${ isDev ? "https://test.xingxuan.mnancheng.com/#/authPage?unionid=" + getStorageSync('userId').unionid : ''}`
        // wx.navigateTo({ 
        //     url:`/pages/webViewAuth/index?url=` + encodeURIComponent(link)
        // })
        wx.openCustomerServiceChat({
            extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc9c42430725448f46?enc_scene=ENCDbUpmWezVRvwXd7nA6hFJUB7Jt2jSHSftW3RWUXxN8ki'},
            corpId: 'ww49fba9a79638d2b5',
            success(res) {

            },
            fail(err){
                wx.showModal({
                    content:JSON.stringify(err)
                })
            }
        })
        
    }
})