import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam  } from '../../utils/common.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
    data:{
        store_id:'',
        indicatorDots:false,
        bannerList:[],
        swiperCurrent:0,
        isIphoneX: app.globalData.isIphoneX,
        statusBarHeight:app.globalData.statusBarHeight,
        cutDown:{},
        isActivityTime:true,
        avtivityOver:false,
        courseList:[],
        ruler:[],
        redirectUrl:"",
        submitData:{
            name:'',
            phone:'',
            code:""
        },
        phoneMember:'',
        nickname:'',
        //倒计时
        seconds: 60,
        codeDisable: false,
        
        isSameStore:true,
        isShowBtn:false,

        //课程列表
        courseList:[],

        //手机号弹层
        payBoxShow:false,
        showOverlayer:false,

        buy_status:1,

        overBox:false,

        //活动数据
        activity_id:'',
        activity_cat_id:'',//分类id
        bannerList:[],
        card_name:'',
        remainingNum:0,
        activity_name:'',
        original_price:0,
        buying_price:0,
        card_use_time:'领卡后立即生效',
        card_expiration_time:'',
        card_use_type:0,//会员卡生效状态 0 领卡后立即生效 1约课生效
        card_id:'',

        getSuccess:false,
        hasData:false,

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
          card_info:{},
          is_end:'',
          storeInfo:{},
          ruler_imgs:[],
          isSameUserType:false //是否是同一家店的会员
    },
    onLoad(options){
        let url = 'pages/activity/secondsKill'
        let str = formatParam(options)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)
        console.log('redirectUrl',redirectUrl )
        if(options.sid){
            this.setData({
                store_id:options.sid,
            })
        }
        this.setData({
            isSameStore: options.sid  == wx.getStorageSync('store_id'),
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
            tatusBarHeight:app.globalData.statusBarHeight,
            redirectUrl,
            activity_id:options.aid || '',
            activity_cat:options.cid || '',
        })
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
    updateProdStatus(){
        console.log('更新数据')
    },
    // 获取活动数据
    getActivityData(noreload){
        const { redirectUrl, store_id, activity_id, activity_cat } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'acitivity.get',
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
                const { card_info, id, activity_cat_id, name,desc_img, start_time, end_time, card_name, card_id, prizes_number, buy_number, original_price, seckill_price, card_expiration_time, card_use_type, participant_id,  buy_status, rule, rule_imgs, is_end
                } = res
                let cutDown = {
                    start_time:that.formatTime(start_time),
                    end_time:that.formatTime(end_time),
                    now_time:that.formatTime()
                }
                card_info.assets_money = accDiv(card_info.assets_money,100)

                //本地读取nickname
                that.setData({
                    activity_id:id,
                    activity_cat_id,
                    bannerList:new Array(desc_img),
                    card_name,
                    remainingNum:accSub(prizes_number,buy_number),
                    activity_name:name,
                    original_price:accDiv(original_price,100),
                    buying_price:seckill_price > 0 ? accDiv(seckill_price,100) : 0,
                    card_use_time: card_use_type == 0 ? '领卡后立即生效' : '约课生效',
                    card_expiration_time:that.formatTimeShow(card_expiration_time),
                    card_use_type,//会员卡生效状态 0 领卡后立即生效 1约课生效
                    card_id,
                    cutDown,
                    nickName:wx.getStorageSync('userinfo').nickName || '',
                    'submitData.name':wx.getStorageSync('userinfo').nickName || '',
                    participant_id: participant_id || '',
                    buy_status,
                    ruler:formatParagraph(filterEOF(rule)),
                    ruler_imgs:rule_imgs ? JSON.parse(rule_imgs) : [],
                    card_info,
                    is_end                    
                })
                that.isBetweenActivity(cutDown,noreload)
                that.getCourseList(card_id)
            }
        })
    },
    //获取用户信息
    getUserInfo(reloadType) {
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
        request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                const { id, user_card, user_type, nickname } = res
                that.setData({ 
                    user_id:id,
                    phoneMember: user_card && user_card.length ? user_card[0].phone : '',
                    user_type:user_type,
                    nickname: user_card && user_card.length ? user_card[0].name : nickname,
                    isSameUserType:user_card && user_card.length ? user_card[0].store_id == that.data.store_id : false
                    // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1, //是否在其他店铺存在会员
                })
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
        request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                that.setData({ 
                    courseList:res || []
                })
            }
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
        request({
            url,
            data,
            header,
            method: 'POST',
            success: (res) => {
                wx.showToast({
                    title:'获取成功'
                })
                that.timer()
                that.setData({
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
    toJoin(){
        const { user_type, buy_status, avtivityOver, activity_id, remainingNum } = this.data
        if(remainingNum == 0){
            wx.showModal({
                title:'抢购已结束',
                icon: 'none',
                mask:true,
                showCancel:false,
                success(){
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            return
        }
        if(avtivityOver){
            wx.showModal({
                title:'提示',
                content:'活动已经结束',
                showCancel:false
            })
            return
        }
        if(buy_status == 2){
            wx.showModal({
                title:'提示',
                content:'您已经参与过活动',
                showCancel:false
            })
            return
        }
        if(user_type != 1){
            this.setData({
                payBoxShow:true,
                showOverlayer:true
            })
        }else{
            this.joinPowerActivity()
        }
    },
    //参加助力活动
    joinPowerActivity(){
        const { activity_id, user_id, submitData, user_type, phoneMember, nickname, redirectUrl, avtivityOver, isActivityTime, is_end  } = this.data
        
        if(avtivityOver || is_end != 9){
            wx.showModal({
                title:'活动已结束',
                icon: 'none',
                mask:true,
                showCancel:false,
                success(){
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            return
        }
        if(!isActivityTime){
            wx.showModal({
                title:'不在活动期间',
                icon: 'none',
                mask:true,
                showCancel:false,
                success(){
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            return
        }
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
        wx.showLoading({
            title: '正在创建订单~',
        })
        this.wxPay()
    },
    //微信支付
    wxPay() {
        const { activity_id, participant_id, redirectUrl, activity_cat_id, user_id, user_type, phoneMember, submitData, nickname, isSameUserType } = this.data
        let checkData = user_type != 1 ? submitData.phone : phoneMember
        let that = this
        let url = baseUrl + api.wxPay
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.login({
            success(res) {
                if (res.code) {
                    request({
                        url,
                        method: 'POST',
                        header,
                        isTologin:true,
                        redirectUrl,
                        data: {
                            cat_id:activity_cat_id,
                            activity_id:activity_id,
                            user_id:user_id,
                            phone:checkData,
                            // is_member: isSameUserType && user_type == 1 ? 1 : 2,
                            // user_name: isSameUserType && user_type == 1 ? nickname || submitData.name : submitData.name,
                            is_member: user_type == 1 ? 1 : 2,
                            user_name: user_type == 1 ? nickname || submitData.name : submitData.name,
                            auth_code:submitData.code || '',
                            code: res.code,
                            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
                            method:'wechatpay.createorder'
                        },
                        success(res) {
                            const { appid, timestamp, nonce_str, prepay_id, sign } = res
                            that.setData({
                                payBoxShow:false,
                                showOverlayer:false
                            })
                            wx.showLoading({
                                title: '正在支付中...',
                            })
                            wx.requestPayment({
                                'appId':`${appid}`,
                                'timeStamp': `${timestamp}`,
                                'nonceStr': nonce_str,
                                'package': `prepay_id=${prepay_id}`,
                                'signType': 'MD5',
                                'paySign': sign,
                                'success'() {
                                    that.paySuccessCallback();
                                },
                                complete(result) {
                                    console.log('result',result)
                                    wx.hideLoading()
                                    if (result.errMsg == 'requestPayment:ok') {
                                        //清空产品数据
                                        app.globalData.confirmOrder = {};
                                        return
                                    }
                                    that.cancelPay(result)
                                }
                            })
                        },
                        fail(err) {
                            that.data.is_creating = false;
                            wx.hideLoading();
                        }
                    })
                }
            }
        })
    },
    //  取消支付
    cancelPay(res) {
        let that = this
        if (res.isPayFail || res.errMsg == 'requestPayment:fail cancel' || res.errMsg == 'requestPayment:cancel' || /^requestPayment:fail connect ETIMEDOUT/.test(res.errMsg)) {
        wx.showModal({
            title: '订单未支付',
            // content: '订单会保留一段时间，请尽快完成支付',
            showCancel: false,
            success() {
            //清空产品数据
            app.globalData.confirmOrder = {};
            // wx.redirectTo({
            //   url: router('orderList')
            // })
            }
        })
        }
    },
    paySuccessCallback() {
        wx.hideLoading();
        wx.showToast({
            title:'支付完成'
        })
        this.setData({
            getSuccess:true,
            showOverlayer:true
        })
        this.getActivityData(1)
    },
    //关闭弹窗
    closeBox(){
        this.setData({
            getSuccess:false,
            showOverlayer:false
        })
    },
    //去约课
    toBooking(){
        const { store_id } = this.data
        wx.setStorageSync('store_id',store_id)
        wx.removeStorage({key: 'token'})
        wx.removeStorage({key: 'user_id'})
        wx.removeStorage({key: 'userinfo'})
        wx.switchTab({
            url: '/pages/classAppointment/classAppointment',
        })
    },
    //倒计时处理
    formatTime(time){
        if(!time){
            return moment().format('YYYY/MM/DD HH:mm:ss')
        }
        return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
    },
    //显示的时间格式处理
    formatShowTime(time){
        let  timeStamp = moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
        let  timeStampArr = timeStamp.split(' ')
        let  ymd = timeStampArr[0].split('-')
        return `${ymd[0]}年${ymd[1]}月${ymd[2]}日}`

    },
    formatTimeShow(time){
        return moment(time * 1000).format('YYYY/MM/DD')
    },
    //是否在当前活动期间
    isBetweenActivity(cutDown,noreload){
        const { remainingNum } = this.data
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
        let avtivityOver = now > end
        this.setData({
            isActivityTime,
            avtivityOver,
            overBox: !noreload ? remainingNum == 0 ? true : avtivityOver : false,
            showOverlayer:remainingNum == 0 ? true : avtivityOver
        })
    },
    closeOverBox(){
        this.setData({
            showOverlayer:false,
            overBox:false
        })
    },
    closeVipBox(){
        this.setData({
            showOverlayer:false,
            payBoxShow:false
        })
    },
    toList(){
        this.closeOverBox()
        wx.setStorageSync('activity_type', 0)
        wx.navigateTo({
            url: '/pages/activity/index',
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
    onShareAppMessage(e) {
        const { store_id, activity_name, bannerList, activity_id, activity_cat } = this.data
        let share_id = 1
        return {
            title: activity_name,
            path: `/pages/activity/secondsKill?sid=${store_id}&aid=${activity_id}&cid=${activity_cat}&share_id=${share_id}`,
            imageUrl: bannerList[0]
        }
    },
})