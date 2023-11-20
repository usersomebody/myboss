import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { switchStore, getAccessStoreList } = api
Page({
    data:{
        store_list:[]
    },
    onLoad(){
        //从本地读取 存贮的列表数据
        // this.setData({
        //     store_list:wx.getStorageSync('store_list')
        // })
        this.getStoreList()
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        })
    },
    getStoreList(){
        request({
            url:baseUrl + getAccessStoreList,
            data:{
                phone:wx.getStorageSync('user_info').phone,
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    store_list:res.staffStoreList
                })
            }
        })
    },
    //列表页面跳转存贮店铺的数据
    toIndex(e){
        const { store_list } = this.data
        const { sid, staid, phone } = e.currentTarget.dataset
        wx.setStorageSync('store_id',sid)
        request({
            url:baseUrl + switchStore,
            data:{
                phone,
                staff_id:staid,
                password:wx.getStorageSync('user_pass_word')
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const { sta_id, head_img, sta_name, phone, sex, token, store_id }  = res
                wx.hideLoading()
                //用户token
                wx.setStorageSync('auth_token',token)
                //用户userInfo
                let userInfo = {
                    uid:sta_id,
                    avatar:head_img,
                    nickName:sta_name,
                    phone:phone,
                    sex:sex
                }
                wx.setStorageSync('user_info',userInfo)
                //店铺id
                wx.setStorageSync('store_id',store_id)
                //店铺信息
                let formatDataObj = this.dataToObj(store_list)
                let store_info = formatDataObj[sid]
                wx.setStorageSync('store_info', store_info)
                wx.switchTab({
                    url:'/pages/index/index'
                })

            }
        })
    },
    dataToObj(data){
        let info = {}
        data.forEach((item)=>{
            info[item.store_id] = item
        })
        return info
    },
    //分享
    onShareAppMessage() {
        
    }
})