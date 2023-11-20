// pages/appointmentCard/appointmentCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: []
  },
  //获取会员卡信息
  get_card() {
    let url = app.globalData.baseUrl + '/applet/course';
    let data = {
      method: 'course.support.card',
      course_id: this.data.id
    }
    wx.request({
      url,
      data,
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
            cardList: res.data.data,
          })
        } else {
          this.setData({
            cardList: []
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id || 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_card();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})