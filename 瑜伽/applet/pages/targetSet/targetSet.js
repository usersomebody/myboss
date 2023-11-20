// pages/targetSet/targetSet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: 7,
    initDay: 30,
    weight: 50.0,
    initWeight: 60.0,
    styles: {
      line: '#D8D8D8', // 刻度颜色
      bginner: '#ffffff', // 前景色颜色
      bgoutside: '#fffff', // 背景色颜色
      lineSelect: '#21DBC3', // 选中线颜色
      font: '#21DBC3' // 刻度数字颜色
    },
    showCover: true,
  },
  //获取用户体重信息
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
          setTimeout(() => {
            this.setData({
              initDay: res.data.data.weight_target.days > 0 ? res.data.data.weight_target.days : 7,
              initWeight: res.data.data.weight_target.weight > 0 ? res.data.data.weight_target.weight : 50.0,
            })
          }, 2500);
          setTimeout(() => {
            this.setData({
              showCover: false
            })
          }, 3000);
        }
      }
    })
  },
  //重新设置
  reset() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.addtarget',
      weight: Number(this.data.weight),
      days: Number(this.data.day)
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
            title: '设置成功！',
          })
          wx.navigateTo({
            url: '/pages/targetWeight/targetWeight',
          })
        }
      }
    })
  },
  // 天数
  bindDay(e) {
    this.setData({
      day: e.detail.value
    })
  },
  //体重
  bindWeigh(e) {
    this.setData({
      weight: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    this.setData({
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