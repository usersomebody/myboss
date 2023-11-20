// pages/login/login.js
import { getUrlParam } from '../../utils/common.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow:'1',
    status:'0',
    store_id:'',
    store_name:app.globalData.store_name || '去约瑜伽',
    userInfo:'',
    register_status:'0',
     // 验证手机号
     loginPhone: false,
     loginPwd: false,
     loveChange: true,
     hongyzphone: '',
     // 验证码是否正确
     zhengLove: true,
     huoLove: '',
     getText2: '获取验证码',
     redirectPath:'',
     toIndex:''
  },
  // //登录获取验证码
  // getCode(){
  //   this.setData({
  //     status:'1',
  //   })
  // },
  // //注册获取验证码
  register_getCode(){
    this.setData({
      register_status:'1',
    })
    let loveChange = this.data.loveChange;
    console.log(loveChange)
    let lovePhone = this.data.lovePhone;
    console.log(lovePhone)
    let phone = this.data.hongyzphone;
    console.log(phone,'phone')
    let n = 59;
    let that = this;
    if (!lovePhone) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 1000
      })
    } else {
      if (loveChange) {
        this.setData({
          loveChange: false
        })
        let lovetime = setInterval(function () {
          let str = '(' + n + ')' + '重新获取'
          that.setData({
            getText2: str
          })
          if (n <= 0) {
            that.setData({
              loveChange: true,
              getText2: '重新获取'
            })
            clearInterval(lovetime);
          }
          n--;
        }, 1000);
 
        //获取验证码接口写在这里
        //例子 并非真实接口
        app.agriknow.sendMsg(phone).then(res => {
          console.log('请求获取验证码.res =>', res)
        }).catch(err => {
          console.log(err)
        })
 
        
      }
    }
  },

  //登录
  getUserInfo: function (e) {
    const { path } =  this.data
    if(this.data.hongyzphone == "" && path.indexOf('share_id') == -1){
      wx.showToast({
       title: '手机号不能为空',
       icon: 'none',
       duration: 1000
      })
      return ;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.hongyzphone)) &&  path.indexOf('share_id') == -1) {
      wx.showToast({
       title: '请输入正确的手机号',
       icon: 'none',
       duration: 1000
      })
      return ;
    }
    wx.setStorageSync('phone', this.data.hongyzphone);
    
    app.onLogin(res => {
      wx.hideLoading()    
      this.get_info()
    });

  },
   //门店列表
   get_store() {
     console.log('ffffffffffff');
    let url = app.globalData.baseUrl + '/applet/store',
      that = this;
    let data = {
      method: 'store.getlist',
      store_id:wx.getStorageSync('store_id')
    }   
    let header = {}
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
          const { data } = res.data
          let store_id = wx.getStorageSync('store_id')
          let store_info = data[0]
          wx.setStorageSync('show_preengage_member',data[0].config ? data[0].config.is_show_course_to_member : 0)
          console.log('res.data',res.data.data)
          if(wx.setStorageSync("user_type") == 1 || wx.setStorageSync("user_type") == 2){
            let filterInfo = data.filter((item)=>{
              return item.id == store_id
            })
            store_info = filterInfo[0]
          }
          wx.setStorageSync("store_id", store_info.id)
          that.setData({
            store_id:store_info.id,
            store_name: store_info.name,
          })
          console.log(wx.getStorageSync('user_type'),'设置storennnnnnnnn');


        }
      }
    })
    
  },



   //获取的个人信息
   get_info() {
    const { path, hongyzphone } = this.data
    let url = app.globalData.baseUrl + '/applet/user';
        var data = {
          method: 'user.getuserinfo',
          store_id: wx.getStorageSync('store_id'),
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
          wx.hideLoading()
        } else
        if (res.data.code == 200) {
          wx.hideLoading()
          const { user_type, user_card } = res.data.data
          console.log( res.data.data,res.data.data.user_type,' res.data.data');
          wx.setStorageSync("user_type", res.data.data.user_type)
          if(user_type == 1 && user_card.length && user_card[0].phone != hongyzphone && path.indexOf('share_id') == -1){
            wx.showModal({
              title: '手机号有误',
              showCancel:false,
              success: (res) => {
              }
            })
            wx.removeStorage({key: 'token'})
            wx.removeStorage({key: 'user_id'})
            wx.removeStorage({key: 'userinfo'})
            return 
          }
          this.setData({
            userInfo: res.data.data
          })
          wx.showModal({
            title:user_type
          })
          if(user_type === 1 || (user_type == 3 && path.indexOf('sid') > -1)){
            wx.showModal({
              title: '登录成功！',
              showCancel:false,
              success: (res) => {
                this.get_auth();
              }
            })
          }else{
            console.log('???????????')
            this.login_btn(user_type) 
          }
          this.get_store()
        }
      }
    })
  },
  //取消登录
  handleCancel() {
    const { path, toIndex } = this.data
    if(path.indexOf('/pages/invit/') > -1){
      wx.switchTab({
        url: '/pages/classAppointment/classAppointment',
      })
      return
    }
    if(toIndex){
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    wx.navigateBack({
      delta: 0,
    })
  },
 //点击注册
  handle_register(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  //获取模板消息权限
  get_auth() {
    var that = this;
    let tmplIds = ["E2rHH5-FBdb2fiO2scxrCnaegVpbk6W21q0OZyL8IMc", "qFXMY6jKTYwmPfquGNEfBEGzXcWqx6oA-rP-PhT3b1M", "nAMeeKhvSeAkZetHQ6JFAT_yGgTMnAMS8WpoOdHKMkY"];
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        let reject = 0;
        for (let i in res) {
          // console.log(res[i])
          if (res[i] == "reject") {
            reject++
          }
        }
      },
      fail(res) {
        that.handleSubsribe();
      },
      complete(res){
        that.redirectPage()
      }
    })
  },
  
  //获取是否开启订阅开关
  get_subscribe_auth() {
    var that = this;
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res)
        if (res.subscriptionsSetting.itemSettings) {
          that.setData({
            isAllow: true
          })
        } else {
          that.setData({
            isAllow: false
          })
        }
      },
      fail(res) {
        console.log("调用失败：", res)
      }
    })
  },

  //手动开启订阅
  handleSubsribe() {
    var that = this;
    console.log('123')
    wx.openSetting({
      success(res) {
        that.get_subscribe_auth();
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  // 手机验证
  lovePhone: function (e) {
    let phone = e.detail.value;
    this.setData({ hongyzphone: phone })
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      this.setData({
        lovePhone: false
      })
      if (phone.length > 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      this.setData({
        lovePhone: true
 
      })
    }
  },
  // 验证码输入
  yanLoveInput: function (e) {
    let that = this;
    let yanLove = e.detail.value;
    let huoLove = this.data.huoLove;
    that.setData({
      yanLove: yanLove,
      zhengLove: false,
    })
    if (yanLove.length >= 4) {
      if (yanLove == huoLove) {
        that.setData({
          zhengLove: true,
        })
      } else {
        that.setData({
          zhengLove: false,
        })
        wx.showModal({
          content: '输入验证码有误',
          showCancel: false,
          success: function (res) { }
        })
      }
    }
 
  },
  // 验证码按钮
  yanLoveBtn: function () {
   
    let loveChange = this.data.loveChange;
    console.log(loveChange)
    let lovePhone = this.data.lovePhone;
    console.log(lovePhone)
    let phone = this.data.hongyzphone;
    console.log(phone)
    let n = 59;
    let that = this;
    if (!lovePhone) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'success',
        duration: 1000
      })
    } else {
      if (loveChange) {
        this.setData({
          loveChange: false,
          status:'1',
        })
        let lovetime = setInterval(function () {
          let str = '(' + n + ')' + '重新获取'
          that.setData({
            getText2: str
          })
          if (n <= 0) {
            that.setData({
              loveChange: true,
              getText2: '重新获取'
            })
            clearInterval(lovetime);
          }
          n--;
          this.setData({
            status:'0',
          })
        }, 1000);
 
        //获取验证码接口写在这里
        //例子 并非真实接口
        app.agriknow.sendMsg(phone).then(res => {
          console.log('请求获取验证码.res =>', res)
        }).catch(err => {
          console.log(err)
        })
 
        
      }
    }
  },
  //form表单提交
  // formSubmit(e){
  //   let val = e.detail.value 
  //   console.log('val', val)
  //   var phone = val.phone //电话
  //   var phoneCode = val.phoneCode //验证码
  // },

  //登录验证
  login_btn(user_type){
    const { userInfo, hongyzphone, path } = this.data
      let url = app.globalData.baseUrl + '/index.php/applet/user/index',
        user_id = wx.getStorageSync('user_id'),
        store_id = wx.getStorageSync('store_id')
      let data = {
        method: 'user.bind_card',
        user_id,
        phone:hongyzphone,
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
          console.log(res)
          if (res.data.code == 400) {
            wx.removeStorageSync('token')
          } else if (res.data.code == 200) {
            wx.showModal({
              title: '登录成功！',
              showCancel:false,
              success: (res) => {
                this.get_auth();
              }
            })
          } else {
            if(user_type == 2){
              wx.showModal({
                title: '登录成功！',
                showCancel:false,
                success: (res) => {
                  this.get_auth();
                }
              })
            }else{
              wx.showModal({
                title: res.data.message
              })
            }
          }
        })
      })
  },
  
  //页面重定向跳转
  redirectPage(){
    const { path } = this.data
    let redirectArr = [
      '/pages/index/index',
      '/pages/my/my'
    ]
    if(path && redirectArr.indexOf(path) > -1){
      wx.switchTab({
        url:'/pages/my/my'
      })
      return
    }
    console.log('path',path)
    if(path){
      wx.redirectTo({
        url: path
      })
      return
    }
    wx.switchTab({
      url:'/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    wx.removeStorageSync('token')
    // wx.removeStorageSync('store_id')
    const { path = '', toIndex } = options
    console.log('链接',decodeURIComponent(path))
    this.get_subscribe_auth();
    this.setData({
      path:decodeURIComponent(path),
      isshow: path.indexOf('share_id') > -1 ? 0 : options.isshow ? options.isshow : '1',
      store_name:app.globalData.store_name,
      toIndex: toIndex || '',
    })
    let needId = path ? getUrlParam(decodeURIComponent(path),'sid') : ''
    console.log('needId',needId)
    wx.setNavigationBarTitle({
      title:app.globalData.store_name || ''
    })
    this.get_store();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})