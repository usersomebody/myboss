import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getCourseConfig } = api
Page({
    data:{
        storeList:[],
        checkedIds:[]
    },
    onLoad(){
        this.setData({
            checkedIds:wx.getStorageSync('checkStoreIds') || []
        })
        this.getAllStore()
    },
    onShow(){

    },
    // 获取当前支持的店铺列表数据
    getAllStore(){
        request({
            url:baseUrl + getCourseConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                console.log('res',res)
                this.setData({
                    storeList:res.chainStore
                })
            }
        })
    },
    onChange(event){
        console.log('event',event)
        this.setData({
            checkedIds: event.detail,
        });
    },
    back(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    // 存贮当前选择的店铺id  这里的数据和全局storeid不相关 切勿更改
    sure(){
        const { checkedIds, storeList } = this.data
        if(!checkedIds.length){
            wx.showModal({
                title:'请选择门店'
            })
            return
        }
        let selectName = []
        let list = storeList.filter((item)=>{
            return checkedIds.indexOf(`${item.id + ''}`) > -1 
        })
        list.forEach(item => {
            selectName = [...selectName,item.name]
        });
        wx.setStorageSync('checkStoreIds', checkedIds)
        wx.setStorageSync('checkStoreNames', selectName)
        this.back()
    }
})