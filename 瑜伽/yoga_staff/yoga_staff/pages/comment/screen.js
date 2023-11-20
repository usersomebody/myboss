import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import moment from '../../utils/moment.js'

const app = getApp()
const { commentIndex } = api
Page({
    data:{
        filterDateList:[{
            id:1,
            name:'近一周'
        },{
            id:2,
            name:'近30天'
        },{
            id:3,
            name:'自定义'
        }],
        course:[],
        staff:[],
        stars:[{
            id:'0',
            name:'全部',
            checked:true,
        },{
            id:5,
            name:5,
            checked:false,
        },{
            id:4,
            name:4,
            checked:false,
        },{
            id:3,
            name:3,
            checked:false,
        },{
            id:2,
            name:2,
            checked:false,
        },{
            id:1,
            name:1,
            checked:false,
        }],
        hasCommentList:[
            {
                id:1,
                name:'是',
                checked:false,
            },
            {
                id:2,
                name:'否',
                checked:false,
            }
        ],
        dateObj:{
            use_start_date:'',
            use_end_date:'',
        },
        currentDate:'',
        dateId:3,
        isLoaded:false
    },
    onLoad(){
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
        })
        this.getConfig()
        
    },
    onShow(){
        
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj } = this.data
        let isBeyond = false
        if(key == 'use_end_date' && dateObj.use_start_date){
            isBeyond = moment(dateObj.use_start_date).diff(moment(value), 'seconds') > 0 ? true :false
        }

        if(key == 'use_start_date' && dateObj.use_end_date){
            isBeyond = moment(value).diff(moment(dateObj.use_end_date), 'seconds') > 0 ? true :false
        }
        if(isBeyond){
            wx.showModal({
                title:'开始时间不可以大于结束时间',
                showCancel:false,
            })
            return
        }
        dateObj[key] = value
        console.log('dateObj',dateObj)
        this.setData({
          dateObj
        })
    },
    switchDate(e){
        const { id } = e.currentTarget.dataset
        const { dateId } = this.data
        if(dateId == id ){
            return
        }
        let obj = {
            use_start_date: '请选择',
            use_end_date:'请选择'
        }
        if(id == 1 || id == 2){
            obj.use_start_date = moment().subtract(`${id == 1 ? 7 : id == 2 ? 30 : ''}`, 'days').format('YYYY-MM-DD')
            obj.use_end_date = moment().format('YYYY-MM-DD')
        }
        this.setData({
            dateId:id,
            dateObj:obj
        })
    },
    getConfig(){
        const { stars, hasCommentList } = this.data
        const subData = app.globalData.submitComment
        request({
            url:baseUrl + commentIndex,
            data:{},
            method: 'POST',
            isTologin:true,
            success: (res => {
                const { course, staff } = res
                let first = { id:0,name:'全部'}
                course.unshift(Object.assign({},first))
                staff.unshift(Object.assign({},first))
                // // //课程
                course.forEach(element => {
                    // element.checked = subData && subData.course_id && element.id == subData.course_id ? true : false 
                    element.checked = subData && subData.course_id ? element.id == subData.course_id ? true : false : element.id == 0 ? true : false
                });
                // 教师
                staff.forEach(element => {
                    // element.checked = subData && subData.coach_staff_id && element.id == subData.coach_staff_id ? true : false
                    element.checked = subData && subData.coach_staff_id ? element.id == subData.coach_staff_id ? true : false : element.id == 0 ? true : false
                    
                });
                // 评分
                stars.forEach(element => {
                    // element.checked = subData && subData.star && element.id == subData.star ? true : false
                    element.checked = subData && subData.star ? element.id == subData.star ? true : false : element.id == 0 ? true : false
                    
                });
                // 内容
                hasCommentList.forEach(element => {
                    element.checked = subData && subData.content && element.id == subData.content ? true : false
                });
                //时间
                let obj = {
                    use_start_date: subData && subData.start_time,
                    use_end_date:subData && subData.end_time
                }
                console.log('course',course)
                this.setData({
                    course, 
                    staff,
                    stars,
                    hasCommentList,
                    isLoaded:true,
                    dateObj:obj
                })
            })
        })
    },
    updateList(data){
        const { list, type } = data.detail
        console.log('返回的数据：', list,type)
        if(type == 'course'){
            this.setData({
                course:list
            })
            return
        }
        if(type == 'staff'){
            this.setData({
                staff:list
            })
            return
        }
        if(type == 'stars'){
            this.setData({
                stars:list
            })
            return
        }
        if(type == 'content'){
            this.setData({
                hasCommentList:list
            })
            return
        }
    },
    sure(e){
        const { type } = e.target.dataset
        const { course, staff, stars, hasCommentList, dateObj} = this.data
        if(type == 1){
            wx.navigateBack({
                delta: 1,
            })
            return
        }
        let courseData = course[0].checked ? [] : course.filter((item)=>{
            if(item.checked){
                item.screenType = 'course'
            }
            return item.checked
        })
        let staffData = staff[0].checked ? [] : staff.filter((item)=>{
            if(item.checked){
                item.screenType = 'coach_staff_id'
            }
            return item.checked
        })
        let starData = stars[0].checked ? [] : stars.filter((item)=>{
            if(item.checked){
                item.screenType = 'star'
            }
            return item.checked
        })
        let contentData = hasCommentList.filter((item)=>{
            if(item.checked){
                item.screenType = 'content'
            }
            return item.checked
        })
        // 整合提交的数据
        let submitData = {
            start_time:dateObj.use_start_date,
            end_time:dateObj.use_end_date,
            course_id:courseData.length ? courseData[0].id : '0',
            coach_staff_id:staffData.length ? staffData[0].id : '0',
            star:starData.length ? starData[0].id : '0',
            content:contentData.length ? contentData[0].id : 0
        }
        submitData.showScreenList = [...courseData,...staffData,...starData,...contentData]
        app.globalData.submitComment = submitData
        wx.navigateBack({
            delta: 1,
        })
    }
})