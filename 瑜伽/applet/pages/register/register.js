// pages/register/register.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'0',
    // 验证手机号
    loginPhone: false,
    loginPwd: false,
    loveChange: true,
    hongyzphone: '',
    user_name:'',
    store_name:''
  },
  getCode(){
    this.setData({
      status:'1',
    })
  },
 // 手机验证
 lovePhone: function (e) {
  let phone = e.detail.value;
  // this.throttle(this.checkPhoneNumber,null,500,phone)//节流处理input时间 可以不用
  this.setData({ hongyzphone: phone })
},

//用户名
user_name(e){
  let user_name = e.detail.value;
  this.setData({ user_name: user_name })
  console.log(user_name,'user_name');
  
},
//授权
 auth_btn(){
   if(wx.getStorageSync('token')){
    this.login_btn()
   }else{
    app.onLogin(res => {
        wx.hideLoading()    
        this.login_btn()
      });
   }
  
 },
  //注册
  login_btn(){
    const { user_name, hongyzphone, store_name } = this.data
    console.log({user_name,hongyzphone})
    //校验用户名不可为空值
    if (!user_name) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }
    //校验手机号不可为空值
    if(!hongyzphone){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
       })
       return
    }
    //校验手机号格式
    if(!(/^1[3456789]\d{9}$/.test(hongyzphone))){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
       })
       return
    }
    
    //注册手机号 
    let url = app.globalData.baseUrl + '/index.php/applet/user/index',
      that = this,
      store_id = wx.getStorageSync('store_id'),
      user_id = wx.getStorageSync('user_id');
    let data = {
      method: 'user.regist',
      store_id,
      phone:that.data.hongyzphone,
      user_name:that.data.user_name,
      user_id
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.showModal({
      title: '提示',
      content: `您确定成为${store_name}的会员吗?`,
      success (result) {
        if (result.confirm) {
          wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res => {
              console.log(res)
              if (res.data.code == 400) {
                wx.removeStorageSync('token')
              } else if (res.data.code == 200) {
                wx.showToast({
                  title: '注册成功！',
                })
                that.get_info();
              // wx.setStorageSync("user_name", that.data.user_name)
      
                wx.navigateBack({
                  delta:2,
                })
              } else {
                wx.showModal({
                  title: res.data.message,
                })
              }
            })
          })
        } else if (result.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    
  },
   //获取个人信息
   get_info() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let data = {
      method: 'user.getuserinfo',
      store_id: wx.getStorageSync('store_id')
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

        } else
        if (res.data.code == 200) {
          console.log( res.data.data,' res.data.data');
          wx.setStorageSync("user_type", res.data.data.user_type)
        }

      }
    })
  },
  //节流处理时间多次处理问题 可以不用
  throttle(fn, context, delay, text) {
    clearTimeout(fn.timeoutId);
    fn.timeoutId = setTimeout(function () {
      fn.call(context, text);
    }, delay);
  },
  //检验规则
  checkPhoneNumber(e){
    if (!(/^1[3456789]\d{9}$/.test(e))) {
      this.setData({
        lovePhone: false
      })
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        lovePhone: true

      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let user_name = wx.getStorageSync('userinfo').nickName;
    this.setData({
      user_name,
      store_name:app.globalData.store_name || '',
      
    })
    console.log(user_name,'user_name');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})