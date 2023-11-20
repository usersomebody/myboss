import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { courseTypeList, groupCourseList, getCourseList } = api
Page({
    data:{
        page:1,
        limit:10,
        courseType:[],
        list:[],
        checkedId:1,
        isLast:false,
        totalCount:0,
        showData:[{
            name:'新增课程',
            link:'/pages/course/courseEdit',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/39c37ada8d05142a2522047c682f1e69.png'
        },{
            name:'设置',
            link:'/pages/booking/bookingConfig?type=1',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/3efd81d67eeb63b5ef0c876365618a0c.png'
        }],
    },
    onLoad(){
    },
    onShow(){
        this.setData({
            list:[],
            page:1,
            limit:10,
            totalCount:0
        })
        this.getCourseType()

        
        wx.removeStorageSync('checkStoreNames')
        wx.removeStorageSync('supportCard')
        wx.removeStorageSync('checkStoreIds')
        wx.removeStorageSync('checkedSupportIds')
        wx.removeStorageSync('checkedSupportList')
        wx.removeStorageSync('consume_data')
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getCourseList(this.contactList)
    },
    getCourseType(){
        const { courseType } = this.data
        request({
            url:baseUrl + courseTypeList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    courseType:res,
                })
                this.getCourseList(this.contactList)
            }
        })
    },
    getCourseList(callback) {
        const { checkedId, limit, page } = this.data
        request({
          url:baseUrl + getCourseList,
          isTologin:true,
          data:{
            course_type_ids:checkedId,
            page,
            limit,
          },
          method: 'POST',
          success: (res => {
            if (callback) callback(res.list)
            this.setData({
              list: this.data.list,
              totalCount: res.count
            })
            if (isLast(this.data.page, this.data.totalCount, this.data.limit)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          })
        }).catch((err)=>{
            this.setData({
                isLast: true
              })
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    goDetail(e){
        const { id, sid } = e.currentTarget.dataset
        wx.navigateTo({
            url: '/pages/course/courseEdit?id=' + id + '&sid=' + sid,
        })
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { checkedId, showData } = this.data
        if(id == checkedId){
            return
        }
        console.log('id',id)
        showData[1].link = `/pages/booking/bookingConfig?type=${id}`
        this.setData({
            checkedId:id,
            showData,
            page:1,
            limit:10,
            totalCount:0,
            list:[],
            isLast: false
        })
        this.getCourseList(this.contactList)
    },
})