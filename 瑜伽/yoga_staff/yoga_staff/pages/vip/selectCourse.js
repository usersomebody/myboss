import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const { getCourseList } = api
const app = getApp()
Page({
    data:{
        courseType:[],
        type:'',
        course:[],
        selectId:[1,2,3,4],
        isLoad:false
    },
    onLoad(options){
        this.setData({
            type:options.id
        })
        this.getCourseList()
    },
    getCourseList(){
        wx.showLoading({
            title:'loading...'
        })
        const { type } = this.data
        request({
            url:baseUrl + getCourseList,
            data:{
                course_type_ids:type,
                page:1,
                limit:100,
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let supportList = app.globalData.supportCourse
                let selectType = supportList.filter((item)=>{
                    return item.id == type
                })
                console.log('selectType',selectType)
                
                let selectId = selectType[0].course_name.map((item)=>{
                    return item.id
                })
                console.log('selectId',selectId)
                res.list.forEach(element => {
                    element.checked = selectId.indexOf(element.id) > -1 ? true : false
                });
                this.setData({
                    course:res.list,
                    isLoad:true
                })
                wx.hideLoading()
            }
        })
    },
    switch(e){
        const { id } = e.currentTarget.dataset
        const { course } = this.data

        course.forEach((item)=>{
            item.checked = item.id == id ? !item.checked : item.checked
        })

        this.setData({
            course
        })
    },
    save(){
        const { course, type } = this.data
        let selectData = course.filter((item)=>{
            return item.checked
        })
        let supportList = app.globalData.supportCourse
        if(supportList.length){
            supportList.forEach(element => {
                element.course_name = element.id == type ? selectData : element.course_name
            });
            app.globalData.supportCourse = supportList
        }
        wx.navigateBack({
            delta: 1, 
        })
    }
})