import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam } from '../../utils/common.js'
import { request } from '../../utils/util.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
  data: {
    recordList:[],
    startTime:"",
    endTime:'',
    showOverlayer:false,
    prizeNumber:''
  },
  onLoad(options){
    let url = 'pages/activity/luckyList'
    let str = formatParam(options)
    let formatUrl = `/${url}${str ? '?' + str : ''}`
    let redirectUrl = encodeURIComponent(formatUrl)
    if(options.sid){
        this.setData({
            store_id:options.sid,
        })
    }
     //页面进入必须授权登录
     let token = wx.getStorageSync('token');
     if(!token){
        wx.redirectTo({
            url: `/pages/login/login?path=${redirectUrl}`,
        })
        return
     }
    this.setData({
      activity_id:options.aid,
      statusBarHeight:app.globalData.statusBarHeight,
      isIphoneX: app.globalData.isIphoneX,
      activity_cat:options.cid || '',
      redirectUrl,
      startTime:options.start,
      endTime:options.end,
    })
    this.getList()
  },
  back(){
    wx.navigateBack({
        delta: 1
    })
  },
  //获取用户信息
  getList(reloadType) {
    const { isSameStore, user_id, activity_id, activity_cat } = this.data
    let url = baseUrl + api.activityWheelapplet
    let data = {
        method: 'activity.win',
        store_id: this.data.store_id || wx.getStorageSync('store_id') || '',
        activity_id,
        activity_cat
    }
    let header = {
        token: wx.getStorageSync('token') || ''
    }
    request({
        url,
        data,
        header,
        method: 'POST',
        success: (res) => {
            if(res == null){
                return
            }
            this.setData({
                recordList:res
            })
        }
    })
  },
  getNumber(e){
    const { number } = e.currentTarget.dataset
    this.setData({
        showOverlayer:!this.data.showOverlayer,
        prizeNumber:number
    })
  },
  toggleShowOver(){
      this.setData({
          showOverlayer:!this.data.showOverlayer
      })
  }
})