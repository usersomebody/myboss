// pages/initWeight/initWeight.js
import { isObjectValueEqual } from '../../utils/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCover: true,
    height: 160.0,
    initHeight: 160.0,
    weight: 40.0,
    initWeight: 40.0,
    heightStyles: {
      line: '#D8D8D8', // 刻度颜色
      bginner: '#ffffff', // 前景色颜色
      bgoutside: '#fffff', // 背景色颜色
      lineSelect: '#21DBC3', // 选中线颜色
      font: '#21DBC2' // 刻度数字颜色
    },
    weightStyles: {
      line: '#D8D8D8', // 刻度颜色
      bginner: '#ffffff', // 前景色颜色
      bgoutside: '#fffff', // 背景色颜色
      lineSelect: '#21DBC3', // 选中线颜色
      font: '#21DBC3' // 刻度数字颜色
    },
    historyData:{}
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
          let initHeight = res.data.data.initial_height,
            initWeight = res.data.data.initial_weight;
          console.log(initHeight.toFixed(1), initWeight.toFixed(1))
          const { initial_height, initial_weight } = res.data.data
          let historyData = { initial_weight, initial_height}
          setTimeout(() => {
            this.setData({
              initHeight: initHeight,
              initWeight: initWeight,
              historyData
            });
          }, 2500)
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
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let data = {
      initial_weight: Number(this.data.weight),
      initial_height: Number(this.data.height)
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    const { historyData } = this.data
    //数据校验 如果数据相同不提交
    if(isObjectValueEqual(data,historyData)){
      wx.showModal({
        title: '提示',
        content:'数据未做更改,请勿提交',
        showCancel: false,
      })
      return
    }
    data.method = 'user.updateinfo'
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
          console.log(1)
          wx.showToast({
            title: '设置成功！',
            success: (res) => {
              setTimeout(() => {
                console.log(123)
                wx.navigateBack({
                  delta: 0,
                })
              }, 1500)
            }
          })
        } else {
          wx.showModal({
            content: res.data.message
          })
        }
      }
    })
  },
  //  身高
  bindHeight(e) {
    this.setData({
      height: e.detail.value
    })
  },
  //体重
  bindWeight(e) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.get_weighInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})