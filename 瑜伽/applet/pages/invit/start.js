import moment from '../../utils/moment.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam } from '../../utils/common.js'
import { api } from '../../utils/api.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
    data:{
        isIphoneX: app.globalData.isIphoneX,
        cutDown:{
            start_time:'',
            end_time:'',
            now_time:''
        },
        showTime:{
            start:'',
            end:''
        },
        progress:{
            initial_price:'',
            end_price:'',
            now_price:''
        },
        listHead:['头像','昵称','助力金额','时间'],
        list:[],
        isLogin:false,
        isActivityTime:false,
        avtivityOver:false,
        is_creating:true,
        payTotal:0,
        ruler:[],
        card_img:'',
        activity_id:'',
        activity_cat:'',
        activity_name:'',
        card_name:'',
        original_price:0,
        buying_price:0,
        user_id:'',
        userId:'',//外部带进来的
        user_type:'',
        participant_id:'', //是否参与过
        participantId:'',//外部带进来
        isSamePeople:true,
        showOverlayer:false,//遮挡层

        
        showFriendBox:false,
        powerSuccess:false,
        powerOver:false,
        getSuccess:false,
        buy_status:1,//1未购买 2已购买
        help_status:1,//1未完成 2 已完成
        rule:'',
        ruler_imgs:[],
        discoutPrice:'',//折扣价

        joinUserInfo:{
            nickname:'',
            avatar:'',
            card_name:''
        },
        store_id:"",
        redirectUrl:"",//授权登录失效 重新跳回的链接地址
        qr_img:'',
        isSameStore:true,
        isShowBtn:false,
        is_end:'',
        
        
    },
    onLoad(options){
        // let url = getCurrentPages()[0].route
        // let str = formatParam(getCurrentPages()[0].options)
        // let formatUrl = `/${url}${str ? '?' + str : ''}`
        // let redirectUrl = encodeURIComponent(formatUrl)
        let url = 'pages/invit/start'
        let str = formatParam(options)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)
        if(options.sid){
            // wx.setStorageSync('store_id', options.store_id)
            this.setData({
                store_id:options.sid
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
            userId:options.uid || '',
            participantId: options.pid || '',
            activity_id:options.aid || '',
            activity_cat:options.cid || '',
            redirectUrl,
        })
        
        //活动数据  ps：说实话 真不想这样搞 明明一个字段就可以搞定  直接用户身份拉取当前用户身份的活动数据就完事了 非得开个接口 离谱   
        if(options.pid){
            this.getActivityDataByPower()
        }else{
            this.getActivityData()
        }
    },
    onShow(){
        
    },
    //前往客服
    toKeFu(){
        // 全局存储二维码相关信息
        
        wx.navigateTo({
            url: 'kefu',
        })
    },
    // 更新数据
    updateProdStatus(){
        console.log('数据更新')
    },
    updateActivityStatus(){
        console.log('数据更新')
    },
    //创建订单
    createOrder(){
        const { buy_status,payTotal } = this.data
        if(buy_status == 2){
            return
        }
        wx.showLoading({
            title: '正在创建订单~',
        })
        // if(payTotal <= 0){
        //     wx.showModal({
        //         title:'提示',
        //         content:'价格不合法',
        //         showCancel:false
        //     })
        //     return
        // }
        // this.setData({
        //     showOverlayer:true
        // })
        this.wxPay()
        //参加抢购 下单
    },
    joinActivity(){
        wx.navigateTo({
            url:`/pages/invit/index?sid=${this.data.store_id}&aid=${this.data.activity_id}&cid=${this.data.activity_cat}`
        })
    },
    //获取活动数据
    getActivityData(){
        const { redirectUrl, participantId, activity_id, activity_cat } =  this.data
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
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                        url: `/pages/login/login?path=${redirectUrl}`,
                    })
                }else if(res.data.data.is_end != 9){
                    wx.showModal({
                        title:'提示',
                        content:'活动已结束',
                        showCancel:false,
                        success(){
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })
                    return
                } else if (res.data.code == 200) {
                    const { id, name, desc_img, start_time, end_time, card_name, is_end, original_price, buying_price, participant_id, rule,rule_imgs, help_money = 0, qr_type, qr_img, shop_name, other_head_img, other_name, guide, buy_status = 1, help_status } = res.data.data
                    let cutDown = {
                        start_time:that.formatTime(start_time),
                        end_time:that.formatTime(end_time),
                        now_time:that.formatTime()
                    }
                    let showTime = {
                        start:that.formatShowTime(start_time),
                        end:that.formatShowTime(end_time)
                    }
                    //价格初始状态
                    let progress = {
                        initial_price:buying_price > 0 ? accDiv(buying_price,100) : 0,
                        end_price:accDiv(original_price,100),
                        now_price:help_money > 0 ? accDiv(help_money,100) : 0,
                        remaining_price:accDiv(accSub(original_price,help_money),100)
                    }
                    let qrcode = {
                        desc_img,
                        qr_type,
                        qr_img,
                        shop_name,
                        other_head_img,
                        other_name,
                        guide
                    }
                    that.isBetweenActivity(cutDown)
                    app.globalData.qrcode = qrcode
                    wx.setNavigationBarTitle({
                        title:name,
                    })
                    that.setData({
                        activity_id:id,
                        card_img:desc_img,
                        card_name,
                        activity_name:name,
                        original_price:accDiv(original_price,100),
                        help_money:accDiv(help_money,100),
                        buying_price:buying_price > 0 ? accDiv(buying_price,100) : 0,
                        discoutPrice:accSub(progress.end_price,progress.initial_price),
                        cutDown,
                        showTime,
                        participant_id,
                        progress,
                        buy_status,
                        help_status,
                        rule,
                        qr_img,
                        ruler:formatParagraph(filterEOF(rule)),
                        ruler_imgs:rule_imgs ? JSON.parse(rule_imgs) : [],
                        is_end
                    })
                    //是否在活动期间
                    //用户数据
                    that.getUserInfo()
                    //参与人的数据
                    if(that.data.participantId){
                        that.getJoinActivityData()
                    }
                    //计算应该支付的价格
                    that.calculateTotalPrice()
                }
                
            }
        })
    },
    //获取被助力人参与活动的信息
    getActivityDataByPower(reloadType){
        const { redirectUrl, participantId } =  this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.getparticipantzctivity',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            participant_id:participantId
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
                if(res.data.code == 500){
                    wx.showModal({
                        title:'提示',
                        content:'活动已结束',
                        showCancel:false,
                        success(){
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })
                    return
                }
                
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                        url: `/pages/login/login?path=${redirectUrl}`,
                    })
                } else if (res.data.code == 200) {
                    const { id, name, desc_img, start_time, end_time, card_name, is_end, original_price, buying_price, participant_id, rule, help_money = 0, qr_type, qr_img, shop_name, other_head_img, other_name, guide, buy_status = 1, help_status, help_list } = res.data.data
                    let cutDown = {
                        start_time:that.formatTime(start_time),
                        end_time:that.formatTime(end_time),
                        now_time:that.formatTime()
                    }
                    let showTime = {
                        start:that.formatShowTime(start_time),
                        end:that.formatShowTime(end_time)
                    }
                    //价格初始状态
                    let progress = {
                        initial_price:buying_price > 0 ? accDiv(buying_price,100) : 0,
                        end_price:accDiv(original_price,100),
                        now_price:help_money > 0 ? accDiv(help_money,100) : 0,
                        remaining_price:accDiv(accSub(original_price,help_money),100)
                    }
                    let qrcode = {
                        desc_img,
                        qr_type,
                        qr_img,
                        shop_name,
                        other_head_img,
                        other_name,
                        guide
                    }
                    that.isBetweenActivity(cutDown)
                    app.globalData.qrcode = qrcode
                    wx.setNavigationBarTitle({
                        title:name,
                    })
                    that.setData({
                        activity_id:id,
                        card_img:desc_img,
                        card_name,
                        activity_name:name,
                        original_price:accDiv(original_price,100),
                        help_money:accDiv(help_money,100),
                        buying_price:buying_price > 0 ? accDiv(buying_price,100) : 0,
                        discoutPrice:accSub(progress.end_price,progress.initial_price),
                        cutDown,
                        showTime,
                        participant_id,
                        progress,
                        buy_status,
                        help_status,
                        rule,
                        qr_img,
                        ruler:formatParagraph(filterEOF(rule)),
                        list:that.showListFormat(help_list),
                        is_end,
                    })
                    //是否在活动期间
                    //用户数据
                    that.getUserInfo(reloadType)
                    //参与人的数据
                    if(that.data.participantId){
                        that.getJoinActivityData()
                    }
                    //计算应该支付的价格
                    that.calculateTotalPrice()
                }
            }
        })
    },
    //获取用户信息
    getUserInfo(reloadType) {
        const { participant_id, help_status, buy_status, isSameStore } = this.data
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
                    const { id, user_card, user_type } = res.data.data
                    const { userId } = that.data
                    let isSamePeople = userId ? userId == id : true
                    let powerOver = help_status == 2 && buy_status == 1
                    that.setData({ 
                        user_id: res.data.data.id,
                        isSamePeople,
                        user_type,
                        // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1,
                        showFriendBox:reloadType ? false : isSamePeople ? false : true,
                        showOverlayer:reloadType ? false : powerOver ? true : isSamePeople ? false : true,
                        powerOver
                    })
                    if(isSamePeople && !participant_id){
                        wx.showModal({
                            title:'提示',
                            content:'您未参与活动',
                            showCancel:false,
                            success(){
                                console.log('111')
                                wx.redirectTo({
                                    url:`/pages/invit/index?sid=${that.data.store_id}&aid=${that.data.activity_id}&cid=${that.data.activity_cat}`
                                })
                            }
                        })
                        return
                    }
                    that.getPowerList()
                    
                }
            }
        })
    },
    // 获取冲顶记录
    getPowerList(){
        const { activity_id, user_id, participant_id, isSamePeople, userId, participantId } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.helprecord',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id:activity_id,
            user_id:isSamePeople ? user_id : userId,
            participant_id:isSamePeople ? participant_id  : participantId 
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
                // if(res.data.code != 200){
                //     wx.showModal({
                //         title:'提示',
                //         content:res.data.message,
                //         showCancel:false
                //     })
                // }
                
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    let list = that.showListFormat(res.data.data) 
                    that.setData({
                        list:list
                    })
                }
            },
        })
    },
    
    //用户助力
    friendHelp(){
        const { activity_id, user_id, submitData, user_type, participant_id, participantId } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.help',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id:activity_id,
            user_id:user_id,
            participant_id: participantId,
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
                that.closeFriendHelp()
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    // that.getActivityDataByPower()
                    that.setData({
                        showOverlayer:true,
                        powerSuccess:true
                    })
                }
            },
        })
    },
    //获取参与人的信息（被助力）
    getJoinActivityData(){
        const { activity_id, participant_id, participantId } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.helpdetail',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id:activity_id,
            participant_id: participantId,
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
                // that.closeFriendHelp()
                if (res.data.code == 400) {
                    wx.removeStorageSync('token')
                } else if (res.data.code == 200) {
                    const { nickname = '杨丽丽', head_img = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210618/a658c51ba6f225a9d89549d63314d927.png' } = res.data.data.userinfo
                    const { card_name = '' } = res.data.data.activity
                    console.log({nickname,head_img,card_name})
                    let joinUserInfo = {
                        nickname,
                        avatar: head_img,
                        card_name
                    }
                    that.setData({
                        joinUserInfo
                    })
                }
            },
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
        console.log('timeStampArr',timeStampArr)
        let  ymd = timeStampArr[0].replace(/-/g,'.')
        // let  ymd = timeStampArr[0].split('-')
        console.log('ymd',ymd)
        return ymd
        // return `${ymd[1]}月${ymd[2]}日 ${timeStampArr[1]}`

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
        let avtivityOver = now > end
        if(avtivityOver){
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
        }
        this.setData({
            isActivityTime,
            avtivityOver
        })
    },
    //计算总价
    calculateTotalPrice(){
        const { progress } = this.data
        this.setData({
            payTotal:accSub(progress.end_price,progress.now_price)
        })
    },
    //弹层关闭
    closeFriendHelp(){
        this.setData({
            showFriendBox:false,
            showOverlayer:false
        })
    },
    //助力成功弹层关闭
    closePowerSuccess(){
        this.getActivityDataByPower(1)
        this.setData({
            powerSuccess:false,
            showOverlayer:false
            
        })
    },
    //助力结束弹层关闭
    closePowerOver(e){
        const { type } = e.target.dataset
        this.setData({
            powerOver:false,
            showOverlayer:false
        })
        if(type == 1){
            wx.showLoading({
                title: '正在创建订单~',
            })
            this.wxPay()
        }
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
    toIndex(){
        wx.navigateTo({
            url: `index?sid=${this.data.store_id}&aid=${this.data.activity_id}&cid=${this.data.activity_cat}`,
        })
    },
    //数据处理
    showListFormat(data){
        if(!data || !data.length){
            return []
        }
        data.forEach((item)=>{
            item.help_money = accDiv(item.help_money || 0, 100) + '元'
            item.head_img = item.head_img,
            item.nickname = item.nickname.slice(0,2) + '***',
            item.create_time = moment(item.create_time * 1000).format('MM/DD HH:mm')
        })
        return data
    },
    //微信支付
    wxPay() {
        const { activity_id, participant_id, redirectUrl } = this.data
        let that = this
        let url = baseUrl + api.activityData
        let header = {
            token: wx.getStorageSync('token') || ''
        }
        wx.login({
            success(res) {
            if (res.code) {
                wx.request({
                    url,
                    method: 'POST',
                    header,
                    data: {
                        activity_id:activity_id,
                        participant_id:participant_id,
                        code: res.code,
                        store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
                        method:'activity.createorder'
                    },
                    success(res) {
                        if(res.data.code != 200){
                            wx.showModal({
                                title:'提示',
                                content:res.data.message,
                                showCancel:false
                            })
                        }
                        if (res.data.code == 400) {
                            wx.removeStorageSync('token')
                            wx.redirectTo({
                                url: `/pages/login/login?path=${redirectUrl}`,
                            })
                        } else if (res.data.code == 200) {
                            wx.showLoading({
                                title: '正在支付中...',
                            })
                            wx.requestPayment({
                                'appId':`${res.data.data.appid}`,
                                'timeStamp': `${res.data.data.timestamp}`,
                                'nonceStr': res.data.data.nonce_str,
                                'package': `prepay_id=${res.data.data.prepay_id}`,
                                'signType': 'MD5',
                                'paySign': res.data.data.sign,
                                'success'() {
                                    that.paySuccessCallback();
                                },
                                complete(result) {
                                    wx.hideLoading()
                                    if (result.errMsg == 'requestPayment:ok') {
                                        //清空产品数据
                                        app.globalData.confirmOrder = {};
                                        return
                                    }
                                    that.cancelPay(result)
                                }
                            })
                        }
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
    this.getActivityData()
  },
  closeBox(){
        this.setData({
            getSuccess:false,
            showOverlayer:false
        })
    },

  onShareAppMessage(e) {
    let type = e.target.dataset.type
    let uid = '' //不带参数分享
    let pid = '' //不带参数分享
    let sid = ''
    let path = ''
    let share_id = 1
    const { user_id, participant_id, userId, participantId, card_img, store_id, activity_name, activity_cat, activity_id } = this.data
    sid = store_id ? store_id : wx.getStorageSync('store_id')
    if(type == 1){
        // 自己分享
        uid = user_id
        pid = participant_id
        path = `/pages/invit/start?sid=${sid}&uid=${uid}&pid=${pid}&aid=${activity_id}&cid=${activity_cat}&share_id=${share_id}`
    }else if(type == 2){
        //别人帮你分享
        uid = userId
        pid = participantId
        path = `/pages/invit/start?sid=${sid}&uid=${uid}&pid=${pid}&aid=${activity_id}&cid=${activity_cat}&share_id=${share_id}`
    }else{
        pid = participant_id
        path = `/pages/invit/index?sid=${sid}&aid=${activity_id}&cid=${activity_cat}&share_id=${share_id}`
    }
    return {
        title: activity_name,
        path: path,
        imageUrl: card_img
    }
  }
})