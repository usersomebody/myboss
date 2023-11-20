// pages/myPage/myPage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    sex: ["男", "女", '未知'],
    sexIdx: 0,
    age: [],
    ageIdx: 0,
    height: [],
    heightIdx: [0, 0],
    head_img: '/imgs/head_url.png',
    nickname: ''
  },
  //获取用户信息
  get_userInfo() {
    var that = this;
    let url = app.globalData.baseUrl + '/applet/user',
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
    //本地存贮里面取一次用户头像和昵称
    console.log(wx.getStorageSync('userinfo'))
    let userInfo = wx.getStorageSync('userinfo')
    const { avatarUrl, nickName } = userInfo
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
        } else if (res.data.code == 200) {
          let height = this.data.height,
            age = that.data.age;
          for (let i in height[0]) {
            if (height[0][i] == parseInt(res.data.data.height)) {
              that.setData({
                "heightIdx[0]": i
              })
            }
          }
          let heightDecimal = '.' + res.data.data.height.toString().split('.')[1] + 'cm';
          for (let i in height[1]) {
            if (height[1][i] == heightDecimal) {
              that.setData({
                "heightIdx[1]": i
              })
            }
          }
          for (let j in age) {
            if (age[j] == res.data.data.age) {
              that.setData({
                "ageIdx": j
              })
            }
          }
          console.log('res',res)
          this.setData({
            sexIdx: Number(res.data.data.sex) - 1,
            head_img: res.data.data.head_img || avatarUrl || '',
            nickname: res.data.data.nickname || nickName || ''
          })
        }
        
      }
    })
  },
  //保存信息
  submit() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let data = {
      method: 'user.updateinfo',
      sex: Number(this.data.sexIdx) + 1,
      age: this.data.age[this.data.ageIdx],
      height: this.data.height[0][this.data.heightIdx[0]] + Number(this.data.height[1][this.data.heightIdx[1]].slice(0, -2)),
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
            title: '修改成功！',
          })
        }
      })
    })
  },
  //选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log('res',res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = res.data
            //do something
          }
        })
      }
    })
  },
  //选择性别
  bindSexChange(e) {
    this.setData({
      sexIdx: e.detail.value
    })
    this.submit()
  },
  //选择年龄
  bindAgeChange(e) {
    this.setData({
      ageIdx: e.detail.value
    })
    this.submit()
  },
  // 选择身高
  bindHeightChange(e) {
    this.setData({
      heightIdx: e.detail.value
    })
    this.submit()
  },
  bindHeightcolumnchange(e) {
    if (e.detail.column == 0) {
      this.setData({
        heightIdx: [e.detail.value, 0]
      })
    }
  },
  //初始化年龄和身高数组
  init_height_age() {
    let age = [],
      height = [],
      h1 = [],
      h2 = [];
    for (let i = 10; i <= 100; i++) {
      age.push(i)
    }
    for (let j = 120; j <= 200; j++) {
      h1.push(j)
    }
    for (let k = 0; k <= 9; k++) {
      h2.push("." + k + 'cm')
    }
    height = [h1, h2]
    this.setData({
      age,
      height
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
    this.init_height_age();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_userInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})