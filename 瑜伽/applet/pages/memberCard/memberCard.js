// pages/memberCard/memberCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCover: false,
    cardInfo: {},
    openid: '',
    unionid: ''
  },
  //延期
  addTime() {
    this.setData({
      showCover: true
    })
  },
  //关闭弹窗
  closeCover() {
    this.setData({
      showCover: false
    })
  },
  //获取会员卡信息
  get_cardInfo() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          this.setData({
            cardInfo: res.data.data[0]
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    let userinfo = wx.getStorageSync('userinfo');
    let head_url = userinfo.avatarUrl;
    this.setData({
      head_url,
      token
    })
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_cardInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})