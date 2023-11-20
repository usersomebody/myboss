import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getAllRoleForStoreIds } = api
Page({
    data:{
        store_id:'',
        selectStoreInfo:{},
        selectStoreRoleList:[],
        checkedIds:[],
        checkData:{}
    },
    onLoad(options){
        this.setData({
            store_id:options.sid,
            store_name:options.sname,
            checkedIds:app.globalData.checkRoleRoot && app.globalData.checkRoleRoot.checkIds.length ?  app.globalData.checkRoleRoot.checkIds :  []
        })
        this.getALLRole()

    },
    onShow(){
    },
    onChange(event){
        const { selectStoreRoleList } = this.data
        app.globalData.checkRoleRoot = {
            checkCodes:[],
            isRoot:0
        }
        console.log('app.globalData.checkRoleRoot',app.globalData.checkRoleRoot)
        this.setData({
            checkedIds: event.detail,
        });
        this.statisticsIds()
    },
    getALLRole(){
        wx.showLoading()
        const { store_id } = this.data
        request({
            url:baseUrl + getAllRoleForStoreIds,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.hideLoading()
                let selectStoreInfo = res.store_role.filter((item)=>{
                    return item.store_id == store_id
                })
                this.setData({
                    selectStoreInfo:selectStoreInfo[0],
                    selectStoreRoleList:selectStoreInfo[0].role
                })
                this.statisticsIds()
            }
        })
    },
    checkRolePower(){
        // this.statisticsIds()
        wx.navigateTo({
            url: '/pages/member/powerList?switchid=1'
        })
    },
    privateConfig(){
        wx.navigateTo({
            url: '/pages/member/powerList?switchid=2'
        })
    },
    //统计选中的id
    /**
     * 这里逻辑目前有点问题 根据角色身份选择的对应的权限之后 
     * 可能会存在无效的codes 对员工的权限操作不一定是当前身份的所有权限
     * 所以对被删除后的codes做了一次记录保留 然后在筛选出有效的数据
     * 删除code的相关逻辑：powerList.js ----> sure()
    */
    statisticsIds(type){
        const { checkedIds } = this.data
        const { selectStoreRoleList } = this.data
        let checkData = {
            checkCodes:app.globalData.checkRoleRoot ? app.globalData.checkRoleRoot.checkCodes &&  app.globalData.checkRoleRoot.checkCodes.length ? app.globalData.checkRoleRoot.checkCodes : [] : [],
            isRoot:0,
            checkName:[],
            checkIds:[],
            isTeacher:0,
            data_range:app.globalData.checkRoleRoot.data_range ? app.globalData.checkRoleRoot.data_range : 0,
            week:app.globalData.checkRoleRoot ? app.globalData.checkRoleRoot.week &&  app.globalData.checkRoleRoot.week.length ? app.globalData.checkRoleRoot.week : [] : [],
            delCode: app.globalData.checkRoleRoot ? app.globalData.checkRoleRoot.delCode &&  app.globalData.checkRoleRoot.delCode.length ? app.globalData.checkRoleRoot.delCode : [] : []
        }
        if(!checkedIds.length){
            checkData.isTeacher = 0       
            this.setData({
                checkData:checkData
            })    
            return
        }
        //根据选择的身份提取出有效的codes
        selectStoreRoleList.forEach((item)=>{
            if(checkedIds.indexOf(`${item.id}`) > -1){
                console.log('item',item)
                if(!item.auth_code_arr.length && item.name == '超级管理员'){
                    checkData.isRoot = 1
                }
                checkData.checkCodes = [...checkData.checkCodes,...item.auth_code_arr]
                checkData.checkName = [...checkData.checkName,item.name]
                checkData.checkIds = [...checkData.checkIds,`${item.id}`]
                checkData.data_range = checkData.data_range
            }
        })
        //去重
        checkData.checkCodes = checkData.checkCodes.filter((currentValue, index, arr)=>{
            return arr.indexOf(currentValue) === index
        })
        //是否含有老师
        if(checkData.checkName .indexOf('老师/教练') > -1 ){
            checkData.isTeacher = 1
        }
        //真实有效的codes
        if(checkData.delCode.length){
            checkData.checkCodes = checkData.checkCodes.filter((v)=>{
                return checkData.delCode.indexOf(v) == -1
            })
        }
        
        app.globalData.checkRoleRoot = checkData
        console.log('checkData',checkData)
        this.setData({
            checkData:checkData
        })
    },
    toObj(arr,key){
        let obj = {}
        arr.forEach((item)=>{
            obj[item[key]] = item
        })
        return obj
    },
    sure(){
        const { store_id, store_name } = this.data
        let list = app.globalData.storeRoleList || []
        let listToObj = this.toObj(list,'store_id')
        let obj = {store_id,store_name,...app.globalData.checkRoleRoot}
        if(listToObj[store_id]){
            list = list.map((item)=>{
                let obj = item
                if(item.store_id == store_id){
                    obj = {...item,...app.globalData.checkRoleRoot}
                }
                return obj
            })
        }else{
            list.push(obj)
        }
        app.globalData.storeRoleList = list
        this.back()
    },
    back(){
        wx.navigateBack({
            delta: 1, 
        })
    }
})