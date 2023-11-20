// pages/targetWeight/targetWeight.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_url: '/imgs/head_url.png',
    nickname: '',
    weight: 0,
    initWeight: 0,
    target_weight: 0,
    remain_days: 0,
    target_date: 0,
  },
  //获取体重信息
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          this.setData({
            initWeight: res.data.data.initial_weight,
            weight: res.data.data.weight,
            target_weight: res.data.data.weight_target.weight,
            target_date: res.data.data.weight_target.target_date,
            remain_days: res.data.data.weight_target.remain_days

          })

        }
      }
    })
  },
  // 重新设置目标
  resetTarget() {
    wx.navigateTo({
      url: '/pages/targetSet/targetSet',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo');
    let head_url = userinfo.avatarUrl,
      nickname = userinfo.nickName;
    let token = wx.getStorageSync('token');
    this.setData({
      head_url,
      nickname,
      token
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_weighInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})