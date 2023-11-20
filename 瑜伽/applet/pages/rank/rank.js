// pages/rank/rank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOverlayer:false,
    token: null,
    list1: [],
    list2: [],
    my: {},
    rank: 0,
    statusBarHeight:0,
    shadowBox:{},
    sign:{
      1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_fir.png',
      2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_sec.png',
      3:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_three.png'
    }
  },
  //点赞
  give_like(e) {
    let tounionid = e.currentTarget.dataset.unionid;
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let store_id = wx.getStorageSync('store_id')
    let data = {
      method: 'user.giveLike',
      store_id,
      tounionid
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          wx.showToast({
            title: '点赞成功',
          })
          that.get_student();
        } else {

        }
      }
    })
  },
  //获取明星学员
  get_student() {
    let url = app.globalData.baseUrl + '/applet/preengageRecord ',
      that = this;
    let store_id = wx.getStorageSync('store_id')
    let data = {
      method: 'preengagerecord.getattendtimes',
      store_id,
      size: 10
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          let my = res.data.data.index;
          let arr = res.data.data.sort,
            arr1 = [],
            arr2 = [];
          for (let item of arr) {
            item.nickname = that.formatStr(item.nickname);
          }
          for (let i in arr) {
            if (i <= 2) {
              arr1.push(arr[i])
            } else {
              arr2.push(arr[i])
            }
          }
          if (my) {
            that.setData({
              my,
              rank: my.index
            })
          }
          that.setData({
            list1: arr1,
            list2: arr2,
            my: res.data.data.index
          })
        }
      }
    })
  },
  //截取字符串
  formatStr(str) {
    if (str && str.length > 1) {
      return str.substring(0, 1) + new Array(str.length).join('*')
    } else {
      return "*"
    }
  },
  back(){
    let url = getCurrentPages().length
    if(url == 1){
        wx.switchTab({
            url:'/pages/my/my'
        })
        return
    }
    wx.navigateBack({
        delta: 1
    })
  },
  handelBox(e){
    const { level, times } = e.currentTarget.dataset
    let shadowBox = {}
    if(level){
      const { list1, sign } = this.data
      let item = list1[level]
      shadowBox = {
        level:level,
        ranking:'第一名',
        className:'top-first',
        avatar:item.head_img,
        sign:sign[level],
        num:item.times,
        btnName:'我知道了'
      };
      if(level == 1){
        shadowBox = {...shadowBox,...{
          ranking:'第二名',
          className:'top-first',
        }}
      }else if(level == 2){
        shadowBox = {...shadowBox,...{
          ranking:'第三名',
          className:'top-second',
        }}
      }else{
        shadowBox = {...shadowBox,...{
          ranking:'第一名',
          className:'top-three',
        }}
      }
    }
    
    this.setData({
      showOverlayer:!this.data.showOverlayer,
      shadowBox,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusBarHeight:app.globalData.statusBarHeight,
      token:wx.getStorageSync('token') || ''
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_student();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})