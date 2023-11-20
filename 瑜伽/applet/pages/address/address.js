// pages/gongxiangcheng/checkCity/checkCity.js
const app = getApp()
const addressUrl = app.globalData.addressUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedProIdx: 0,
    checkedCityIdx: 0,
    checkedAreaIdx: 0,
    proData: [],
    cityData: [],
    areaData: [],
    selectAreaId: '0',
    selectCityId: "0",
    selectProvinceId: '0'
  },
  //获取省市区数据
  get_data() {
    const url = addressUrl + '/base/common/getAllAddress',
      data = {};
    wx.request({
      url,
      data,
      method: "POST",
      success: (res => {
        if (res.data.code == 200) {
          let data = res.data.content;
          data.unshift({
            id: "000000",
            name: "全国"
          })
          this.setData({
            proData: data
          })
          if (this.data.selectProvinceId > 0) {
            for (let i in data) {
              if (data[i].id == this.data.selectProvinceId) {
                let cityData = data[i].son_address;
                cityData.unshift({
                  id: '111111',
                  name: '市本级'
                })
                this.setData({
                  checkedProIdx: i,
                  cityData
                })
                if (this.data.selectCityId > 0) {
                  for (let j in cityData) {
                    if (cityData[j].id == this.data.selectCityId) {
                      let areaData = cityData[j].son_address;
                      for (let i in areaData) {
                        if (areaData[i].name == '市辖区') {
                          areaData.splice(i, 1)
                        } else {
                          areaData[i].checked = false;
                        }
                      }

                      if (this.data.selectAreaId) {
                        let selectAreaId = this.data.selectAreaId.split(',');
                        for (let k of selectAreaId) {
                          for (let item of areaData) {
                            if (k == item.id) {
                              item.checked = true;
                            }
                          }
                        }
                      }
                      this.setData({
                        checkedCityIdx: j,
                        areaData
                      })
                    }
                  }

                }
              }
            }
          }
        }
      })
    })
  },
  //清除条件
  resetCheck() {
    let areaData = [...this.data.areaData];
    for (let i in areaData) {
      if (areaData[i].name == '市辖区') {
        areaData.splice(i, 1)
      } else {
        areaData[i].checked = false;
      }
    }
    this.setData({
      areaData,
      checkedProIdx: 0,
      checkedCityIdx: 0,
      checkedAreaIdx: 0,
      cityData: [],
      areaData: []
    })
    var pages = getCurrentPages();

    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    prevPage.setData({
      selectProvinceId: "",
      selectCityId: "",
      selectAreaId: "",
      checkedCityName: '全国',
    })
    prevPage.get_device();
  },
  //确定选择
  confirmCheck() {
    let checkedProId = 0,
      checkedCityId = 0,
      checkedCityName;
    if (this.data.checkedProIdx > 0) {
      checkedProId = this.data.proData[this.data.checkedProIdx].id;
      checkedCityName = this.data.proData[this.data.checkedProIdx].name;
    } else {
      checkedCityName = '全国'
    }
    if (this.data.checkedCityIdx > 0) {
      checkedCityId = this.data.cityData[this.data.checkedCityIdx].id;
      checkedCityName = this.data.cityData[this.data.checkedCityIdx].name;
    }
    let areaData = this.data.areaData,
      checkedAreaId = [];
    for (let item of areaData) {
      if (item.checked) {
        checkedAreaId = item.id;
      }
    }
    wx.setStorageSync('province', checkedProId );
    wx.setStorageSync('city', checkedCityId );
    wx.setStorageSync('area', checkedAreaId );
    wx.navigateTo({
      url: '/pages/store/store'
    })


  },
  //选择省
  checkPro(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      cityData: [],
      areaData: [],
      checkedProIdx: index,
      checkedCityIdx: 0,
      checkedAreaIdx: 0
    })
    if (index > 0) {
      let cityData = [...this.data.proData[index].son_address];
      cityData.unshift({
        id: '111111',
        name: '市本级'
      })
      this.setData({
        cityData
      })
    }
    wx.pageScrollTo({
      duration: 0,
      scrollTop: 0
    })
  },

  //选择市
  checkCity(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      areaData: [],
      checkedCityIdx: index,
      checkedAreaIdx: 0
    })
    if (index > 0) {
      let areaData = [...this.data.cityData[index].son_address];
      for (let i in areaData) {
        if (areaData[i].name == '市辖区') {
          areaData.splice(i, 1)
        } else {
          areaData[i].checked = false;
        }
      }
      this.setData({
        areaData
      })
    }
    wx.pageScrollTo({
      duration: 0,
      scrollTop: 0
    })
  },
  //选择区
  checkArea(e) {
    let index = e.currentTarget.dataset.index,
      areaData = [...this.data.areaData];
    for (let item of areaData) {
      item.checked = false;
    }
    areaData[index].checked = !areaData[index].checked;
    this.setData({
      areaData
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('selected', 1)
    this.setData({
      selectProvinceId: options.selectProvinceId  || '',
      selectCityId: options.selectCityId || '',
      selectAreaId: options.selectAreaId || ''
    })
    this.get_data();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showModal({
      title: '请选择城市，为您匹对最距离最佳的瑜伽馆',
      showCancel: false,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})