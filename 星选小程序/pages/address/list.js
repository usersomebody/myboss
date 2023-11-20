
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { setStorageSync } from '../../utils/storageSync.js'
const { get_address_list, modify_address } = api

const app = getApp()
Page({
    data:{
        address:[],
        linkType: '',
        myPage: ''
    },
    onLoad(options){
        this.setData({
            linkType: options.linkType || '',
            myPage: options.type || ''
        })
    },
    onShow(){
        this.getAddressList()
        
    },
    // 获取默认地址
    getAddressList(){
        const that = this
        request({
            url:  baseUrl + get_address_list,
            data: {
                page:1,
                limit: 20
            },
            isTologin:true,
            method:'POST',
            success:res => {
                this.setData({
                    address: res.list
                })
            },
            refreshToken(){
                that.getAddressList()
            }
        }).catch((err)=>{
            
        })
    },
    editAddress(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url:`/pages/address/add${id ? '?id=' + id : ''}`
        })
    },
    selectAddress(e){
        const { id } = e.currentTarget.dataset
        const { address, linkType, myPage } = this.data
        if(myPage){
            wx.navigateTo({
                url:`/pages/address/add${id ? '?id=' + id : ''}`
            })
            return
        }
        let data = address.filter((item)=>{
            return item.id == id
        })
        const that = this
        // 如果是从订单详情页面过来的调取修改数据的接口然后返回
        if(linkType){
            request({
                url:  baseUrl + modify_address,
                data: {
                    order_sn:linkType,
                    address_id:id,
                },
                method:'POST',
                isTologin:true,
                success:res=> {
                  wx.navigateBack({
                        delta: 1
                  })
                },
                refreshToken(){
                    that.selectAddress(e)
                }
            })
            return
        }
        setStorageSync('addressInfo',data[0])
        wx.navigateBack({
            delta: 1
        })
    }
})