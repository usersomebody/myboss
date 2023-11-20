import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getAuthRole, editRole, addRole, delRole } = api
Page({
    data:{
        allAuthRole:[],
        checkId:2,
        actionCode:[],
        showList:[{
            name:'角色名称',
            key:'name',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isShowIcon:false
        },{
            name:'权限设置',
            key:'auth_code',
            placeholder:'选择权限',
            value:'',
            require:true,
            isInput:false,
            isShowIcon:true,
            codesNum:0
        }],
        showOverlayer:false,
        identityName:'',
        total:0,
        isNotUpdate:false,
        checkCodes:[],
        isSelectAll:true,
        issystem:0,
        switchRoleList:[{
            id:1,
            name:'权限设置'
        },{
            id:2,
            name:'数据可见范围'
        }],
        switchId:1,
        dataCanSeeRange:[{
            id:0,
            name:'全部数据'
        },{
            id:1,
            name:'个人数据'
        }],
        dataRangeVal:0,
        rid:0
    },
    onLoad(options){
        this.getAllAuthRole()
        this.setData({
            rid:options.id || 0,
            issystem:options.issystem,
            identityName:app.globalData.identityData.name || '',
            isNotUpdate:app.globalData.identityData && app.globalData.identityData.is_system && app.globalData.identityData.is_system == 1 ? true : false,
            dataRangeVal:app.globalData.identityData.data_range
        })
    },
    onShow(){
        
    },
    onUnload(){
        app.globalData.identityData = ''
    },
    toggleRoot(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer,
            switchId:1
        })
    },
    //获取权限列表
    getAllAuthRole(){
        request({
            url:baseUrl + getAuthRole,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                //初始化默认增加筛选字段
                res.forEach(element => {
                   element.checkNum = 0
                   element.children.forEach((itm)=>{
                       itm.checked = false
                   })
                });
                this.setData({
                    checkId:res[1].id,
                    allAuthRole:res
                })
                // 根据实际选中数据进行数据选中
                this.initRoleRoot()
            }
        })
    },
    checkLeft(e){
        const { id } = e.currentTarget.dataset
        const { checkId } = this.data
        if(id == checkId){
            return
        }
        this.setData({
            checkId:id
        })
    },
    checkChildren(e){
        const { id,oid, code } = e.currentTarget.dataset
        const { allAuthRole,actionCode } = this.data
        allAuthRole.forEach((item)=>{
            item.children.forEach((itm)=>{
                itm.checked = code == itm.auth_code ? !itm.checked : itm.checked
            })
        })
        //统计数
        allAuthRole.forEach(element => {
            let checkNum = element.children.filter((v)=>{
                return v.checked
            })
            element.checkDataList = checkNum
            element.checkNum = checkNum.length
        });
        let codes = [...actionCode,code].filter((currentValue, index, arr)=>{
            return arr.indexOf(currentValue) === index;
        })
        let total = allAuthRole.reduce((prev, cur, index, arr)=>{
            return parseInt(prev) + parseInt(cur.checkNum);
        },0)
        this.setData({
            allAuthRole,
            actionCode:codes,
            total
        })
    },
    //初始化权限数据
    initRoleRoot(){
        const rootList = app.globalData.identityData || ''
        const { allAuthRole } = this.data
        // 无数据
        if(!rootList){
            return
        }
        if(!rootList.isRoot && !rootList.checkCodes.length){
            return
        }
        //超级管理员
        if(rootList.isRoot){
            allAuthRole.forEach(element => {
                element.checkNum = element.children.length
                element.checkDataList = element.children || []
                element.children.forEach((itm)=>{
                    itm.checked = true
                })
             });
        }
        //普通
        if(!rootList.isRoot && rootList.checkCodes.length){
            allAuthRole.forEach((item)=>{
                item.children.forEach((itm)=>{
                    itm.checked = rootList.checkCodes.indexOf(`${itm.auth_code}`) > -1 ? true : itm.checked
                })
            })
             //统计数
            allAuthRole.forEach(element => {
                let checkNum = element.children.filter((v)=>{
                    return v.checked
                })
                element.checkDataList = checkNum || []
                element.checkNum = checkNum.length
            });
        }
        let total = allAuthRole.reduce((prev, cur, index, arr)=>{
            return parseInt(prev) + parseInt(cur.checkNum);
        },0)
        this.setData({
            allAuthRole,
            total
        })
    },
    cancle(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer
        })
    },
    sure(){
        // 提取当前选中的数据
        const { allAuthRole, actionCode, weekList, showOverlayer } = this.data
        let checkCodes = []
        let delCode = []
        allAuthRole.forEach((item)=>{
            if(item.checkDataList && item.checkDataList.length){
                item.checkDataList.forEach((itm)=>{
                    checkCodes = [...checkCodes,itm.auth_code]
                })
            }
            item.children.forEach((v)=>{
                if(!v.checked && actionCode.indexOf(`${v.auth_code}`) > -1){
                    delCode = [...delCode,v.auth_code]
                } 
            })
        })
        //数据去重
        checkCodes = checkCodes.filter((currentValue, index, arr)=>{
            return arr.indexOf(currentValue) === index;
        })
       this.setData({
            checkCodes,
            showOverlayer:!showOverlayer
       })
    },
    submit(){
        const { checkCodes, identityName, dataRangeVal } = this.data
        let identityData = app.globalData.identityData
        let data = {
            auth_code:checkCodes,
            name:identityData.name || identityName,
            data_range:dataRangeVal
        }
        if(!data.name){
            wx.showModal({
                title:'名称不可以为空',
                showCancel:false
            })
            return
        }
        if(identityData.id){
            data.id = identityData.id
        }
        let url = identityData.id ? editRole : addRole
        let isEdit = identityData.id ? true : false
        this.submitData(data,url,isEdit)
    },
    submitData(data,url,isEdit){
        request({
            url:baseUrl + url,
            data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:isEdit ? '修改成功' : '添加成功',
                    showCancel:false,
                    success:()=>{
                        this.back()
                    }
                })
            }
        })
    },
    back(){
        wx.navigateBack({
            delta: 1, 
        })
    },
    deleteRole(){
        const { issystem, rid } = this.data
        if(!rid){
            wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
            })
            return
        }
        if(issystem == 1){
            wx.showModal({
                title:'默认角色不可删除',
                showCancel:false,
            })
            return
        }
        wx.showModal({
            title:'确认删除',
            success:(result)=>{
                if(result.confirm){
                    request({
                        url:baseUrl + delRole,
                        data:{
                            id:app.globalData.identityData.id
                        },
                        method:'POST',
                        isTologin:true,
                        success:(res)=>{
                            wx.showModal({
                                title:'删除成功',
                                showCancel:false,
                                success:()=>{
                                    this.back()
                                }
                            })
                        }
                    })
                }
            }
        })
        
    },
    actionType(){
        const { isSelectAll } = this.data

        if(!isSelectAll){
            this.restSelectAll()
            this.setData({
                isSelectAll:true
            })
        }else{
            this.setData({
                isSelectAll:false
            })
            this.selectAll()
        }
    },
    selectAll(){
        const { allAuthRole } = this.data
        allAuthRole.forEach((item)=>{
            item.children.forEach((itm)=>{
                itm.checked = true
            })
        })
        //统计数
        allAuthRole.forEach(element => {
            let checkNum = element.children.filter((v)=>{
                return v.checked
            })
            element.checkDataList = checkNum
            element.checkNum = checkNum.length
        });
        let total = allAuthRole.reduce((prev, cur, index, arr)=>{
            return parseInt(prev) + parseInt(cur.checkNum);
        },0)
        this.setData({
            allAuthRole,
            total
        })
    },
    restSelectAll(){
        const { allAuthRole } = this.data
        allAuthRole.forEach((item)=>{
            item.children.forEach((itm)=>{
                itm.checked = false
            })
        })
        //统计数
        allAuthRole.forEach(element => {
            let checkNum = element.children.filter((v)=>{
                return v.checked
            })
            element.checkDataList = checkNum
            element.checkNum = checkNum.length
        });
        let total = allAuthRole.reduce((prev, cur, index, arr)=>{
            return parseInt(prev) + parseInt(cur.checkNum);
        },0)
        this.setData({
            allAuthRole,
            total
        })
    },
    closeRootList(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        this.setData({
            identityName:value, 
        })
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        console.log('id',id)
        const { switchId } = this.data
        if(id == switchId){
            return
        }
        this.setData({
            switchId:id
        })
    },
    // 数据可见范围    
    onDataRangeChange(e){
        this.setData({
            dataRangeVal: e.detail,
        });
    }
})