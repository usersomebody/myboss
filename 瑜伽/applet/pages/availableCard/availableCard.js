// pages/availableCard/availableCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id: 0,
    cardList: []
  },
  //获取用户所有卡片
  get_cardInfo() {
    let url = app.globalData.baseUrl + '/applet/user',
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getcard',
      store_id,
      course_id: this.data.course_id,
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
          let cardList = res.data.data;
          this.setData({
            cardList
          })
        }
      }
    })

  },
 
  //选择卡片
  check_card(e) {
    let item = e.currentTarget.dataset.item;
    wx.redirectTo({
      url: '/pages/courseBooking/courseBooking?checkedCard=' + JSON.stringify(item) + '&id=' + this.data.id+'&date='+this.data.date+'&week='+this.data.week,
    })
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; //上一个页面
    // prevPage.setData({
    //   cardInfo: item
    // }) //设置数据
    // wx.navigateBack({
    //   delta: 0,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      course_id: options.course_id || 11,
      id: options.id || 1,
      date: options.date,
      week: options.week,
      token: wx.getStorageSync('token') || ''
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