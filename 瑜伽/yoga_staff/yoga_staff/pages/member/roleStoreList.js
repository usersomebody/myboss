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
        checkedIds:[],
        storeRoleData:{}
    },
    onLoad(){

    },
    onShow(){
        let storeRoleData  = {}
        if(app.globalData.storeRoleList){
            storeRoleData = this.toObj(app.globalData.storeRoleList,'store_id')
            let checkedIds = app.globalData.storeRoleList.map((item)=>{
                let obj = item.store_id
                return obj
            })
            this.setData({
                storeRoleData,
                checkedIds
            })
        }
        this.getAllStore()
    },
    toObj(arr,key){
        let obj = {}
        arr.forEach((item)=>{
            obj[item[key]] = item
        })
        return obj
    },
    // 获取当前支持的店铺列表数据
    getAllStore(){
        const { checkedIds, storeRoleData } = this.data
        request({
            url:baseUrl + getCourseConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const { chainStore } = res
              
                let storeRoleList = chainStore.map((item)=>{
                    let obj = item
                    obj.checked = checkedIds.indexOf(`${item.id}`) > -1 ? true : false
                    obj.checkName = storeRoleData[item.id] ? storeRoleData[item.id].checkName.length > 1 ? storeRoleData[item.id].checkName.join(',') : storeRoleData[item.id].checkName : []
                    return obj
                })
                console.log('storeRoleList',storeRoleList)
                this.setData({
                    storeList:storeRoleList
                })
            }
        })
    },
    onChange(event){
        const { storeList } = this.data
        storeList.forEach((item)=>{
            item.checked = event.detail.indexOf(`${item.id}`) > -1 ? true : false
        })
        this.setData({
            checkedIds: event.detail,
            storeList
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
                title:'请选择门店',
                showCancel:false
            })
            return
        }
        let storeRoleList = app.globalData.storeRoleList
        if(!storeRoleList || !storeRoleList.length){
            wx.showModal({
                title:'请选择角色',
                showCancel:false
            })
            return
        }
        //角色全部校验
        let storeIdList = storeRoleList.map((item)=>{
            return item.store_id
        })
        let isPass = checkedIds.every((item)=>{
            return storeIdList.indexOf(`${item + ''}`) > -1 
        })
        if(!isPass){
            wx.showModal({
                title:'请选择角色',
                showCancel:false
            })
            return
        }
        app.globalData.storeRoleList = storeRoleList.filter((item)=>{
            return checkedIds.indexOf(`${item.store_id + ''}`) > -1 
        })
        this.back()
    },
    addRole(e){
        const { sid, sname } = e.currentTarget.dataset
        const { storeList, storeRoleData } = this.data
        //存贮数据结构
        wx.setStorageSync('roleList',storeList)
        if(app.globalData.storeRoleList && storeRoleData[sid]){
            app.globalData.checkRoleRoot = storeRoleData[sid]
        }else{
            app.globalData.checkRoleRoot = {
                delCode:[],
                checkName:[],
                checkIds:[],
                checkCodes:[],
                store_id:"",
                store_name:'',
                isRoot:0,
                isTeacher:0,
                data_range:[]
            }
        }
        wx.navigateTo({
            url: '/pages/member/roleList?sid=' + sid + '&sname=' + sname
        })
    }

})