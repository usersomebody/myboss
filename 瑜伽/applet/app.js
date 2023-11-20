//app.js
App({
  onLaunch: function () {
    let that = this
    // 展示本地存储能力
   
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function(res) {
        console.log('res_________',res)
        that.globalData.SDKVersion = res.SDKVersion;
        that.globalData.screenWidth = res.screenWidth;
        that.globalData.screenHeight = res.screenHeight;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.pixelRatio = res.pixelRatio;
        that.globalData.android = res.system.indexOf('Android') > -1
        that.globalData.dprClass = `dpr-${res.pixelRatio}`;
        let iphoneModel = res.model.split(' ')
        if(iphoneModel[0] == 'iPhone' && /X|XR|XS|12|13/.test(iphoneModel[1])){
          that.globalData.isIphoneX = true;
        }
      }
    })
  },
  
  onLogin: function (cb) {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
         wx.login({
          success: res1 => {
            wx.showLoading({
              title: '授权中',
            })
            if (res1.code) {
              // return false
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  let data={
                    jscode: res1.code,
                    method: 'user.login',
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  };
                  // return false
                  wx.request({
                    url: that.globalData.baseUrl + '/applet/user',
                    data,
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res2) {
                      if (res2.data.code == 200) {
                        wx.setStorage({
                          data: res2.data.data.token,
                          key: 'token',
                        })
                        wx.setStorage({
                          data: res2.data.data.userinfo.id,
                          key: 'user_id',
                        })
                        res.userInfo.avatar = res2.data.data.userinfo.avatar || ''
                        console.log({res,res2})
                        wx.setStorage({
                          data: res.userInfo,
                          key: 'userinfo',
                        })
                        res_user.userInfo.token = res2.data.data.token;
                        // 设置缓存有效时间
                        var timestamp = Date.parse(new Date());
                        var expiration = timestamp + 1800000
                        // var expiration = timestamp + 86400000;
                        wx.setStorageSync("data_expiration", expiration)
                        wx.request({
                          url: that.globalData.baseUrl + '/applet/user',
                          data:{
                            method: 'user.getuserinfo',
                            store_id: wx.getStorageSync('store_id'),
                          },
                          method: 'POST',
                          header: {
                            token:res2.data.data.token
                          },
                        
                          success: function (result) {
                            wx.hideLoading()    
                            if (result.data.code == 200) {
                              let userInfo = {
                                openid:res2.data.data.userinfo.openid,
                                unionid:res2.data.data.userinfo.unionid,
                                user_type:result.data.data.user_type
                              }
                              typeof cb == "function" && cb(userInfo);
                            }  
                          }
                        })
                      } else {
                        wx.hideLoading()    
                              
                        console.log('44444444444444')
                        // wx.showToast({
                        //   title: res2.data.msg,
                        //   duration: 1000
                        // })
                      }   
                    }
                  })
                },
                fail: (res => {
                  wx.hideLoading()          
                  console.log(res)
                })
              })
            } else {
              wx.hideLoading()
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          },
        })
      }
    })
    // return false
    
  },

  onShow(){
    //根据环境清除本地存贮
    let that = this
    let storageEnv = wx.getStorageSync('env')
    let currenEnv = that.globalData.baseUrl.indexOf('test') > -1 ? 'dev' : 'pro'

    if(storageEnv && storageEnv != currenEnv){
      wx.clearStorageSync()
    }
    wx.setStorageSync('env',currenEnv)
  },  
  globalData: {
    userInfo: null,
    // baseUrl:'https://yg.mnancheng.com',//正式
    // baseUrl: 'https://test.yoga.mnancheng.com', //测试
    baseUrl:'https://yoga.mnancheng.com',//正式
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    // addressUrl: "https://test.mnancheng.cn/index.php",//测试
    addressUrl: "https://www.mnancheng.cn/index.php",//正式
    timeCard:"  https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210603/76506e526279ec3abca239ec029cc2aa.png",//期限卡
    numCard:" https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210602/54f4867f25fc2a69a7beee3c145e4fbf.png",//次数卡
    valueCard:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210603/ab815b18e52562454a4430beaba196b3.png",//储值卡
    clockCard :"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210602/bb89adb20c40cd9bfdcba827dca61264.png",//计时卡
  }
})