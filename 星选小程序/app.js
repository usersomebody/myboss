//app.js
App({
  onLaunch: function () {
    let that = this

    wx.getSystemInfo({
      success: function(res) {
        console.log('res_________',res)
        that.globalData.SDKVersion = res.SDKVersion;
        that.globalData.screenWidth = res.screenWidth;
        that.globalData.screenHeight = res.screenHeight;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.windowWidth = res.windowWidth;
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
    baseUrl: 'https://test.yoga.mnancheng.com', //测试
    // baseUrl:'https://yoga.mnancheng.com',//正式
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    // addressUrl: "https://test.mnancheng.cn/index.php",//测试
    addressUrl: "https://www.mnancheng.cn/index.php",//正式
    timeCard:"  https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210603/76506e526279ec3abca239ec029cc2aa.png",//期限卡
    numCard:" https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210602/54f4867f25fc2a69a7beee3c145e4fbf.png",//次数卡
    valueCard:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210603/ab815b18e52562454a4430beaba196b3.png",//储值卡
    clockCard :"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210602/bb89adb20c40cd9bfdcba827dca61264.png",//计时卡
  }
})