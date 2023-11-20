import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getAllRoleForStoreIds, getAuthRole } = api
Page({
    data:{
        switchList:[{
            id:1,
            name:'权限配置'
        },{
            id:2,
            name:'私教配置'
        },{
            id:3,
            name:'数据可见范围'
        }],
        switchId:1,
        allAuthRole:[],
        checkId:2,
        actionCode:[],
        courseList:[{
            id:1,
            name:'团课'
        },{
            id:2,
            name:'私教课'
        }],
        courseId:['1'],
        weekList:[{
            id:1,
            name:'一',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:2,
            name:'二',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:3,
            name:'三',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:4,
            name:'四',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:5,
            name:'五',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:6,
            name:'六',
            checked:false,
            attend:[],
            rest:[]
        },{
            id:0,
            name:'日',
            checked:false,
            attend:[],
            rest:[]
        }],
        currentDate:"",
        dateObj:{
            use_start_time:'07:00',
            use_end_time:'21:00',
            restTime:[]
        },
        isTeacher:0,
        weekId:1,
        isShowPrivate:false,
        isSelectAll:true,

        dataCanSeeRange:[{
            id:0,
            name:'全部数据'
        },{
            id:1,
            name:'个人数据'
        }],
        dataRangeVal:0
    },
    onLoad(options){
        this.getAllAuthRole()
        let checkRoleRoot = app.globalData.checkRoleRoot
        console.log('getAllAuthRole',checkRoleRoot)
        let week = this.data.weekList.map((item,idx)=>{
            let obj = {...item,...checkRoleRoot.week[idx]}
            return obj
        })
        let isShowPrivate = week.some((item)=>{
            return item.attend.length || item.rest.length
        })
        let courseId = isShowPrivate  ? ['1','2'] : ['1']
        let dateObj = {
            use_start_time:week[0].attend[0] || '07:00',
            use_end_time:week[0].attend[1] || '21:00',
            restTime:week[0].rest
        }
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
            switchId:options.switchid,
            isTeacher:checkRoleRoot.isTeacher || 0,
            dataRangeVal:checkRoleRoot.data_range,
            switchList:checkRoleRoot.isTeacher && !checkRoleRoot.isRoot ? [{
                id:1,
                name:'权限配置'
            },{
                id:2,
                name:'私教配置'
            },{
                id:3,
                name:'数据可见范围'
            }] : checkRoleRoot.isTeacher ? [{
                id:2,
                name:'私教配置'
            },{
                id:3,
                name:'数据可见范围'
            }] : [{
                id:1,
                name:'权限配置'
            },{
                id:3,
                name:'数据可见范围'
            }],
            weekList: week,
            dateObj,
            courseId,
            isShowPrivate
        })
    },
    onShow(){
        
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { switchId } = this.data
        if(id == switchId){
            return
        }
        this.setData({
            switchId:id
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
        this.setData({
            allAuthRole,
            actionCode:codes
        })
    },
    //初始化权限数据
    initRoleRoot(){
        const rootList = app.globalData.checkRoleRoot || ''
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

        this.setData({
            allAuthRole
        })
    },
    sure(){
        // 提取当前选中的数据
        const { allAuthRole, actionCode, weekList, courseId, dataRangeVal } = this.data
        let checkCodes = []
        let delCode = []
        allAuthRole.forEach((item)=>{
            if(item.checkDataList && item.checkDataList.length){
                item.checkDataList.forEach((itm)=>{
                    checkCodes = [...checkCodes,itm.auth_code,item.auth_code]
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
        //记录被删除掉的code
        delCode = delCode.filter((currentValue, index, arr)=>{
            return arr.indexOf(currentValue) === index;
        })
        app.globalData.checkRoleRoot.checkCodes = checkCodes
        app.globalData.checkRoleRoot.delCode = delCode
        app.globalData.checkRoleRoot.week = courseId.indexOf('2') > -1 && weekList.length ? weekList : []
        app.globalData.checkRoleRoot.data_range = dataRangeVal
        // app.globalData.submitCheckCodes = checkCodes
        this.back()
    },
    back(){
        wx.navigateBack({
            delta: 1, 
        })
    },

    actionType(){
        const { isSelectAll, switchId } = this.data
        if(switchId == 2 || switchId == 3){
            wx.navigateBack({
                delta:1
            })
            return
        }
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
        })
    },

    //私教课程配置
    onChange(event){
        const { weekId, weekList } = this.data
        let copyWeek = weekList
        let checkRoleRoot = app.globalData.checkRoleRoot
        if(event.detail.indexOf('2') > -1 && !checkRoleRoot.week.length){
            copyWeek = weekList.map((item)=>{
                let obj = ['07:00','21:00']
                item.attend = obj.concat()
                return item
            })
        }
        this.setData({
            courseId: event.detail,
            isShowPrivate:event.detail.indexOf('2') > -1 ? true : false,
            weekList:copyWeek
        });
    },
    switch(e){
        const { id } = e.currentTarget.dataset
        const { weekList, weekId } = this.data
        if(id == weekId){
            return
        }
        let showData = weekList.filter(element => {
            return element.id == id
        });
        let copyData = this.deepClone(showData[0].rest)
        let dateObj = {
            use_start_time:showData[0].attend[0],
            use_end_time:showData[0].attend[1],
            restTime:copyData
        }
        this.setData({
            weekId:id,
            dateObj
        })
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj, weekId, weekList } = this.data
        dateObj[key] = value
        weekList.forEach((item)=>{
            if(item.id == weekId){
                let attend = [dateObj['use_start_time'],dateObj['use_end_time']]
                item.attend = attend
            }
        })
        this.setData({
          dateObj,
          weekList
        })
    },
    bindRestChange(e){
        const { key, id } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj, weekId, weekList } = this.data
 
        dateObj.restTime.forEach((item,idx)=>{
            if(idx == id){
                item[key] = value
            }
        })
        weekList.forEach((item)=>{
            if(item.id == weekId){
                item.rest = dateObj.restTime
            }
        })

        this.setData({
          dateObj,
          weekList
        })
    },
    //添加休息时间
    addRestTime(){
        const { dateObj, weekId, weekList } = this.data
        let obj = {
            rest_end_time:"00:00",
            rest_start_time:"00:00"
        }
        //原始 逻辑调整原本所有操作只针对当前项 现在针对所有
        // dateObj.restTime.push(obj)
        weekList.forEach((item)=>{
            // 原始 逻辑调整原本所有操作只针对当前项 现在针对所有
            // if(item.id == weekId){
            //     item.rest = dateObj.restTime
            // }
            item.rest.push(obj)
        })
        let weekRest = weekList.filter((item)=>{
            return item.id == weekId
        })

        dateObj.restTime = this.deepClone(weekRest[0].rest)

        this.setData({
            dateObj,
            weekList
        })
    },
    // 删除休息时间
    delRestTime(e){
        const { index } = e.currentTarget.dataset
        const { dateObj, weekId, weekList } = this.data
        // 原始 逻辑调整原本所有操作只针对当前项 现在针对所有
        // let filterRest = dateObj.restTime.filter((item,idx)=>{
        //     return idx != index
        // })
        // dateObj.restTime = filterRest
        weekList.forEach((item)=>{
            let filterRest = item.rest.filter((itm,idx)=>{
                return idx !=  index
            })
            item.rest = filterRest
            // 原始 逻辑调整原本所有操作只针对当前项 现在针对所有
            // if(item.id == weekId){
            //     item.rest = dateObj.restTime
            // }
        })

        let weekRest = weekList.filter((item)=>{
            return item.id == weekId
        })
        dateObj.restTime = this.deepClone(weekRest[0].rest)
        this.setData({
            dateObj,
            weekList
        })
    },
    //清空所有数据
    emptyData(){
        const { weekId, weekList } = this.data
        wx.showModal({
            title:'确认清除',
            success:(res)=>{
                if(res.confirm){
                    let dateObj = {
                        use_start_time:"",
                        use_end_time:"",
                        restTime:[]
                    }
                    weekList.forEach((item)=>{
                        // 原始 逻辑调整原本所有操作只针对当前项 现在针对所有
                        // if(item.id == weekId){
                            item.attend = []
                            item.rest = dateObj.restTime
                        // }
                    })
                    this.setData({
                        dateObj,
                        weekList
                    })
                }
            }
        })
       
    },
    deepClone(obj){
        let objClone = Array.isArray(obj)?[]:{};
        if(obj && typeof obj==="object"){
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if(obj[key]&&typeof obj[key] ==="object"){
                        objClone[key] = this.deepClone(obj[key]);
                    }else{
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    },
    // 数据可见范围    
    onDataRangeChange(e){
        this.setData({
            dataRangeVal: e.detail,
        });
    }
})