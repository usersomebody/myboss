import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import moment from '../../utils/moment.js'

const app = getApp()
const { addUser, cardDetail, addNewCard, editCard, delCard, getCourseConfig } = api
Page({
    data:{
        showList:[{
            name:'卡名称',
            key:'name',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false,
            disable:false
        },{
            name:'卡类型',
            key:'type',
            placeholder:'必填',
            value:'期限卡',
            list:[{
                id:1,
                name:'期限卡'
            },{
                id:2,
                name:'次数卡'
            },{
                id:3,
                name:'储值卡'
            },{
                id:4,
                name:'计时卡'
            }],
            index:0,
            selectId:1,
            require:true,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'卡属性',
            key:'card_attr_id',
            placeholder:'选填',
            value:'普通卡',
            list:[{
                id:1,
                name:'普通卡'
            },{
                id:2,
                name:'私教卡'
            }],
            selectId:1,
            index:0,
            require:true,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'适用门店',
            key:'store_ids',
            placeholder:'选填',
            value:'',
            require:true,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            link:'/pages/course/storeList'
        },{
            name:'售卖金额',
            key:'price',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false,
        },{
            name:'卡内额度',
            key:'money',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false,
            isShow:true
        },{
            name:'使用天数',
            key:'day',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            link:'/pages/vip/useDay'
        },{
            name:'生效方式',
            key:'use_type',
            placeholder:'选填',
            value:'',
            list:[{
                id:'0',
                name:'立即生效'
            },{
                id:'1',
                name:'约课生效'
            }],
            index:'',
            require:true,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'使用限制',
            key:'leave_use',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            link:'/pages/vip/useLimit'
        },{
            name:'请假限制',
            key:'leave_limit',
            value:'',
            placeholder:'选填',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            link:'/pages/vip/leaveLimit'
        },{
            name:'支持课程',
            key:'course_arr',
            value:'',
            placeholder:'选填',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            link:'/pages/vip/supportCourse'
        }],
        cardType:{
            1:{
                id:1,
                name:'期限卡',
                key:''
            },
            2:{
                id:2,
                name:'次数卡',
                key:'assets_num'
            },
            3:{
                id:3,
                name:'储值卡',
                key:'assets_money'
            },
            4:{
                id:4,
                name:'计时卡',
                key:'assets_time'
            }
        },
        editId:'',
        sid:'',
        isSameStore:true
    },
    onLoad(options){
        let isSameStore = options.sid ? options.sid == wx.getStorageSync('store_id') : true
        this.setData({
            editId:options.id,
            sid:options.sid || '',
            isSameStore:isSameStore,
        })
        if(options.id){
            if(!isSameStore){
                wx.showModal({
                    title:'无权限操作其它场馆的会员卡',
                    showCancel:false,
                })
            }
            wx.setNavigationBarTitle({
                title: '编辑会员卡',
            })
            this.getVipCardInfo()
        }

        this.getAllStore()
    },
    onShow(){
        //获取当前选中的店铺数据
        let selectStore = wx.getStorageSync('checkStoreNames') || []
        if(selectStore.length){
            this.setData({
                showList:this.updateAssignment('store_ids',selectStore.join(','),1)
            })
        }

        let useDay = wx.getStorageSync('useday') || {}//使用天数
        if(useDay.radio){
            this.setData({
                showList:this.updateAssignment('day',useDay.day,3,useDay.radio)
            })
        }

        //支持课程
        if(app.globalData.supportCourse && app.globalData.supportCourse.length){
            this.setData({
                showList:this.updateAssignment('course_arr',app.globalData.supportCourse,3)
            })
        }

        //请假限制
        if(app.globalData.leaveLimit && app.globalData.leaveLimit.is_leave_infinite){
            this.setData({
                showList:this.updateAssignment('leave_limit',app.globalData.leaveLimit.is_leave_infinite_name,3,app.globalData.leaveLimit)
            })
        }

        //使用限制
        if(app.globalData.useLimit && app.globalData.useLimit.use_radio){
            let useLimit = app.globalData.useLimit 
            let useLimitName = useLimit.use_radio == 1 ? '全时段' : '自定义'
            this.setData({
                showList:this.updateAssignment('leave_use',useLimitName,1)
            })
        }
    },
    onUnload(){
        wx.removeStorageSync('checkStoreNames')
        wx.removeStorageSync('checkStoreIds')
        wx.removeStorageSync('useday')
        app.globalData.supportCourse = []
        app.globalData.leaveLimit = {}
        app.globalData.useLimit = {}
    },
    cancle(){
        const { editId } = this.data
        if(editId){
            wx.showModal({
                title:'确认删除',
                success:(res)=>{
                    if(res.confirm){
                        this.delData()
                    }
                }
            })
            return
        }
        wx.navigateBack({
            delta: 1
        })
    },
    delData(){
        const { editId } = this.data
        request({
            url:baseUrl + delCard,
            data:{
                id:editId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'删除成功',
                    showCancel:false,
                    success(){
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })
    },
    verifyData(){
        const { showList } = this.data
        let submitDataList = this.toObj(showList)
        for(let key in submitDataList){
            let checkData = showList.filter((item)=>{
                if(item.key == key){
                    return {require:item.require}
                }
            })
            if(!submitDataList[key] && checkData.length && checkData[0].require){
                console.log({key,submitDataList,checkData})
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        console.log('submitDataList',submitDataList)
        return submitDataList
        
    },
    toObj(list){
        const { cardType } = this.data
        let info = {}
        let idArr = ['type','use_type','card_attr_id']
        list.forEach((item)=>{
            if(idArr.indexOf(item.key) > -1){
                info[item.key] = item.selectId
            }else if(item.key == 'store_ids'){
                info[item.key] = wx.getStorageSync('checkStoreIds') || []
            }else if(item.key == 'money'){
                console.log('item',item)
                if(item.selectId != 1){
                    info[cardType[list[1].selectId].key] = item.value
                }
            }else if(item.key == 'leave_use'){
                info = {...info,...app.globalData.useLimit}
            }else if(item.key == 'leave_limit'){
                info = {...info,...app.globalData.leaveLimit}
            }else if(item.key == 'course_arr'){
                let validData = app.globalData.supportCourse.filter((item)=>{
                    return item.switchVal
                })
                let finalData = validData.map((itm)=>{
                    let obj = {
                        type:itm.id,
                        ids:itm.course_name.map((v)=>{
                            return v.id
                        })
                    }
                    return obj
                })
                info['limit_course'] = finalData
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
    sure(){
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        this.submit(isPass)
    },
    submit(data){
        const { editId } = this.data
        let url = editId ? editCard : addNewCard
        if(editId){
            data.id = editId
        }
        let useDay = wx.getStorageSync('useday') || {}
        data.is_unlimited = useDay.radio == 2 ? 0 : 1
        data.is_leave_infinite = data.is_leave_infinite == 1 ? 1 : 2
        data.use_week = data.use_radio == 2 ? data.use_week : []
        let limit_course = data.limit_course.map((item)=>{
            let obj = item
            return item.ids.length ? obj : ''
        })
        data.limit_course = limit_course.filter((item)=>{
            return item
        })
        
        request({
            url:baseUrl + url,
            data:data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:editId ? '修改成功' : '添加成功',
                    showCancel:false,
                    success(){
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        let showList = this.updateAssignment(key,value,1)
        this.setData({
            showList, 
        })
    },
    bindPickerChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,2)
        if(key == 'type'){
            showList.forEach((item)=>{
                if(item.key == 'money'){
                    if(value == 0){
                        item.isShow = true
                    }else{
                        item.isShow = false
                    }
                }
            })
        } 
        this.setData({
            showList
        })
    },
    updateAssignment(key,value,type,selectId){
        const { showList } = this.data
        if(type == 1){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                }
            })
        }else if(type == 2){
            showList.forEach((item)=>{
                if(item.key == key){
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    console.log('selectData',selectData)
                    item.selectId = selectData[0].id ? selectData[0].id : ''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }else if(type == 3){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                    item.selectId = selectId
                }
            })
        }

        return showList
    },
    getData(e){
        const { link } = e.currentTarget.dataset
        if(!link){
            return
        }
        wx.navigateTo({
            url:link
        })
    },
    getVipCardInfo(){
        const { editId } = this.data
        request({
            url:baseUrl + cardDetail,
            data:{
                id:editId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                if(res.use_week.length){
                    res.use_week = res.use_week.map(element => {
                        return element
                    });
                }
                this.initData(res)
            }
        })
    },
     // 获取当前支持的店铺列表数据
     getAllStore(){
         const { showList, editId } = this.data
        request({
            url:baseUrl + getCourseConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                console.log('res',res)
                const { chainStore } = res
                if(!editId){
                    let storeInfo = chainStore.filter((item)=>{
                        return item.id ==  wx.getStorageSync('store_id')
                    })
                    this.setData({
                        showList:this.updateAssignment('store_ids',storeInfo[0].name,3,storeInfo[0].id)
                    })
                    wx.setStorageSync('checkStoreIds',[storeInfo[0].id + ''])
                    wx.setStorageSync('checkStoreNames',[storeInfo[0].name])
                }
                
            }
        })
    },
    toObjData(data){
        let infoData = {}
        data.forEach((item)=>{
            infoData[item.type] = item
        })
        return infoData
    },
    //编辑初始化数据
    initData(data){
        //课程支持模块
        let typeList = {
            1:'团课',
            2:'小班课',
            3:'精品课',
            4:'私教课',
        }
        console.log('data',data)
        const { course_name } = data
        let course_name_list = [{
            type:1,
            course_name:[],
            id: 1,
            link: "/pages/vip/selectCourse?id=1",
            name: "团课",
            switchVal: 0
        },{
            type:2,
            course_name:[],
            id: 2,
            link: "/pages/vip/selectCourse?id=2",
            name: "小班课",
            switchVal: 0
        },{
            type:3,
            course_name:[],
            id: 3,
            link: "/pages/vip/selectCourse?id=3",
            name: "精品课",
            switchVal: 0
        },{
            type:4,
            course_name:[],
            id: 4,
            link: "/pages/vip/selectCourse?id=4",
            name: "私教课",
            switchVal: 0
        }]
        let selectCourse = course_name.map((item)=>{
            let obj = item
            obj.switchVal = item.course_name.length ? 1 : false
            obj.name = typeList[item.type]
            obj.id = item.type
            obj.link = `/pages/vip/selectCourse?id=${item.id}`,
            obj.course_name = item.course_name.map((itm)=>{
                let objData = itm
                objData.checked = true
                objData.id = itm.course_id
                return objData
            })
            return obj
        })
        let selectCourseData = this.toObjData(selectCourse)
        console.log('selectCourseData',selectCourseData)
        let supportCourseData = course_name_list.map((item)=>{
            let obj = item
            if(selectCourseData[item.type]){
                obj = selectCourseData[item.type]
            }
            return obj
        })
        app.globalData.supportCourse = supportCourseData
        
        const { showList, cardType, isSameStore } = this.data
        showList.forEach(item => {
            item.value = data[item.key] ? data[item.key] : ''
            //店铺数据
            if(item.key == 'store_ids'){
                item.value = data['store_name']
                item.selectId = data[item.key]
                wx.setStorageSync('checkStoreIds',data['store_ids'])
                wx.setStorageSync('checkStoreNames', data['store_name'])
                item.link = isSameStore ? item.link : ''
            }else if(item.key == 'card_attr_id' || item.key == 'type'){
                let card_attr_info = item.list[data[item.key] - 1]
                item.value = card_attr_info.name
                item.index = data[item.key] - 1
                item.selectId = card_attr_info.id
                item.isPicker = false
            }else if(item.key == 'use_type'){
                let card_attr_info = item.list[data[item.key]]
                item.value = card_attr_info.name
                item.index = data[item.key]
                item.selectId = card_attr_info.id
                item.isPicker = isSameStore ? item.isPicker : false
            }else if(item.key == 'money'){
                item.value = data['type'] == 1 ? '' : data[cardType[data['type']].key]
                item.selectId = data['type']
                item.isShow = data['type'] == 1 ? true : false 
                item.isInput = isSameStore ? item.isInput : false
            }else if(item.key == 'price'){
                item.isInput = isSameStore ? item.isInput : false
            }else if(item.key == 'leave_limit'){
                app.globalData.leaveLimit = {
                    is_leave_infinite:data['is_leave_infinite'],
                    is_leave_infinite_name:data['is_leave_infinite'] == 1 ? '不限制' : data['is_leave_infinite'] == 2 && !data['leave_limit_num'] ? '不允许' : '允许',
                    leave_limit_num:data['leave_limit_num'],
                    leave_limit_day:data['leave_limit_day'],
                    leave_limit_day_max:data['leave_limit_day_max'],
                    leave_deduct:data['leave_deduct'],
                }
                item.value = app.globalData.leaveLimit.is_leave_infinite_name
                item.link = isSameStore ? item.link : ''
            }else if(item.key == 'leave_use'){
                app.globalData.useLimit = {
                    use_start_date:data['use_start_date'] ? data['use_start_date'] : '',
                    use_end_date:data['use_end_date'] ? data['use_end_date'] : '',
                    use_start_time:data['use_start_time'],
                    use_end_time:data['use_end_time'],
                    use_week:data['use_week'],
                    limit_num:data['limit_num'] == 0 ? '' : data['limit_num'],
                    limit_type:data['limit_type'],
                    use_radio:(data['use_start_date'] && data['use_end_date']) || (data['use_start_time'] && data['use_end_time']) || data['use_week'].length ? 2 : 1
                }
                item.value = (data['use_start_date'] && data['use_end_date']) || (data['use_start_time'] && data['use_end_time']) || data['use_week'].length ? '自定义' : '全时段'
                item.link = isSameStore ? item.link : ''
            }else if(item.key == 'course_arr'){
                item.value = selectCourse
                item.link = isSameStore ? item.link : ''
            }else if(item.key == 'day'){
                item.value = data['is_unlimited'] == 1 ? '长期有效' : data['day']
                wx.setStorageSync('useday', {radio: data['is_unlimited'] == 1 ? data['is_unlimited'] : 2, day:data['is_unlimited'] == 1 ? '长期有效' : data['day']})
                item.link = isSameStore ? item.link : ''
            }else if(item.key == 'name'){
                item.disable = true
            }
            
        });
        this.setData({
            showList
        })
    },
})