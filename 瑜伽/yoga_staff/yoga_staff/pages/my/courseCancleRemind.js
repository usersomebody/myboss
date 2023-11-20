import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { cancelCourse } = api
Page({
    data:{
        list:[],
        statusArr:{
            1:{
                name:'成功',
                icon:''
            },
            2:{
                name:'取消',
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/9d97d1e220a75ff4a0ace43d1ec49047.png'
            },
            3:{
                name:'完成',
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/635da73c11581a8c3e600e50bb0e1622.png'
            },
            4:{
                name:'未上课',
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/275b7bd94372890108e5de24fba334ce.png'
            },
            5:{
                name:'开课失败',
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/9d97d1e220a75ff4a0ace43d1ec49047.png'
            },
            6:{
                name:'排队中',
                icon:''
            },
            7:{
                name:'排队失败',
                icon:''
            }
        }
        // 状态 1成功 2取消 3完成(表示正常上课) 4未上课 5开课失败 6 排队中 7 排队失败
        
    },
    onLoad(){
        this.getCancleCourse()
    },
    getCancleCourse(){
        request({
            url:baseUrl + cancelCourse,
            data:{
                
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    list:res.list
                })
            }
          })
    },
    toDetail(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url:'/pages/my/cancleBookingDetail?id=' + id
        })
    }
})