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
        isActivityTime:true,
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
        remainingNum:0,
        activity_name:'',
        original_price:0,
        buying_price:0,
        card_use_time:'领卡后立即生效',
        card_use_type:0,//会员卡生效状态 0 领卡后立即生效 1约课生效

        getSuccess:false,
        hasData:false,

        cardTypeInfo:{
            1:{
              name:'剩余天数:',
              key:'day',
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
          isSameUserType:false, //是否是同一家店的会员

          joinGroupInfo:{},
          groupBox:false,
          isJoin:true,//是否参与了拼团
          isGrouping:false,//拼团是否正在进行中
          isInvite:'',
          pid:'',//参与记录id
          activity_participant:[],
          user_data:{},
          payType:0,//产品购买类型
          restInitGroup:'',
          group_number:'',
          loaded:false
    },
    onLoad(options){
        let url = 'pages/activity/group'
        let str = formatParam(options)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)
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
            isInvite:options.isInvite || '',
            restInitGroup:options.restInitGroup || '',
            pid:options.pid || '',
            isIphoneX: app.globalData.isIphoneX,
            tatusBarHeight:app.globalData.statusBarHeight,
            redirectUrl,
            activity_id:options.aid || '',
            activity_cat:options.cid || '',
        })
        // this.get_store()
        // this.getActivityData()
        this.getUserInfo()
        
    },
    onShow(){
        let token = wx.getStorageSync('token');
        if(!token){
           return
        }
        this.get_store()
        this.getActivityData()
        this.get_subscribe_auth();
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
        const { redirectUrl, store_id, activity_id, activity_cat, pid } = this.data
        //页面进入必须授权登录
        let token = wx.getStorageSync('token');
        if(!token){
           return
        }
        let that = this
        let url = baseUrl + api.groupActivity
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
                console.log('res',res)
                const {
                    activity:{ id, card_id, activity_cat_id, name, prizes_number, remain_num, group_number, desc_img, original_price, seckill_price, remain_time, end_time, rule, rule_imgs, is_end },
                    card,
                    course,
                    user_data,
                    activity_participant,
                    children
                } = res
                let card_info = card
                let cutDown = {
                    end_time:that.formatTime(end_time),
                    now_time:that.formatTime()
                }
                card_info.assets_money = accDiv(card_info.assets_money,100)
                //查找发起人的用户信息
                let groupMaster = []
                if(pid && activity_participant.length){
                    groupMaster = activity_participant.filter((item)=>{
                        return item.id == pid
                    })
                }
                //本地读取nickname
                that.setData({
                    courseList:course,
                    activity_id:id,
                    activity_cat_id,
                    bannerList:new Array(desc_img),
                    remainingNum:remain_num,
                    group_number,
                    activity_participant:that.getGroupList(activity_participant),
                    activity_name:name,
                    original_price:accDiv(original_price,100),
                    buying_price:seckill_price > 0 ? accDiv(seckill_price,100) : 0,
                    card_use_time: card_info.use_type == 0 ? '领卡后立即生效' : '约课生效',
                    card_use_type:card_info.use_type ,//会员卡生效状态 0 领卡后立即生效 1约课生效
                    nickName:wx.getStorageSync('userinfo').nickName || '',
                    'submitData.name':wx.getStorageSync('userinfo').nickName || '',
                    buy_status:user_data.buy_status,//状态 0参团中 1可以购买或发起拼团 2只能购买 3不能购买及拼团
                    isJoin:user_data.buy_status == 0 || user_data.buy_status == 3,
                    user_data,
                    ruler:formatParagraph(filterEOF(rule)),
                    ruler_imgs:rule_imgs || [],
                    card_info,
                    cutDown,
                    is_end,
                    groupMaster,
                })
                
                that.isBetweenActivity(cutDown,noreload)
            }
        })
    },
    //获取用户信息
    getUserInfo(reloadType) {
        const { isSameStore, user_id } = this.data
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
                    isSameUserType:user_card && user_card.length ? user_card[0].store_id == that.data.store_id : false,
                    loaded:true
                    // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1, //是否在其他店铺存在会员
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
    toJoin(e){
        const { user_type, buy_status, activity_id, remainingNum, isJoin, store_id, activity_cat, isActivityTime, user_data, user_id, group_number, joinGroupInfo,loaded } = this.data
        // joinGroupInfo.differ_count
        if(!loaded){
            return
        }
        const { type } = e.currentTarget.dataset
        this.setData({
            payType:type,//产品购买类型
            groupBox:false,
            showOverlayer:false
        })
        if(isJoin){
            wx.navigateTo({
                url: `/pages/activity/groupDetail?sid=${store_id}&cid=${activity_cat}&aid=${activity_id}&uid=${user_id}&pid=${user_data.group_id}`,
            })
            return
        }
        if((remainingNum < group_number || remainingNum < joinGroupInfo.differ_count) && (type != 1)){
            wx.showModal({
                title:'提示',
                content:'活动产品数量不足，不可拼团购买',
                showCancel:false
            })
            return
        }
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
        if(!isActivityTime){
            wx.showModal({
                title:'提示',
                content:'活动已经结束',
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
        const { activity_id, user_id, submitData, user_type, phoneMember, nickname, redirectUrl, isActivityTime, is_end  } = this.data
        
        if(!isActivityTime || is_end != 9){
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
        const { activity_id, redirectUrl, activity_cat_id, user_id, user_type, phoneMember, submitData, nickname, isSameUserType, isInvite, pid, joinGroupInfo,payType } = this.data
        let checkData = user_type != 1 ? submitData.phone : phoneMember
        let that = this
        let url = baseUrl + api.groupActivity
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
                            user_pid:isInvite && payType == 2 ? pid : payType == 3 ? joinGroupInfo.id : 0,
                            buy_type:payType == 1 ? 1 : 2,
                            phone:checkData,
                            // is_member: isSameUserType && user_type == 1 ? 1 : 2,
                            // user_name: isSameUserType && user_type == 1 ? nickname || submitData.name : submitData.name || nickname,
                            is_member: user_type == 1 ? 1 : 2,
                            user_name: user_type == 1 ? nickname || submitData.name : submitData.name || nickname,
                            auth_code:submitData.code || '',
                            code: res.code,
                            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
                            method:'activity.createorder'
                        },
                        success(res) {
                            const { appid, timestamp, nonce_str, prepay_id, sign, group_id } = res
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
                                    that.paySuccessCallback(group_id);
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
    paySuccessCallback(partId) {
        const { activity_id,user_id, store_id, joinGroupInfo, isInvite, payType} = this.data
        
        wx.hideLoading();
        wx.showToast({
            title:'支付完成'
        })
        if(payType == 1){
            wx.navigateTo({
                url:`/pages/activity/groupDetail?aid=${activity_id}&pid=${partId}&uid=${user_id}&sid=${store_id}`
            })
            return
        }
        
        this.get_auth(partId)

        // group_id
        // this.setData({
        //     getSuccess:true,
        //     showOverlayer:true
        // })
        // this.getActivityData(1)
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
    //是否在当前活动期间
    isBetweenActivity(cutDown,noreload){
        const { remainingNum, is_end } = this.data
        const { end_time} = cutDown
        //数据不存在
        if(!end_time){
            return
        }
        let end = new Date(end_time).getTime()
        let now = new Date().getTime()
        
        //活动期间
        let isActivityTime = now < end
        this.setData({
            isActivityTime,
            overBox: !noreload ? remainingNum == 0 || is_end != 9 ? true : !isActivityTime : false,
            showOverlayer:remainingNum == 0 || is_end != 9 ? true : !isActivityTime
        })
    },
    // 计算当前是否在活动期间
    calculateInActivity(end_time){
        //数据不存在
        if(!end_time){
            return
        }
        let end = new Date(end_time).getTime()  
        let now = new Date().getTime()
        
        //活动期间
        let isActivityTime = now < end
        console.log('isActivityTime',isActivityTime)
        return isActivityTime
    },
    closeBox(){
        this.setData({
            showOverlayer:false,
            payBoxShow:false,
            overBox:false,
            groupBox:false,
            getSuccess:false
        })
    },
    toList(){
        this.closeBox()
        wx.setStorageSync('activity_type', 0)
        wx.navigateTo({
            url: '/pages/activity/index',
        })
    },
    showGroupBox(e){
        const { obj } = e.currentTarget.dataset
        this.setData({
            showOverlayer:true,
            groupBox:true,
            joinGroupInfo:obj
        })
    },
    // 获取当前拼团列表
    getGroupList(list){
          list.forEach(item => {
            item.end_time = this.formatTime(item.remain)
            item.now_time = this.formatTime()
            item.isInActivityTime = this.calculateInActivity(item.end_time)
        });
        let valList = list.filter((item)=>{
            return item.isInActivityTime
        })
        console.log('valList',valList)
        return valList
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
            phoneNumber: storeInfo.phone 
        })
    },
    updateGroupStatus(){
        this.getActivityData()
    },
    //手动开启订阅
    handleSubsribe() {
        var that = this;
        wx.openSetting({
            success(res) {
                that.get_subscribe_auth();
            }
        })
    },
    //获取是否开启订阅开关
    get_subscribe_auth() {
        var that = this;
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                let isAllow = res.subscriptionsSetting.mainSwitch;
                that.setData({
                    isAllow
                })
            },
            fail(res) {
                console.log("调用失败：", res)
            }
        })
    },
    //获取模板消息权限
    get_auth(pid) {
        const { activity_id,user_id, store_id, joinGroupInfo, payType} = this.data
        var that = this;
        if (!that.data.isAllow) {
            that.handleSubsribe();
            return false
        }
        let tmplIds = ["aV8XjRkqB8HWAjWZP1yC76AbuU4FoO1aHtusySdCBJ4"];
        wx.requestSubscribeMessage({
            tmplIds,
            success(res) {
                let arr = [];
                for (let i in tmplIds) {
                    if (res[tmplIds[i]] == "accept") {
                        arr.push(tmplIds[i]);
                    }
                }
                if (arr.length > 0) {
                    that.setData({
                        template_id: arr.join(',')
                    })
                }
                wx.navigateTo({
                    url:`/pages/activity/groupDetail?aid=${activity_id}&pid=${payType == 2 ? pid : payType == 3 ? joinGroupInfo.id : 0}&uid=${user_id}&sid=${store_id}&groupBuy=1`
                })
                console.log('arr',arr)
                // that.setData({
                //     is_success: false
                // })
            },
            fail(res) {
                console.log(res)

            }
        })
    },
    onShareAppMessage(e) {
        const { store_id, activity_name, bannerList, activity_id, activity_cat, user_id } = this.data
        let share_id = 1
       
        return {
            title: activity_name,
            path: `/pages/activity/group?sid=${store_id}&aid=${activity_id}&uid=${user_id}&cid=${activity_cat}&share_id=${share_id}`,
            imageUrl: bannerList[0]
        }
    },
})