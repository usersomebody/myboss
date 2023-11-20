// pages/induce/induce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeId: null,
    time:2000
  },
  //倒计时
  time_out() {
    let time = this.data.time;
    let timeId = setTimeout(() => {
      time -= 1000;
      if (time <= 0) {
        console.log(123)
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        this.setData({
          timeId,
          time
        })
        this.time_out();
      }
    }, time);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.time_out();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
       clearTimeout(this.data.timeId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})