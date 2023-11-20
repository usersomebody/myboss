import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam } from '../../utils/common.js'
import { request } from '../../utils/util.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
  data: {
    blocks: [
      { padding: '12px', },
      { padding: '3px', background: '#FFD220' },
      { padding:'0',background: '#ffdba4' }
    //   {
    //     padding: '10px',
    //     imgs: [{
    //       src: require('../imgs/wheel-border.png'),
    //       width: '100%',
    //       height: '100%'
    //     }]
    //   },
     
    ],
    prizes: [],
    buttons: [
      { radius: '50px'},
      {
        radius: '50px',
        imgs:[{
          top:'-50px',
          src:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220221/c0d5ab6aad0b07008b0de5bdbbc94e6f.png',
          width:'100px',
          height:'100px'
        }]
      },
    ],
    defaultConfig: {
      gutter: '3px',
    },
    defaultStyle: {
      lineClamp:1
    },
    recordList:[],
    showOverlayer:false,
    statusBarHeight:'',
    redirectUrl:'',
    isIphoneX:'',
    nickname:'',
    phoneMember:'',
    user_id:'',
    user_type:'',
    isSameUserType:false,
    loaded:false,
    payBoxShow:false,
    activity_id:'',
    activity_cat:'',
    store_id:'',
    //倒计时
    seconds: 60,
    codeDisable: false,

    activityInfo:{},
    day_count:0,
    all_count:0,
    user_info:{},
    submitData:{},
    showBuyBox:false,
    buyingBox:{
      title:'',
      content:'',
      times:"",
      status:'-1'
    },
    isActivityTime:'',
    prizeData:{
      id:'',
      name:'',
      status:''
    },
    storeInfo:{},
    ruleList:[],
    isLoading:false,
    isShareIn:false
  },
  onLoad(options){
    let url = 'pages/activity/lucky'
    let str = formatParam(options)
    let formatUrl = `/${url}${str ? '?' + str : ''}`
    let redirectUrl = encodeURIComponent(formatUrl)
    if(options.sid){
        this.setData({
            store_id:options.sid,
        })
    }
     //页面进入必须授权登录
     let token = wx.getStorageSync('token');
     if(!token){
        wx.redirectTo({
            url: `/pages/login/login?path=${redirectUrl}`,
        })
        return
     }
    this.setData({
      activity_id:options.aid,
      isSameStore: options.sid  == wx.getStorageSync('store_id'),
      statusBarHeight:app.globalData.statusBarHeight,
      isIphoneX: app.globalData.isIphoneX,
      activity_cat:options.cid || '',
      redirectUrl,
      isShareIn:options.share_id ? true : false
    })
    this.getUserInfo()
    
  },
  onShow(){
    this.getActivityData()
    this.get_store()
  },
  //获取用户信息
  getUserInfo(reloadType) {
    const { isSameStore, user_id } = this.data
    let url = baseUrl + '/applet/user'
    let data = {
        method: 'user.getuserinfo',
        store_id: this.data.store_id || wx.getStorageSync('store_id') || ''
    }
    let header = {
        token: wx.getStorageSync('token') || ''
    }
    request({
        url,
        data,
        header,
        method: 'POST',
        success: (res) => {
            const { id, user_card, user_type, nickname } = res
            this.setData({ 
                user_id:id,
                user_type:user_type,
                nickname: user_card && user_card.length ? user_card[0].name : nickname,
                phoneMember: user_card && user_card.length ? user_card[0].phone : '',
                isSameUserType:user_card && user_card.length ? user_card[0].store_id == this.data.store_id : false,
                loaded:true
                // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1, //是否在其他店铺存在会员
            })
        }
    })
  },
  // 获取活动数据
  getActivityData(){
    const { redirectUrl, store_id, activity_id, activity_cat, pid } = this.data
    //页面进入必须授权登录
    let token = wx.getStorageSync('token');
    if(!token){
       return
    }
    let url = baseUrl + api.activityWheelapplet
    let data = {
        method: 'activity.getactivityinfo',
        store_id: store_id || wx.getStorageSync('store_id') || '',
        activity_id,
        activity_cat
    }
    let header = {
        token: wx.getStorageSync('token') || ''
    }
    request({
        url,
        data,
        header,
        isTologin:true,
        redirectUrl,
        method: 'POST',
        success: (res) => {
            //本地读取nickname
            const { activity, win, prize, user_info, day_count, all_count } = res

            // 处理转盘显示奖品
            this.formatPrize(prize)
            wx.setNavigationBarTitle({
              title:activity.name
            })
            win.forEach(element => {
              element.prize_name_copy = element.prize_name.length > 6 ? element.prize_name.slice(0,6) + '...' : element.prize_name
            });
            this.setData({
              activity,
              ruleList:formatParagraph(filterEOF(activity.rule)),
              recordList: win,
              user_info:user_info,
              day_count:all_count == 0 ? 0 : day_count,
              all_count
            })
            
            this.isBetweenActivity(activity.end_time)
        }
    })
  },
  //倒计时处理
  formatTime(time){
    if(!time){
        return moment().format('YYYY/MM/DD HH:mm:ss')
    }
    return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
  },
  //是否在当前活动期间
  isBetweenActivity(end_time){
    const { activity } = this.data
    let isActivityTime = moment(end_time).diff(moment(), 'seconds')
    //活动期间
    this.setData({
        isActivityTime,
    })
    if(isActivityTime < 0 || activity.is_end != 9){
      this.setData({
        buyingBox:{
          title:'很遗憾',
          content:'活动已结束',
          times: '',
          btnName: '暂无抽奖机会',
          status:-1,
        },
        showBuyBox:!this.data.showBuyBox,
        showOverlayer:!this.data.showOverlayer
      })
    }
  },
  formatPrize(data){
    let prizes = data.map((item, index)=>{
      let obj = item
      obj = {
        id:item.id,
        fonts: [{ text: item.name.slice(0,6),top:'10%',fontColor:'#947600',fontWeight:400,fontSize:'10px',lineClamp:1,wordWrap:false}],
        background:index % 2 == 0 ? '#ffffff' : '#fff2bf',
        imgs: [{ src: item.icon, width: '30px', height:'30px', top: '50%' }]
      }
      return obj
    })
    this.setData({
      prizes
    })
  },
   //获取参加人的数据
   getVal(e){
    let key = e.target.dataset.key
    let value = e.detail.value
    this.data.submitData[key] = value
    this.setData({
        submitData:this.data.submitData
    })
    const { name, phone, code} = this.data.submitData
    if(name && phone && code){
        this.setData({
            hasData:true
        })
    }
  },
  //获取验证码
  getCode(){
      const { submitData } = this.data
      if(!telReg(submitData.phone)){
          wx.showToast({
              title: '手机号有误',
              icon: 'none',
              duration: 1000
          })
          return
      }
      let url = baseUrl + api.sendAuthCode
      let data = {
          method: 'common.sendauthcode',
          store_id: this.data.store_id || wx.getStorageSync('store_id') || '',
          phone:submitData.phone
      }
      let header = {
          token: wx.getStorageSync('token') || ''
      }
      request({
          url,
          data,
          header,
          method: 'POST',
          success: (res) => {
              wx.showToast({
                  title:'获取成功'
              })
              this.timer()
              this.setData({
                  codeDisable:true
              })
          }
      })
  },
  timer() {
      let that = this
      var seconds = setInterval(function () {
        if (that.data.seconds> 1) {
          that.setData({
            seconds: that.data.seconds-1
          })
        } else {
          that.setData({
            seconds: 60,
            codeDisable: false
          })
          clearInterval(seconds)
        }
      }, 1000);
  },
  //参加助力活动
  joinPowerActivity(){
    const { user_info, activity_id, user_id, submitData, user_type, redirectUrl, is_end, phoneMember, nickname  } = this.data
    
    let phone = user_info.phone ? user_info.phone : user_type != 1 ? submitData.phone : phoneMember
    let user_name = user_info.user_name ? user_info.user_name : user_type != 1 ? submitData.name : nickname 
    
    if(!telReg(phone)){
        wx.showToast({
            title: '手机号有误',
            icon: 'none',
            duration: 1000
        })
        return
    }
    if(user_type != 1 && !submitData.code){
        wx.showToast({
            title: '验证码不可为空',
            icon: 'none',
            duration: 1000
        })
        return
    }
    this.setData({
      user_info:{
        user_name,
        phone,
        is_member:2
      }
    })
    this.start(1)
  },
  joinActivity(isNewUser){
    const { activity_id, user_info, user_id, submitData, user_type, prizes, day_count, phoneMember, nickname } = this.data
    let phone = user_info.phone ? user_info.phone : user_type != 1 ? submitData.phone : phoneMember
    let user_name = user_info.user_name ? user_info.user_name : user_type != 1 ? submitData.name : nickname
    let url = baseUrl + api.activityWheelapplet
    let data = {
        method: 'activity.join',
        store_id: this.data.store_id || wx.getStorageSync('store_id') || '',
        activity_id,
        user_id:user_id,
        is_member: user_type == 1 ? 1 : 2,
        phone,
        user_name,
        auth_code:submitData.code
    }
    let header = {
        token: wx.getStorageSync('token') || ''
    }
    request({
        url,
        data,
        header,
        method: 'POST',
        success: (res) => {
          const { id, name, status } = res
          let index = prizes.filter((item,index)=>{
            item.index = index
            return item.id == id
          })
          this.setData({
            prizeData:res
          })
          console.log('index',index)
          // 3s 后得到中奖索引 (假设抽到第0个奖品)
          // 调用stop方法然后缓慢停止
          // 获取抽奖组件实例
          const child = this.selectComponent('#myLucky')
          // 调用play方法开始旋转
          child.$lucky.stop(index[0].index)
          this.getActivityData()
        }
    }).catch((item)=>{
      if(isNewUser){
        this.setData({
          user_info:{}
        })
      }
      this.setData({
        isLoading:false,
        
      })
      const child = this.selectComponent('#myLucky')
      child.$lucky.stop(0)
    })
  },
  closeBox(){
    this.setData({
      payBoxShow:!this.data.payBoxShow,
      showOverlayer:!this.data.showOverlayer
    })
  },
  closeBuyBox(){
    const { isActivityTime, activity } = this.data
    
    this.setData({
      showBuyBox:!this.data.showBuyBox,
      showOverlayer:!this.data.showOverlayer
    })
    // if(isActivityTime < 0 || activity.is_end != 9){
    //   wx.navigateBack({
    //     delta: 1,
    //   })
    //   return
    // }
  },
  goNext(){
    const { prizeData, day_count, activity_id, activity_cat, store_id, activity } = this.data
    if(prizeData.status ==  1){
      this.closeBuyBox()
      wx.navigateTo({
        url: `/pages/activity/luckyList?aid=${activity_id}&cid=${activity_cat}&sid=${store_id}&start=${activity.start_time}&end=${activity.end_time}`
      })
    }else{
      this.closeBuyBox()
    }
  },
  back(){
    const { isShareIn } = this.data
    if(isShareIn){
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    wx.navigateBack({
        delta: 1
    })
  },
  goList(){
    const { activity_id, activity_cat, store_id, activity } = this.data
    wx.navigateTo({
      url: `/pages/activity/luckyList?aid=${activity_id}&cid=${activity_cat}&sid=${store_id}&start=${activity.start_time}&end=${activity.end_time}`
    })
  },
  //门店列表
  get_store() {
    const { store_id } = this.data
    let url = app.globalData.baseUrl + '/applet/store',
        that = this;
    let data = {
        method: 'store.getlist',
        store_id:store_id || wx.getStorageSync('store_id') || ''
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
            } else if (res.data.code == 200) {
                const { data } = res.data
                let storeInfo = {
                    storeName:data[0].name,
                    logo:data[0].brand_logo,
                    phone:data[0].phone
                }
                this.setData({
                    storeInfo
                })
            }
            }
        })
    },
  callPhone(){
    const { activity } = this.data
    const { storeInfo } = this.data
    let obj = {
      desc_img:activity.desc_img,
      qr_img:activity.qr_img,
      shop_name:storeInfo.storeName,
      other_head_img:activity.other_head_img,
      other_name:activity.other_name,
      guide:activity.other_name
    }
    let isPass = false
   for(let key in obj){
     if(!obj[key]){
      isPass = true
     }
   }
   if(isPass){
    if(!storeInfo.phone){
        wx.showModal({
            title:'号码不可以为空',
            showCancel:false
        })
        return 
    }
    wx.makePhoneCall({
        phoneNumber: storeInfo.phone //仅为示例，并非真实的电话号码
    })
    return
   }
    app.globalData.qrcode = activity
    wx.navigateTo({
      url:'/pages/invit/kefu'
    })
  },
  start (isNewUser) {
    const { user_info, user_type, day_count, prizeData, activity, isActivityTime, isLoading } = this.data
    if(isLoading){
      return
    }
    if(user_type != 1 && !Object.keys(user_info).length){
      this.setData({
        payBoxShow:true,
        showOverlayer:true
      })
      return
    }
    if(day_count == 0){
      this.setData({
        buyingBox:{
          title:'很遗憾',
          content:'继续努力',
          times:  "您的次数用完了",
          btnName: '暂无抽奖机会',
          status:prizeData.status,
        },
        showBuyBox:true,
        showOverlayer:true
      })
      return
    }
    if(isActivityTime < 0 || activity.is_end != 9){
      this.setData({
        buyingBox:{
          title:'很遗憾',
          content:'活动已结束',
          times: '',
          btnName: '暂无抽奖机会',
          status:-1,
        },
        showBuyBox:!this.data.showBuyBox,
        showOverlayer:!this.data.showOverlayer
      })
    }
    this.setData({
      showOverlayer:false,
      payBoxShow:false,
      isLoading:true
    })
    // 获取抽奖组件实例
    const child = this.selectComponent('#myLucky')
    // 调用play方法开始旋转
    child.$lucky.play()
    this.joinActivity(isNewUser)
  },
  end (event) {
    console.log('进入触发？？？')
    const { prizeData, day_count } = this.data
    // 中奖奖品详情
    this.setData({
      isLoading:false
    })
    console.log(event.detail)
    if(prizeData.status == 1){
      this.closeBuyBox()
      this.setData({
        buyingBox:{
          title:'恭喜您获得',
          content:prizeData.name,
          times: '',
          btnName:'立即领取',
          status:prizeData.status,
        }
      })
    }else{
      this.closeBuyBox()
      this.setData({
        buyingBox:{
          title:'很遗憾',
          content:'继续努力',
          times: day_count == 0 ? "您的次数用完了" : `还有${day_count}次抽奖机会`,
          btnName: day_count == 0 ? '暂无抽奖机会' : '继续抽奖',
          status:prizeData.status,
        }
      })
    }
  },

  onShareAppMessage(e) {
    const { store_id, activity, activity_id, activity_cat, user_id } = this.data
    let share_id = 1
   
    return {
        title: activity.name,
        path: `/pages/activity/lucky?sid=${store_id}&aid=${activity_id}&cid=${activity_cat}&share_id=${share_id}`,
        imageUrl: activity.desc_img
    }
  }
})