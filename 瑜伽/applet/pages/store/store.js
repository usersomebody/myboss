// pages/store/store.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    renderIndex:1
  },
  //进入门店
  enterStore(e) {
    const { id:store_id, name, show } = e.currentTarget.dataset
    wx.setStorageSync('show_preengage_member',show || 0)
    wx.setStorageSync('store_id', store_id);
    wx.setStorageSync('selected', 1)    
    app.globalData.store_name = name
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //门店列表
  get_list() {
    
    const { renderIndex } = this.data
    let url = app.globalData.baseUrl + '/applet/store',
      that = this;
    let data = {
      method: 'store.getlist'
    }
    data.latitude = wx.getStorageSync('latitude')
    data.longitude = wx.getStorageSync('longitude')
    if (that.data.longitude && that.data.latitude) {
      data.longitude = that.data.longitude;
      data.latitude = that.data.latitude;
    } else {
      data.province = that.data.province;
      data.city = that.data.city;
      data.area = that.data.area;
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
          let list = res.data.data;
          for (let item of list) {
            if (item.distance) {
              item.distance = item.distance.toFixed(2)
            }else{

            }
          }
          that.setData({
            list,
            renderIndex:wx.getStorageSync('token') && wx.getStorageSync('user_type') == 1 ? list.length : renderIndex
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let province = wx.getStorageSync('province'),
      city = wx.getStorageSync('city'),
      area = wx.getStorageSync('area'),
      latitude = wx.getStorageSync('latitude'),
      longitude = wx.getStorageSync('longitude');
    if (province && city && area) {
      this.setData({
        province,
        city,
        area
      })
    }
    if (latitude && longitude) {
      this.setData({
        longitude,
        latitude,
        renderIndex:5
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})