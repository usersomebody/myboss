import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { courseBookingList, bookingSign, bookingCancle, cancleQueue } = api
Page({
  data:{
    teacher:{},
    list:[],
    courseId:'',
    page: 1,
    count: 20,
    totalCount: 0,
    loading:false,
    isLast:false,
    courseType:1,
    courseBookingDate:'',
    cid:'',
    changeNumber:1,
    statusMap:{
      1:'成功',
      2:'已取消',
      3:'完成',
      4:'已旷课',
      5:'开课失败',
      6:'排队中',
      7:'排队失败'
    },
    status:{
      2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220311/26a74d949d1dc24622f49d27fe7c4f95.png',
      3:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/635da73c11581a8c3e600e50bb0e1622.png',
      4:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/275b7bd94372890108e5de24fba334ce.png',
      5:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/9d97d1e220a75ff4a0ace43d1ec49047.png'
    }
  },
  onLoad(options){
    this.setData({
        courseId:options.courseId,
        cid:options.cid,
        courseType:options.type,
        courseBookingDate:options.checkDate
    })
  },
  onShow(){
    this.setData({
      page:1,
      list: [],
      isLast:false,
      totalCount: 0,
    })
    this.getBookingList(this.contactList)
  },
  onReachBottom: function () {
    if (this.data.isLast) return
    this.data.page++
    this.setData({
      page: this.data.page
    })
    this.getBookingList(this.contactList)
  },
  getBookingList(callback){
    let that = this
    const { page, count, courseId, courseType } = this.data
    request({
      url:  baseUrl + courseBookingList,
      data: {
        page,
        limit:count,
        id:courseId,
        course_type:courseType,
        cancel_type:1
      },
      isTologin:true,
      method:'POST',
      success(res) {
        if (callback) callback(res.list)
        that.setData({
          list: that.data.list,
          totalCount: res.count
        })
        // <!-- card_type_name 状态 1成功 2取消 3完成(表示正常上课) 4未上课 5开课失败 6 排队中 7 排队失败 -->
        
        if (isLast(page, that.data.totalCount, count)) {
          that.setData({
            isLast: true
          })
        }
        that.setData({
          loading: false
        })
      },
    })
  },
  cncleLine(e){
    cancleQueue
    const { id } = e.currentTarget.dataset
    request({
      url:baseUrl + cancleQueue,
      data:{
          id
      },
      method: 'POST',
      isTologin:true,
      success: (res => {
        wx.showModal({
          title:'取消成功',
          showCancel: false,
        })
        this.setData({
          list: [],
          totalCount: 0
        })
        this.getBookingList(this.contactList)
      })
    })
  },
  cancle(e){
    const { id } = e.currentTarget.dataset
    request({
      url:baseUrl + bookingCancle,
      data:{
          id
      },
      method: 'POST',
      isTologin:true,
      success: (res => {
        wx.showModal({
          title:'取消成功',
          showCancel: false,
        })
        this.setData({
          list: [],
          totalCount: 0,
          changeNumber:new Date().getTime(),
        })
        this.getBookingList(this.contactList)
      })
    })
  },
  sign(e){
    const { id } = e.currentTarget.dataset
    request({
      url:baseUrl + bookingSign,
      data:{
          id,
          is_mend:2
      },
      method: 'POST',
      isTologin:true,
      success: (res => {
        wx.showModal({
          title:'签到成功',
          showCancel: false,
        })
        this.setData({
          list: [],
          totalCount: 0,
          changeNumber:new Date().getTime(),
        })
        this.getBookingList(this.contactList)
      })
    })
  },
  // getBaseInfo(){
  //   // 拉取基本信息
  //   let that = this
  //   const { courseId } = this.properties
  //   request({
  //     url: baseUrl + courseBookingDetail,
  //     data: {
  //       id:courseId
  //     },
  //     isTologin:true,
  //     method:'POST',
  //     success(res) {
  //       that.setData({
  //           teacher:res
  //       })
  //       that.judgePriceValid()
  //     },
  //   })
  // },
  contactList(list) {
    this.data.list = this.data.list.concat(list)
  },
})