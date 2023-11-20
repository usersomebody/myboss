// pages/cardBind/cardBind.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    is_success: 0, //1成功。2失败，0初始
    token: null,
    phone: '',
    cardNumber: '',
    time: '',
    cards: ''
  },
  //验证
  verify(e) {
    let phone = e.detail.value.tel,
      name = e.detail.value.name;
    this.setData({
      phone,
      name
    })
    let url = app.globalData.baseUrl + '/applet/user',
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getcardbyphone',
      phone,
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
      success: (res => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          let data = res.data.data,
            cards = [];
          for (let item of data) {
            cards.push(item.card_number)
          }
          this.setData({
            is_success: 1,
            cardNumber: data[0].card_number,
            time: data[0].use_end_time,
            cards: cards.join(',')
          })
        } else {
          this.setData({
            is_success: 2
          })
        }
      })
    })
  },
  //提交
  formSubmit(e) {
    let url = app.globalData.baseUrl + '/applet/user',
      user_id = wx.getStorageSync(
        "user_id"
      );
    let data = {
      method: 'user.cardbind',
      openid: this.data.openid,
      unionid: this.data.unionid,
      cards: this.data.cards,
      phone: this.data.phone,
      name: this.data.name,
      user_id
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
      success: (res => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          wx.showToast({
            title: '绑定成功！',
          })
          wx.navigateTo({
            url: '/pages/courseBooking/courseBooking?id=' + this.data.id,
          })
        } else {
          wx.showModal({
            title: res.data.message
          })
        }
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token') || '',
      id: options.id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})