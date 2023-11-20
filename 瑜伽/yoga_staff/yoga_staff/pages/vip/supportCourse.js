import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const { courseTypeList, getAllCourseForCard } = api
const app = getApp()
Page({
    data:{
        courseType:[],
        isLoad:false,
        supportList:[]
    },
    onLoad(){
        this.getCourseTypeList()
        this.getCourseForCard()
    },
    getCourseTypeList(){
        request({
            url:baseUrl + courseTypeList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let supportList = app.globalData.supportCourse

                res.forEach(item => {
                    item.switchVal = 0
                    item.link = `/pages/vip/selectCourse?id=${item.id}`,
                    item.course_name = []
                });
                this.setData({
                    courseType:supportList && supportList.length ? supportList : res,
                    isLoad:true,
                })
                // app.globalData.supportCourse = supportList && supportList.length ? supportList : res
            }
        })
    },
    getCourseForCard(){
        request({
            url:baseUrl + getAllCourseForCard,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                console.log('res',res)
                
            }
        })
    },
    getCourseData(e){
        const { checked, link } = e.currentTarget.dataset
        console.log({checked, link})
        const { courseType } = this.data
        if(!checked){
            wx.showModal({
                title:'请开启课程支持类型'
            })
            return
        }
        app.globalData.supportCourse = courseType
        wx.navigateTo({
            url: link
        })
    },
    switchChange(e){
        const { id, value } = e.currentTarget.dataset
        const { courseType } = this.data
        let courseList = {
            1:'团课',
            2:'小班课',
            3:'精品课',
            4:'私教课'
        }
        if(!value){
            wx.showModal({
                title:`请前往选择${courseList[id]}`,
                showCancel:false
            })
        }
        courseType.forEach(item => {
            if(item.id == id){
                item.switchVal = item.switchVal == 1 ? 0 : 1
            }
        });
        this.setData({
            courseType
        })
        app.globalData.supportCourse = courseType
    },
    cancle(){
        wx.navigateBack({
            delta: 1
        })
        // app.globalData.supportCourse = []
    },
    sure(){
        wx.navigateBack({
            delta: 1
        })
    },
})