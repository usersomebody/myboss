import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam  } from '../../utils/common.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
    data:{
        store_id:'',
        activity_cat:'',
        activity_id:'',
        pid:'',
        activityInfo:{},
        joinGroupInfo:{},
        orderInfo:{},
        showOverlayer:false,
        groupBox:false,
        payBoxShow:false,
        userAvatarBox:false,
        //倒计时
        seconds: 60,
        codeDisable: false,
        hasData:false,
        submitData:{
            name:'',
            phone:'',
            code:""
        },
        phoneMember:'',
        nickname:'',
        user_type:"",
        user_id:'',
        isSameUserType:false, //是否是同一家店的会员
        groupStatus:4,
        groupingStatus:{
            1:{
                title:'拼团成功',
                intro:'拼团成功，请到我的会员卡查看',
                defaultAvatar:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211104/a84a77496d322fb846e384e51791431a.png',
                btnText:'前往约课',
                btnLink:'/pages/classAppointment/classAppointment',
                btnType:'ordinary',
                toOtherPage:'回到活动详情页',
                otherPageLink:'/pages/activity/group'
            },
            3:{
                title:'拼团失败',
                intro:'拼团失败，费用将在1-3个工作日退回',
                defaultAvatar:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211104/13c6140ff0b8dcbcddc5eea910d1313d.png',
                btnText:'重新发起拼团',
                btnLink:'/pages/activity/group',
                btnType:'ordinary',
                toOtherPage:'',
                otherPageLink:''
            },
            2:{
                title:'拼团中 已支付',
                intro:'邀请好友，即刻完成拼团',
                defaultAvatar:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211104/13c6140ff0b8dcbcddc5eea910d1313d.png',
                btnText:'邀请好友完成拼团',
                btnLink:'',
                btnType:'button',
                toOtherPage:'回到活动详情页',
                otherPageLink:'/pages/activity/group'
            },
            4:{
                title:'仅剩一个名额，点击参与拼团',
                intro:'',
                defaultAvatar:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211104/13c6140ff0b8dcbcddc5eea910d1313d.png',
                btnText:'参与超简单爱的拼单',
                btnLink:'',
                btnType:'ordinary',
                toOtherPage:'回到活动详情页',
                otherPageLink:'/pages/activity/group'   
            },
            5:{
                title:'购买成功',
                intro:'会员卡已发放，请到我的会员卡查看',
                defaultAvatar:'',
                btnText:'前往约课',
                btnLink:'/pages/classAppointment/classAppointment',
                btnType:'ordinary',
                toOtherPage:'',
                otherPageLink:''   
            }
        },
        groupMasterInfo:{},
        groupUserList:[],

        userId:'',//分享人的id
        pay_status:'',
        navigateLink:'',
        activity_status:'',
        is_end:'',
        isMember:''
    },
    onLoad(options){
        let url = 'pages/activity/groupDetail'
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
            redirectUrl,
            store_id:options.sid,
            activity_cat:options.cid,
            activity_id:options.aid,
            pid:options.pid,
            showOverlayer:options.groupBuy || false,
            groupBox:options.groupBuy || false,
            user_id:options.uid
        })
    },
    onShow(){
        this.getActivity()
        this.get_subscribe_auth();
    },
    //关闭弹窗
    closeBox(){
        this.setData({
            showOverlayer:false,
            groupBox:false,
            payBoxShow:false,
            userAvatarBox:false
        })
    },
    showUserAvatarList(){
        this.setData({
            showOverlayer:true,
            userAvatarBox:true
        })
    },
    gotoPage(e){
        const { link, type } = e.currentTarget.dataset
        const { groupStatus, user_type, store_id, activity_id, pid } = this.data
        let redirectArr = [
            '/pages/index/index',
            '/pages/my/my',
            '/pages/classAppointment/classAppointment',
            '/pages/courses/courses'
          ]
        
        if(groupStatus == 4 && type == 1){
            if(user_type != 1){
                this.setData({
                    payBoxShow:true,
                    showOverlayer:true
                })
            }else{
                this.joinPowerActivity(2)
            }
            return
        }
        if(!link){
            return
        }
        if(redirectArr.indexOf(link) > -1){
            wx.switchTab({
                url: link,
            })
            return
        }
        let str = `?aid=${activity_id}&sid=${store_id}&pid=${pid}${groupStatus == 4 ? '&isInvite=1' : groupStatus == 3 ? '&restInitGroup=1' : ''}`
        wx.navigateTo({
            url: link + str,
        })
    },
    //获取活动信息
    getActivity(){
        const { isSameStore, user_id, activity_id, pid } = this.data
        // wx.showModal({
        //     title:`${this.data.store_id}&${user_id}&${activity_id}&${pid}`
        // })
        let that = this
        let url = baseUrl + api.groupActivity
        let data = {
            method: 'activity.orderdetail',
            store_id: that.data.store_id || wx.getStorageSync('store_id') || '',
            activity_id,
            user_id,
            group_id:pid,
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
                console.log('res',res)
                const { desc_img, name, card_name, original_price, buy_price, order_sn, create_time, activity_status, pid, remain_buy_count, remain_time, head_img_arr, activity, pay_status, is_end} = res
                //活动信息
                let actInfo = {
                    seckill_price:accDiv(buy_price,100),
                    desc_img,
                    name,
                    card_name,
                    original_price:accDiv(original_price,100)
                }
                //订单信息
                let orderInfo = {
                    order_sn,
                    create_time,
                    buy_price:accDiv(buy_price,100),
                }
                //处理参与者名称
                let head_member_arr = head_img_arr.map((item)=>{
                    let obj = item
                    obj.user_name = item.user_name.slice(0,1) + '**'
                    obj.join_time = this.formatTime(item.join_time)
                    return obj
                })
                // 初始化团长信息
                let checkMasterInfo = head_img_arr.filter((item)=>{
                    return item.status == 1
                })
                //初始化当前团的状态
                let groupStatus = this.initializeGroupStatus(activity_status,pid,remain_buy_count, checkMasterInfo, pay_status)
                // 初始化当前参团的用户信息
                let joinGroupInfo = {
                    joinMember:head_img_arr,
                    now_time:this.formatTime(),
                    end_time:this.formatTime(remain_time),
                    number:remain_buy_count,
                    isInActivityTime:this.calculateInActivity(this.formatTime(remain_time)),
                }
                //跳转的链接地址
                let navigateLink = `/pages/activity/group?aid=${activity_id}&sid=${that.data.store_id}&pid=${pid}${groupStatus == 4 ? '&isInvite=1' : ''}`
                // activity_status 拼团状态 1成功 2进行中 3失败
                this.setData({
                    activity_status,
                    activityInfo:actInfo,
                    orderInfo,
                    groupStatus,
                    joinGroupInfo,
                    groupUserList:head_member_arr,
                    groupMasterInfo:checkMasterInfo[0],
                    activityList:this.formatActList(activity),
                    pay_status,
                    navigateLink,
                    is_end
                })
                this.getUserInfo()
            }
        })
    },
    initializeGroupStatus(status, pid, remain_buy_count, checkMasterInfo, pay_status){
        const { groupingStatus} = this.data
        if(pid == '-1'){
            return 5
        }

        if(status == 2 && pay_status == 3){
            groupingStatus['2'].intro = `邀请${remain_buy_count > 0 ? remain_buy_count + '位' : ''}好友，即刻完成拼团`
            this.setData({
                groupingStatus
            })
            return 2
        }

        if(status == 2 && pay_status != 3){
            groupingStatus['4'].title = `仅剩${remain_buy_count}个名额，点击参与拼团`
            groupingStatus['4'].btnText = `参与${checkMasterInfo[0].user_name}的拼单`
            this.setData({
                groupingStatus
            })
            return 4
        }

        return status
    },
    //倒计时处理
    formatTime(time, type){
        let format = type ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm:ss'

        if(!time){
            return moment().format(format)
        }
        return moment(time * 1000).format(format)
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
    //活动列表数据初始化
    formatActList(list){
        list.forEach(item => {
            item.sTime = this.formatTime(item.start_time,2)
            item.eTime = this.formatTime(item.end_time,2)
            item.prodPrice = accDiv(item.seckill_price,100)
        });
        return list
    },
    //获取用户信息
    getUserInfo(reloadType) {
        const { isSameStore, user_id, groupUserList } = this.data
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
                // 是否是当前团的成员
                let isMember = groupUserList.filter((item)=>{
                    return item.user_id == id
                })
                that.setData({ 
                    isSamePeople:user_id ? user_id == id  : true, 
                    user_id:user_id,
                    userId:id,
                    phoneMember: user_card && user_card.length ? user_card[0].phone : '',
                    user_type:user_type,
                    nickname: user_card && user_card.length ? user_card[0].name : nickname,
                    isSameUserType:user_card && user_card.length ? user_card[0].store_id == that.data.store_id : false,
                    isMember:isMember.length,
                    // isShowBtn:!isSameStore && wx.getStorageSync('user_type') == 1, //是否在其他店铺存在会员
                })

                
                // 活动状态 判断
                // 前置判断  拼团当前的状态 成功 失败 优先级最高 
                // 进行中 groupStatus = isSamePeople ? groupStatus : 4
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
    //参加拼团活动
    joinPowerActivity(type){
        const { activity_id, user_id, submitData, user_type, phoneMember, nickname, redirectUrl, joinGroupInfo, is_end  } = this.data
        
        if(is_end != 9){
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
        if(!joinGroupInfo.isInActivityTime){
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
        this.wxPay(type)
    },
    //微信支付
    wxPay(type) {
        const { activity_id, redirectUrl, activity_cat, user_id, userId, pid, user_type, phoneMember, submitData, nickname, isSameUserType } = this.data
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
                            cat_id:activity_cat,
                            activity_id:activity_id,
                            user_id:userId,
                            user_pid:pid,
                            buy_type:2,
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
        // this.get_auth()
        this.getActivity()
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
        this.get_auth()
        this.getActivity()
        // this.setData({
        //     getSuccess:true,
        //     showOverlayer:true
        // })
        // this.getActivityData(1)
    },
    updateGroupStatus(obj){
        const { joinGroupInfo } = this.data
        joinGroupInfo.isInActivityTime = false
        this.setData({
            joinGroupInfo
        })
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
    get_auth() {
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
    goOtherAct(e){
        const { item } = e.currentTarget.dataset
        let actList = {
            21:{
                name:'助力登顶',
                url:'/pages/invit/index',
            },
            22:{
                name:'限时秒杀',
                url:'/pages/activity/secondsKill',
            },
            23:{
                name:'超值拼团',
                url:'/pages/activity/group',
            }
        }
        let url = `${actList[item.activity_cat_id].url}?sid=${item.store_id}&aid=${item.id}&cid=${item.activity_cat_id}`
        wx.navigateTo({
            url,
        })
    },
    onShareAppMessage(e) {
        const { store_id, activity_name, activityInfo, activity_id, activity_cat, user_id, pid } = this.data
        let share_id = 1
        return {
            title: activity_name,
            path: `/pages/activity/groupDetail?sid=${store_id}&pid=${pid}&aid=${activity_id}&cid=${activity_cat}&uid=${user_id}&share_id=${share_id}`,
            imageUrl: activityInfo.desc_img
        }
    },
})