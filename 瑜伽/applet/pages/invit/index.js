import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { accDiv, accSub, telReg, formatParam, formatParagraph, filterEOF,  } from '../../utils/common.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
    data:{
        indicatorDots:false,
        bannerList:[],
        swiperCurrent:0,
        isIphoneX: app.globalData.isIphoneX,
        cutDown:{},
        isLogin:false,
        statusBarHeight:0,
        activity_name:'',
        card_name:'',
        prizes_number:'',
        buy_number:'',
        original_price:0,
        buying_price:0,
        card_expiration_time:0,
        card_use_time:'',
        card_use_type:'',//会员卡生效状态 0 领卡后立即生效 1约课生效
        payBoxShow:false,
        showOverlayer:false,
        //input 数据
        submitData:{
            phone:'',
            name:'',
            code:''
        },
        seconds:60,
        user_id: '',
        phoneMember: '',
        user_type:'',
        activity_id:'',
        codeDisable:false,
        nickName:'',
        store_id:'',
        canvasShow:false,
        redirectUrl:'',
        nickname:"",
        card_id:'',
        courseList:[],
        participant_id:'',
        isSameStore:true,
        isShowBtn:false,
        isActivityTime:false,
        hasData:false,
        is_end:'',
        cardTypeInfo:{
            1:{
              name:'剩余天数:',
              key:'remain_days',
              symbol:'天'
            },
            2:{
              name:'剩余次数:',
              key:'assets_num',
              symbol:'次'
            },
            3:{
              name:'剩余金额:',
              key:'assets_money',
              symbol:'元'
            },
            4:{
              name:'剩余时间:',
              key:'assets_time',
              symbol:'分钟'
            }
          },
          ruler:[],
          ruler_imgs:[],
          card_info:{},
          remainingNum:0,
          storeInfo:{},
          isSameUserType:false,
          overBox:false
    },
    onLoad(options){
        let url = 'pages/invit/index'
        let str = formatParam(options)
        console.log('str',str)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)
        console.log('redirectUrl',redirectUrl)
        if(options.sid){
            // wx.setStorageSync('store_id', options.store_id)
            this.setData({
                store_id:options.sid,
            })
        }
        
        this.setData({
            isSameStore: options.sid  == wx.getStorageSync('store_id')
        })
         //页面进入必须授权登录
         let token = wx.getStorageSync('token');
         if(!token){
            
            wx.redirectTo({
                url: `/pages/login/login?path=${redirectUrl}`,
            })
            return
         }
        this.setData({
            isIphoneX: app.globalData.isIphoneX,
            statusBarHeight:app.globalData.statusBarHeight,
            redirectUrl,
            activity_cat:options.cid || '',
            activity_id:options.aid || '',
            isLogin:token ? true : false
        })
        // 二维码场景
        // let scene = {
        //     store_id: ''
        // }
        // if (options.scene) {
        //     JSON.parse('{"' + decodeURIComponent(options.scene).replace(/&/g, '","').replace(/=/g, '":"') + '"}', (k, v) => {
        //       scene[k] = v
        //     })
        // }
        this.get_store()
        this.getActivityData()
        this.getUserInfo()
    },
    onShow(){
       
    },
    //swiper自定义控件
    changeIndicator({ detail }) {
        this.setData({
            swiperCurrent: (detail.current)
        });
    },
    updateProdStatus() {
        // this.getDetail()
        console.log('更新数据')
    },
    toStart(){
        const { user_type } = this.data
        if(user_type != 1){
            this.setData({
                payBoxShow:true,
                showOverlayer:true
            })
        }else{
            this.joinPowerActivity()
        }
        
        // wx.navigateTo({
        //     url: '/pages/invit/start'
        // })
    },
    back(){
        let url = getCurrentPages().length
        if(url == 1){
            wx.switchTab({
                url:'/pages/my/my'
            })
            return
        }
        wx.navigateBack({
            delta: 1
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
    //获取活动数据
    getActivityData(){
        const { redirectUrl, activity_id, activity_cat } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'acitivity.get',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id,
            activity_cat
        }
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                console.log('res.data',res)
                if (res.data.code == 400) {
                    console.log('?????')
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                        url: `/pages/login/login?path=${redirectUrl}`,
                    })
                }else if (res.data.code == 200) {
                    const { card_info, id, name,desc_img, start_time, end_time, card_name, card_id, prizes_number, buy_number, original_price, buying_price, card_expiration_time, card_use_type, participant_id, is_end, rule, rule_imgs} = res.data.data
                    let cutDown = {
                        start_time:that.formatTime(start_time),
                        end_time:that.formatTime(end_time),
                        now_time:that.formatTime()
                    }
                    card_info.assets_money = accDiv(card_info.assets_money,100)
                    
                    //本地读取nickname
                    that.setData({
                        activity_id:id,
                        bannerList:new Array(desc_img),
                        remainingNum:accSub(prizes_number,buy_number),
                        card_name,
                        activity_name:name,
                        prizes_number,
                        buy_number,
                        original_price:accDiv(original_price,100),
                        buying_price:buying_price > 0 ? accDiv(buying_price,100) : 0,
                        card_use_time: card_use_type == 0 ? '领卡后立即生效' : '约课生效',
                        card_expiration_time:that.formatTimeShow(card_expiration_time),
                        card_use_type,//会员卡生效状态 0 领卡后立即生效 1约课生效
                        card_id,
                        cutDown,
                        card_info,
                        nickName:wx.getStorageSync('userinfo').nickName || '',
                        'submitData.name':wx.getStorageSync('userinfo').nickName || '',
                        participant_id: participant_id || '',
                        is_end,
                        ruler:formatParagraph(filterEOF(rule)),
                        ruler_imgs:rule_imgs ? JSON.parse(rule_imgs) : [],
                    })
                    if(participant_id){
                        wx.redirectTo({
                            url: '/pages/invit/start?sid=' + that.data.store_id + '&aid=' + that.data.activity_id + '&cid=' + that.data.activity_cat
                        })
                        return
                    }
                    that.getCourseList(card_id)
                    that.isBetweenActivity(cutDown)
                }
                if(!res.data.data || res.data.data.is_end != 9){
                    this.setData({
                        showOverlayer:true,
                        overBox:true
                    })
                    return
                }
            }
        })
    },
    //获取用户信息
    getUserInfo() {
        const { isSameStore } = this.data
        let that = this
        let url = baseUrl + '/applet/user'
        let data = {
            method: 'user.getuserinfo',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || ''
        }
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    const { id, user_card, user_type, nickname } = res.data.data
                    that.setData({ 
                        user_id:id,
                        phoneMember: user_card && user_card.length ? user_card[0].phone : '',
                        user_type:user_type,
                        nickname: user_card && user_card.length ? user_card[0].name : nickname,
                        isSameUserType:user_card && user_card.length ? user_card[0].store_id == that.data.store_id : false
                        // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1,
                    })
                    console.log('that.data.id',that.data.id)
                }
            }
        })
    },
    //获取课程信息
    getCourseList(card_id){
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.getcoursebycard',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            card_id,
        }
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    that.setData({ 
                        courseList:res.data.data || []
                    })
                }
            }
        })
    },
    //参加助力活动
    joinPowerActivity(){
        const { activity_id, user_id, submitData, user_type, phoneMember, nickname, isSameUserType  } = this.data
        let checkData = user_type != 1 ? submitData.phone : phoneMember
        if(!telReg(checkData)){
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
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.participate',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id:activity_id,
            user_id:user_id,
            phone:checkData,
            // participant_id:participant_id,
            // is_member: isSameUserType && user_type == 1 ? 1 : 2,
            // user_name: isSameUserType && user_type == 1 ? nickname || submitData.name : submitData.name,
            is_member: user_type == 1 ? 1 : 2,
            user_name: user_type == 1 ? nickname || submitData.name : submitData.name,
            auth_code:submitData.code || ''
        }
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                if(res.data.code != 200){
                    wx.showModal({
                        title:'提示',
                        content:res.data.message,
                        showCancel:false
                    })
                }
                
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    that.setData({
                        payBoxShow:false,
                        showOverlayer:false
                    })
                    wx.redirectTo({
                        // url: '/pages/invit/start'
                        url: '/pages/invit/start?sid=' + that.data.store_id + '&aid=' + that.data.activity_id + '&cid=' + that.data.activity_cat
                    })
                }
            },
        })
    },
    formatTime(time){
        if(!time){
            return moment().format('YYYY/MM/DD HH:mm:ss')
        }
        return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
    },
    formatTimeShow(time){
        return moment(time * 1000).format('YYYY/MM/DD')
    },
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

        let that = this
        let url = baseUrl + api.sendAuthCode
        let data = {
            method: 'common.sendauthcode',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            phone:submitData.phone
        }
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                if(res.data.code != 200){
                    wx.showModal({
                        title:'提示',
                        content:res.data.message,
                        showCancel:false
                    })
                }
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    wx.showToast({
                        title:'获取成功'
                    })
                    that.timer()
                    that.setData({
                        codeDisable:true
                    })
                }
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
    showCanvas(){
        this.setData({
            canvasShow:true,
            showOverlayer:true
        })
    },
    updateData(){
        this.setData({
            canvasShow:false,
            showOverlayer:false
        })
    },
    onShareAppMessage(e) {
        const { store_id, activity_name, activity_id, activity_cat } = this.data
        let share_id = 1
        return {
            title: activity_name,
            path: `/pages/invit/index?sid=${store_id}&aid=${activity_id}&cid=${activity_cat}&share_id=${id}`,
            imageUrl: ''
        }
    },
    closeBox(){
        this.setData({
            payBoxShow:false,
            showOverlayer:false
        })
    },
    //是否在当前活动期间
    isBetweenActivity(cutDown){
        const { start_time, end_time, now_time } = cutDown
        //数据不存在
        if(!start_time || !end_time || !now_time){
            return
        }
        let start = new Date(start_time).getTime()
        let end = new Date(end_time).getTime()
        let now = new Date().getTime()
        
        //活动期间
        let isActivityTime = now > start && now < end
        this.setData({
            isActivityTime,
        })
    },
    //门店列表
   get_store() {
    const { store_id } = this.data
    
    let url = app.globalData.baseUrl + '/applet/store',
        that = this;
    let data = {
        method: 'store.getlist',
        store_id:store_id || wx.getStorageSync('store_id')
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
        const { storeInfo } = this.data
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
    },
    closeOverBox(){
        this.setData({
            overBox:false,
            showOverlayer:false
        })
    },
    toList(){
        this.closeOverBox()
        wx.setStorageSync('activity_type', 0)
        wx.navigateTo({
            url: '/pages/activity/index',
        })
    },
})