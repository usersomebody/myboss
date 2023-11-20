// pages/my/my.js
import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { accDiv, telReg, formatFullTime, setStoreId } from '../../utils/common.js'
import { request } from '../../utils/util.js'
const app = getApp()
const { baseUrl } = app.globalData
// cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/b31ae5f9337168b0be2a73b2efbfb87a.png',

// cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/e73e3c42bbc6ceed609591866766bde8.png',

// cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/05abf5c315bdf3c07437fcce0ecf5551.png',

// cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/e7e183b3fe5c143afe6d62affce3a434.png',

Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_url: '/imgs/head_url.png',
    nickname: '',
    isLogin: false,
    expiration_time: '',
    subscribe_times: 0,
    days: 0,

    participant_id: '',
    cutDown:{},
    isActivityTime:false,
    avtivityOver:false,
    nocard:false,
    statusBarHeight:0,
    

    //活动专区
    activityList:[],
    //个人中心
    myList:[{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/73550ca71302df5e36480cfb138be2a0.png",
      type:1,
      name:"我的会员卡",
      url:'/pages/mycard/mycard',
      valida:1
    },
    // {
    //   icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_report.png",
    //   type:1,
    //   name:"我的体测报告",
    //   url:'/pages/weightReport/weightReport',
    //   // url:'/pages/bodyData/bodyDataList',
      
    //   valida:0
    // },
    // },{
    //   icon:"/imgs/my-icon1.png",
    //   type:1,
    //   name:"初始体重",
    //   url:'/pages/initWeight/initWeight',
    //   valida:0
    // },{
    //   icon:"/imgs/my-icon2.png",
    //   type:1,
    //   name:"目标体重",
    //   url:'/pages/targetWeight/targetWeight',
    //   valida:0
    // },{
      {
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_weight.png",
      type:1,
      name:"我的体测报告",
      // url:'/pages/weighRecord/weighRecord',
      url:'/pages/bodyData/bodyDataList',
      valida:0
    },{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_leave.png",
      type:1,
      name:"请假",
      url:'/pages/leave/leave',
      valida:0
    },{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220126/9497620e61cc6ae97998f8ecf63d1d64.png",
      type:1,
      name:"我的积分",
      url:'/pages/integral/index',
      valida:0
    },{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210927/77dd0c3b4e1ce0d056063f281fb5bf8b.png",
      type:2,
      name:"推荐给朋友",
      openType:'share',
      url:''
    },{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210927/71ea518df9c18e3e1441137896d4e49f.png",
      type:1,
      name:"意见与反馈",
      url:'',
      valida:0
    },{
      icon:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_kefu.png",
      type:2,
      name:"联系客服",
      openType:'contact',
      url:''
    }],
    iPhonex:false
    
  },
  //获取会员卡信息
  get_cardInfo() {
    let that = this
    let url = app.globalData.baseUrl + '/applet/user',
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getcard',
      store_id
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          that.setData({
            expiration_time: res.data.data[0].use_end_time
          })
        } else {
          that.setData({
            nocard: true
          })
        }
      }
    })
  },
  //获取用户信息
  get_weighInfo() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getuserinfo',
      store_id
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          wx.setStorageSync("user_type", res.data.data.user_type)
          this.setData({
            days: res.data.data.days,
            subscribe_times: res.data.data.subscribe_times,
            nocard:res.data.data.user_type == 1 ? false : true
          })
        }
      }
    })
  },
  //立即登录
  handle_login() {
    let redirectUrl = encodeURIComponent('/pages/my/my')
    wx.navigateTo({
      url: `/pages/login/login?path=${redirectUrl}`,
    })
  },
  // 分享
  share() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  //个人主页
  look_myPage() {
    if (!this.data.isLogin) {
      this.handle_login()
      return false
    }
    wx.navigateTo({
      url: '/pages/myPage/myPage',
    })
  },
  formatTime(time){
    if(!time){
        return moment().format('YYYY/MM/DD HH:mm:ss')
    }
    return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
  },
  toActivity(e){
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/activity/index?type=' + type,
    })
  },
  //页面跳转
  toJump(e){
    const { url, valid } = e.currentTarget.dataset
    const { nocard } = this.data
    if (!this.data.isLogin) {
      this.handle_login()
      return false
    }
    //验证跳转
    if(url && valid){
      if (nocard) {
        wx.showModal({
          title: '暂无会员卡'
        })
        return
      }
      wx.navigateTo({
        url:url,
      })
      return
    }
    //直接跳转
    wx.navigateTo({
      url:url,
    })
  },
  //获取活动分类
   getActivityType() {
     console.log('1')
    let url = app.globalData.baseUrl + api.activityData,
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'activity.getactivitycat',
      store_id
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
   request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        // 对数据做一波处理 转盘和拼团暂时不存子
        that.setData({
          activityList:that.formatTypeListData(res,1)
        })
      }
    })
  },
  //处理type数据
  formatTypeListData(list,type){
    let addData = [{
      id:-1,
      name:'我参与的'
    },{
      id:0,
      name:'全部活动'
    }]
    if(type == 1){
      return list
    }

    list = [...list,...addData]
    return list 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(options.store_id){
      setStoreId(options.store_id)
      
    }
    
    this.setData({
      statusBarHeight:app.globalData.statusBarHeight,      
      iPhonex:app.globalData.isIphoneX || false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let token = wx.getStorageSync('token');
    if (!token) {
      this.setData({
        isLogin: false
      })
    } else {
      let userinfo = wx.getStorageSync('userinfo');
      let head_url = userinfo.avatarUrl,
        nickname = userinfo.nickName;
      this.setData({
        head_url,
        nickname,
        token,
        isLogin: true
      })
      this.get_cardInfo();
      this.get_weighInfo();
    }
    this.getActivityType()
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let store_id = wx.getStorageSync('store_id')
    return {
      title: '',
      path: `/pages/index/index?store_id=${store_id}`,
      imageUrl: ''
    }
  }
})