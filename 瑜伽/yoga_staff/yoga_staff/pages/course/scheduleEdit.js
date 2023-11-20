import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { editSchedule, addSchedule, searchScheduleName, scheduleBookingTime, configList, courseTypeList, deleteSchedule, staffList, addPrivateSchedule, delPrivateSchedule } = api
let weekEn = {
    0:'sunday',
    1:'monday',
    2:'tuesday',
    3:'wednesday',
    4:'thursday',
    5:'friday',
    6:'saturday',
}
Page({
    data:{
        list:[{
            name:'课程类型',
            value:'',
            placeholder:'选择课程类型',
            isHandle:true,
            key:1,
            selectId:'',
            list:[],
            submitName:'course_type_id',
            isShow:true,
        },{
            name:'课程名称',
            value:'',
            placeholder:'选择课程名称',
            isHandle:true,
            key:2,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'course_id'
            
        },{
            name:'授课教练',
            value:'',
            placeholder:'选择教练',
            isHandle:true,
            key:3,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'coach_staff_id'
            
        },{
            name:'上课教室',
            value:'',
            placeholder:'选择上课教室',
            isHandle:true,
            key:4,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'classroom_id'
        },{
            name:'课程日期',
            value:'',
            placeholder:'选择课程日期',
            isHandle:true,
            key:5,
            selectId:'',
            list:['1'],
            isShow:true,
            submitName:'date'
        },{
            name:'开始时间',
            value:'',
            placeholder:'选择开始时间',
            isHandle:true,
            key:6,
            selectId:'',
            list:['1'],
            isShow:true,
            submitName:'start_time'
        },{
            name:'结束时间',
            value:'',
            placeholder:'',
            isHandle:false,
            key:7,
            selectId:'',
            list:['1'],
            isShow:true,
            submitName:'end_time'
        },{
            name:'最小人数',
            value:'',
            placeholder:'最小人数',
            isHandle:true,
            key:8,
            selectId:'',
            list:['1'],
            isShow:true,
            submitName:'min_user'
        },{
            name:'最大人数',
            value:'',
            placeholder:'最大人数',
            isHandle:true,
            key:9,
            selectId:'',
            list:['1'],
            isShow:true,
            submitName:'max_user'
        },{
            name:'课程颜色',
            value:'',
            placeholder:'课程颜色',
            isHandle:false,
            key:10,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'color'
        },{
            name:'课程难度',
            value:'',
            placeholder:'',
            isHandle:false,
            key:11,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'star'
        },{
            name:'可预约时间',
            value:'',
            placeholder:'',
            isHandle:false,
            key:12,
            selectId:'',
            list:[],
            isShow:true,
            submitName:'bookingTime'
        }],
        popupData:{},
        popupShow:false,
        today:'',
        scheduleId:'',
        courseType:1,
        interval:'',
        isStart:false,
        preengage_num:0,
        close:'',
    
    },
    onLoad(options){
        let year = moment().format('YYYY-MM-DD')
        this.setData({
            today:year,
            scheduleId:options.scheduleId || '',
            courseType:options.type,
            close:options.close
        })        
        wx.setNavigationBarTitle({
            title:options.scheduleId ? '编辑排课' : '新增排课'
        })
        this.getCourseTypeList()
    },
    onUnload(){
        wx.removeStorageSync('staff-info')
        wx.removeStorageSync('scheduleInfo')
        wx.removeStorageSync('course-info')
        wx.removeStorageSync('courseId')
    },
    dataInitShowList(){
     //课程list显示结构初始化
     const { list, courseType } = this.data
     let p_show = [4,8,9,10,11,12]
     let allCourseList = {
         1:'团课',
         2:'小班课',
         3:'精品课',
         4:'私教课'
     }
     list.forEach((item)=>{
         item.isShow = courseType == 4 && p_show.indexOf(item.key) > -1 ? false : true
         if(item.key == 1){
             list[0].value = allCourseList[courseType]
             list[0].selectId = courseType
         }
         if(courseType == 4 && item.key == 7){
             item.isHandle = true
             item.placeholder = '请选择结束时间'
         }else if(courseType != 4 && item.key == 7){
            item.isHandle = false
            item.placeholder = ''
        }
     })
     this.setData({
         list
     })
    },
    dataInit(){
        let scheduleInfo = wx.getStorageSync('scheduleInfo')
        const { 
            id,
            classroom_id,
            classroom_name,
            coach_staff_id,
            coach_staff_name,
            color,
            course_name,
            course_type_name,
            date,
            difficulty_star,
            end_time,
            start_time,
            max_user,
            min_user,
            star_level,
            dates,
            course_id,
            course_type_id,
            status,
            preengage_num
        } = scheduleInfo
        const { list, interval, courseType } = this.data
        list.forEach(item => {
            //分类
            if(item.submitName == 'course_type_id'){
                item.selectId = course_type_id || ''
                item.value = course_type_name
                item.isHandle = false
            }
            //课程
            if(item.submitName == 'course_id'){
                item.selectId = course_id || ''
                item.value = course_name
                item.isHandle = false
            }
            //教练
            if(item.submitName == 'coach_staff_id'){
                item.selectId = coach_staff_id || ''
                item.value = coach_staff_name || ''
                item.isHandle = courseType == 4 ? false : true
            }
            //教室
            if(item.submitName == 'classroom_id'){
                item.selectId = classroom_id || ''
                item.value = classroom_name || ''
                
                item.isHandle = true
            }
            //课程日期
            if(item.submitName == 'date'){
                item.value = date
                item.isHandle = false
            }
            //开始时间
            if(item.submitName == 'start_time'){
                item.selectId = start_time
                item.value = start_time
                item.isHandle =  courseType == 4 ? false : true
            }
            //结束时间
            if(item.submitName == 'end_time'){
                item.value = end_time
                item.isHandle = false
            }
            //最大值
            if(item.submitName == 'min_user'){
                item.selectId = min_user
                item.value = min_user
                item.isHandle = true
            }
            //最小值
            if(item.submitName == 'max_user'){
                item.selectId = max_user
                item.value = max_user
                item.isHandle = true
            }
            //颜色
            if(item.submitName == 'color'){
                item.value = color
                item.isHandle = false
            }
            //难度
            if(item.submitName == 'star'){
                item.value = star_level
                item.isHandle = false
            }
            //预约时间
            if(item.submitName == 'bookingTime'){
                let currentTime = date + ' ' + start_time
                let current = moment(moment(currentTime).format('HH:mm'),"HH:mm")
                let advanceTimes = current.clone().subtract(interval, "minutes").format("HH:mm");//提前多少分钟才可以预约
                item.value = date + ' ' + advanceTimes
                item.isHandle = false
            }
        });

        this.setData({
            list,
            isStart:status == 2,
            preengage_num,
        })
    },
    updateSelectData(obj){
        // 匹配数据 
        const { list, today, interval, scheduleId, courseType  } = this.data
        //读取课程所选基本数据
        let courseInfo = scheduleId ? wx.getStorageSync('scheduleInfo') : wx.getStorageSync('course-info')
        let staffInfo = wx.getStorageSync('staff-info')
        
        let coueseTime = courseInfo.duration
        if(obj.detail.key == 2 && courseInfo.id && courseType != 4){
            coueseTime = courseInfo.duration
            list[7].value = courseInfo.min_user
            list[8].value = courseInfo.max_user
            list[9].value = courseInfo.color
            list[10].value = this.startRating(courseInfo.difficulty_star)
            if(list[5].value){
                let currentTime = today + ' ' + list[5].value
                let current = moment(moment(currentTime).format('HH:mm'),"HH:mm")
                let endTimes = current.clone().add(coueseTime, "minutes").format("HH:mm");//结束时间
                let advanceTimes = current.clone().subtract(interval, "minutes").format("HH:mm");//提前多少分钟才可以预约
                list[6].value = endTimes
                list[11].value = advanceTimes
            }
        }
        //私教课程
        if(obj.detail.key == 2 && obj.detail.id.length && courseType == 4){
            console.log('obj.detail',obj.detail)
            list[1].list.forEach((item)=>{
                item.checked = obj.detail.id.indexOf(item.id) > -1 ? true : false
            })
            
        }
        
        list.forEach(item => {
            if(item.key == obj.detail.key){
                item.value = obj.detail.name
                item.selectId = obj.detail.id
            }
            //计算结束时间和可预约时间 团课  计算开始和结束时间 私教
            if(obj.detail.key == 6 && courseType != 4){
                let currentTime = today + ' ' + obj.detail.name
                if(item.key == 7){
                    let current = moment(moment(currentTime).format('HH:mm'),"HH:mm")
                    let endTimes = current.clone().add(coueseTime, "minutes").format("HH:mm");//结束时间
                    item.value = endTimes
                }
                if(item.key == 12){
                    let current = moment(moment(currentTime).format('HH:mm'),"HH:mm")
                    let advanceTimes = current.clone().subtract(interval, "minutes").format("HH:mm");//提前多少分钟才可以预约
                    item.value =  list[4].value + ' ' + advanceTimes
                }
            }else if(obj.detail.key == 5 && courseType == 4){
                //课程日期影响开始结束时间
                let privateTime = staffInfo.private_time_frame
                if(item.key == 6){
                    list[5].value = privateTime[weekEn[moment(obj.detail.name).day()]].on_duty
                    list[5].selectId = privateTime[weekEn[moment(obj.detail.name).day()]].on_duty
                }
                if(item.key == 7){
                    list[6].value = privateTime[weekEn[moment(obj.detail.name).day()]].off_duty
                    list[6].selectId = privateTime[weekEn[moment(obj.detail.name).day()]].off_duty
                }
            }else if(obj.detail.key == 3 && staffInfo.id && courseType == 4 && list[4].value){
                //教师影响开始结束时间
                let privateTime = staffInfo.private_time_frame
                if(item.key == 6){
                    list[5].value = list[4].value ? privateTime[weekEn[moment(list[4].value).day()]].on_duty : ''
                    list[5].selectId = list[4].value ? privateTime[weekEn[moment(list[4].value).day()]].on_duty : ''
                }
                if(item.key == 7){
                    list[6].value = list[4].value ? privateTime[weekEn[moment(list[4].value).day()]].off_duty : ''
                    list[6].selectId = list[4].value ? privateTime[weekEn[moment(list[4].value).day()]].off_duty : ''
                }
            }
        
        });
        //拉取课程
        if(obj.detail.key == 1 ){
            console.log('obj.detail.id',obj.detail.id)
            this.setData({
                courseType:obj.detail.id
            })
            this.dataInitShowList()
            this.getAllCourse(obj.detail.id)
            if(obj.detail.id == 4){
                this.getStaffList()
            }else{
                this.getConfigList()
            }
            list.forEach(item => {
                if(item.key !=1 ){
                    item.value = ''
                    item.selectId = ''
                }
            });
        }
        this.setData({
            popupShow:!this.data.popupShow,
            list:list,
        })
    },
    //组件盒子显示
    toggelePopup(e){
        const { item } = e.currentTarget.dataset
        const { list, courseType } = this.data
        let obj = { name:item.name, key:item.key, list:item.list, selectId:item.selectId, value:item.value}
        if(!item.isHandle){
            return
        }
        if(item.key == 6 && !list[1].value){
            wx.showModal({
                title:'请先选择课程名称',
                showCancel: false,
            })
            return
        }
        if(item.key == 2 && !list[0].value){
            wx.showModal({
                title:'请先选择课程类型',
                showCancel: false,
            })
            return
        }
        if(courseType == 4 && (item.key == 5 || item.key == 6 || item.key == 7) && !list[2].value){
            wx.showModal({
                title:'请先选择课程教练',
                showCancel: false,
            })
            return
        }
        if(courseType == 4 && (item.key == 6 || item.key == 7) && !list[4].value){
            wx.showModal({
                title:'请先选择课程日期',
                showCancel: false,
            })
            return
        }
        if(!item.list.length && (item.key == 2 || item.key ==3 || item.key == 4)){
            wx.showModal({
                title:`${item.key == 2 ? '暂无课程' : item.key == 3 ? '暂无教练' : item.key == 4 ? '暂无教室' : ''}`,
                showCancel: false,
            })
            return
        }
        if(item.key == 8 || item.key == 9){
            let max_min = list.filter((v)=>{
                let obj = v
                return (obj.key == 8 || obj.key == 9) && obj
            })
            console.log('max_min',max_min)
            wx.setStorageSync('maxMinNum', max_min)
        }
        this.setData({
            popupShow:!this.data.popupShow,
            popupData:obj
        })
    },
    //星星评级
    startRating(rate){
        let rateLevel = "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
        return rateLevel
    },
    //获取教练 教室 颜色列表
    getConfigList(){
        const { list, scheduleId } = this.data
        request({
            url:baseUrl + configList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.hideLoading()
                //数据组合
                const { staff, room, config, color } = res
                if(!staff.length){
                    wx.showModal({
                        title:'提示',
                        content:"请配置员工信息",
                        success:()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                    return
                }
                list[2].list = staff
                list[3].list = room
                list[9].list = color
                this.setData({
                    list,
                    interval:accDiv(config.before_the_course_subscribe,60)
                })

                //数据初始化
                if(scheduleId){
                    this.dataInit()
                }
            }
        })
    },
    getStaffList(){
        const { list, scheduleId } = this.data
        request({
            url:baseUrl + staffList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.hideLoading()
                //数据组合
                const { staff } = res
                if(!staff.length){
                    wx.showModal({
                        title:'提示',
                        content:"请配置员工信息",
                        success:()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                    return
                }
                list[2].list = staff
                this.setData({
                    list,
                })
                if(scheduleId){
                    this.dataInit()
                }
            }
        })
    },
    //获取课程类型分类 
    getCourseTypeList(){
        wx.showLoading()
        const { list, scheduleId, courseType } = this.data
        request({
            url:baseUrl + courseTypeList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                list[0].list = scheduleId ? res.slice(0,3) : res
                this.setData({
                    list,
                })
                this.dataInitShowList()
                if(courseType == 4){
                    this.getStaffList()
                }else{
                    this.getConfigList()
                }
                this.getAllCourse(courseType)
            }
        })
    },
    //获取所有排课名称
    getAllCourse(type){
        const { list, courseType } = this.data
        request({
            url:baseUrl + searchScheduleName,
            data:{
                name:'',
                course_type_ids:type || courseType
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                list[1].list = res
                this.setData({
                    list,
                })
            }
        })
        
    },
    handleBack(){
        const { scheduleId, preengage_num } = this.data
        //删除
        if(scheduleId && preengage_num > 0 ){
            wx.showModal({
                title:'提示',
                content:'该排课已有会员预约,删除后系统会代学员取消预约，确认删除',
                success:(res)=>{
                    if (res.confirm) {
                        this.deleteCourse(scheduleId)
                    }
                }
            })
            return
        }
        if(scheduleId){
            wx.showModal({
                title:'提示',
                content:'确认删除本节课?删除后学员不能再进行预约!',
                success:(res)=>{
                    if (res.confirm) {
                        this.deleteCourse(scheduleId)
                    }
                }
            })
            return
        }
        // 返回
        wx.navigateBack({
            delta: 1
        })
    },
    submitData(){
        const { isStart, courseType, scheduleId } = this.data
        if(courseType == 4 && scheduleId){
            wx.navigateBack({
                delta: 1, 
            })
            return
        }
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        //编辑操作
        if(scheduleId && isStart){
            wx.showModal({
                title:'课程已开始，不可更改',
                showCancel: false,
            })
            return
        }
        if(scheduleId){
            isPass.id = scheduleId
            this.editCourse(isPass)
            return
        }
        //添加
        
        this.addCourse(isPass)
    },
    //数据校验
    verifyData(){
        const { list, courseType } = this.data
        let submitDataList = this.toObj(list)
        for(let key in submitDataList){
            if(!submitDataList[key] && key != 'classroom_id'){
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        return submitDataList
        
    },
    toObj(list){
        const { courseType } = this.data
        let info = {}
        let idArr = [1,2,3,4]
        let isNotVerify = ['coach_staff_id','course_id','course_type_id','date','end_time','start_time']
        list.forEach((item)=>{
            if(courseType == 4 && isNotVerify.indexOf(item.submitName) > -1){
                if(idArr.indexOf(item.key) > -1){
                    info[item.submitName] = item.selectId
                }else{
                    info[item.submitName] = item.value
                }
            }else if(courseType !=4 ){
                if(idArr.indexOf(item.key) > -1){
                    info[item.submitName] = item.selectId
                }else{
                    info[item.submitName] = item.value
                }
            }
            
        })
        return info
    },
    // 删除
    deleteCourse(scheduleId){
        // deleteSchedule
        const { courseType } = this.data
        let path = courseType == 4 ? delPrivateSchedule : deleteSchedule
        request({
            url:baseUrl + path,
            data:{
                id:scheduleId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title: '排课删除成功',
                    showCancel: false,
                })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },1000)
            }
        })
    },
    // 编辑
    editCourse(data){
        // editSchedule, 
        request({
            url:baseUrl + editSchedule,
            data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title: '课程编辑成功',
                    showCancel: false,
                })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },1000)
                
            }
        })
    },
    // 添加
    addCourse(data){
        // addSchedule
        const { list, courseType, close } = this.data
        let path = courseType == 4 ? addPrivateSchedule : addSchedule
        let staffInfo = wx.getStorageSync('staff-info')
        let privateTime = {}
        if(courseType == 4){
            privateTime = staffInfo.private_time_frame
            data.private_time = privateTime[weekEn[moment(list[4].value).day()]]
        }
        request({
            url:baseUrl + path,
            data,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title: '添加成功',
                    showCancel: false,
                })
                
                setTimeout(()=>{
                    if(close == 1){
                        wx.redirectTo({
                            url:`/pages/course/schedule?type=${courseType == 4 ? 4 : 1}`
                         })
                    }else{
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                },1000)
            }
        })
    },
   
})