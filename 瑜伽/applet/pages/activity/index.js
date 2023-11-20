import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { accSub, accDiv, formatParagraph, filterEOF, telReg, formatParam } from '../../utils/common.js'
import { request } from '../../utils/util.js'
const app = getApp()
const { baseUrl } = app.globalData
Page({
    data:{
        activityType:[
            {
                id:0,
                name:'全部活动',
                url:'',
                secondaryUrl:''
            },
            {
                id:24,
                name:'幸运转盘',
                url:'/pages/activity/lucky',
                secondaryUrl:''
            },
            {
                id:21,
                name:'助力登顶',
                url:'/pages/invit/index',
                secondaryUrl:'/pages/invit/start'
            },
            {
                id:22,
                name:'限时秒杀',
                url:'/pages/activity/secondsKill',
                secondaryUrl:''
            },
            {
                id:23,
                name:'超值拼团',
                url:'/pages/activity/group',
                secondaryUrl:'/pages/activity/groupDetail'
            }
          ],
        page:1,
        count:10,
        totalCount:0,
        activityList:[],
        activeId:0,
        list:[],
        isLast:false,
        isLoading:false,
        redirectUrl:'',
        btnText:{   
            23:'参与拼团',
            21:'参与活动',
            24:'参与活动',
            22:'立即抢购'
        },
        listText:{
            23:'超值拼团',
            21:'助力登顶',
            24:'幸运抽奖',
            22:'限时秒杀'
        }
    },
    onLoad(options){
        let activeId = wx.getStorageSync('activity_type') || options.type || 0
        let url = getCurrentPages()[0].route
        let str = formatParam(getCurrentPages()[0].options)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)

        this.setData({
            activeId,
            redirectUrl,
        })
        this.getActivityType()
        
    },
    onShow(){
        
    },
    onReachBottom () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        if(this.data.activeId == -1){
            this.getMyJoin(this.contactList)
        }else{
            this.getList(this.contactList)
        }
      },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { activeId  } = this.data
        if(id == activeId ){
            return
        }
        let token = wx.getStorageSync('token')
        this.setData({
            isLogin:token ? true : false,
            activeId:id,
            page: 1,
            list: [],
            isLoading:false,
            isLast:false,
        })
        if(id == -1 && !token){
            this.setData({
                isLoading:true
            })
            return
        }
        if(id == -1){
            this.getMyJoin(this.contactList)
            return
        }
        this.getList(this.contactList)
    },
    getList(callback){
        const { activeId, page, count, redirectUrl, isLast  } = this.data
        if(isLast){
            return
        }
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.getactivitylist',
            store_id: wx.getStorageSync('store_id') || '',
            activity_cat:activeId || '',
            page:page,
            size:count
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
                let list = that.formatList(res)
                if (callback) callback(list)
                that.setData({
                    list:that.data.list,
                    isLoading:true
                })
                if(!res || !res.length){
                    that.setData({
                      isLast: true
                    })
                    return
                }
                // if (isLast(that.data.page, that.data.totalCount, that.data.count)) {
                //     that.setData({
                //       isLast: true
                //     })
                // }
            },
            fail(err){
                console.log('err',err)
            }
        })
    },
    //前往对应活动页面
    toActivityPage(e){
        const { activityType, activeId } = this.data
        const { aid, cid, uid, pid, storeid, start, status, pstatus } = e.currentTarget.dataset
        // if(!start){
        //     wx.showModal({
        //         title:'提示',
        //         content:'活动已结束',
        //         showCancel:false
        //     })
        //     return
        // }
        if(!wx.getStorageSync('token')){
            this.handle_login()
            return
        }
        let realUrl = ''
        let parameter = `?sid=${storeid}&aid=${aid}&cid=${cid}${cid == 23 && activeId == '-1' ? '&uid=' + uid + '&pid=' + pid : ''}${cid == 23 && (status == 3 || pstatus == 3) ? '&restInitGroup=1' : ''}`
        // 筛选数据
        let jumpPath = activityType.filter((item)=>{
            return item.id == cid
        })
        // realUrl = `${cid == 21 && (status == 2 || pstatus == 2 ) ? jumpPath[0].secondaryUrl : jumpPath[0].url}?sid=${storeid}&aid=${aid}&cid=${cid}`
        if(cid == 21 && (status == 2 || pstatus == 2 )){
            realUrl = jumpPath[0].secondaryUrl + parameter
        }else if(cid == 23 && (status || pstatus)){
            if( activeId == '-1' && (status || pstatus)){
                realUrl = jumpPath[0].secondaryUrl + parameter
            }else{
                realUrl = jumpPath[0].url + parameter
            }
        }else{
            realUrl = jumpPath[0].url + parameter
        }
        //特殊处理 存在二级页面 活动需要跳转真实页面 授权........
        if(jumpPath[0].url){
            wx.setStorageSync('activity_type', cid)
            wx.navigateTo({
                url: realUrl,
            })
        }
    },
    handle_login() {
        let redirectUrl = encodeURIComponent('/pages/activity/index')
        wx.navigateTo({
          url: `/pages/login/login?path=${redirectUrl}`,
        })
    },
    //处理list数据
    formatList(data,type){
        if(!data || !data.length){
            return []
        }
        data.forEach(item => {
            item.buying_price = accDiv(item.buying_price || item.seckill_price || 0,100)
            item.original_price = accDiv(item.original_price || 0,100)
            item.start_time = this.formatTime(item.start_time)
            item.end_time = this.formatTime(item.end_time)
            item.isInActivity =  moment().isBetween(item.start_time, item.end_time, 'seconds')
            item.activityIsOver = moment().isAfter(item.end_time, 'seconds')
            if(type){
                if(item.status == 1){
                    item.btnName = item.activity_cat_id == 24 ? '已参与' : '已购买'
                }else if(item.activity_cat_id == 21){
                    item.btnName = item.status == 2 ? '邀请助力' : '参与活动'
                }else if(item.activity_cat_id == 22){
                    item.btnName = item.status == 2 ? '已参与' : '立即抢购'
                }else if(item.activity_cat_id == 23){
                    item.btnName = item.status == 2 ? '已参与' : item.status  == 3 ? '重新发起' : '参与拼团'
                }else{
                    item.btnName = item.status == 2 ? '已参与' : '立即参与'
                }
            }else{
                if(item.participant_status == 1){
                    item.btnName = item.activity_cat_id == 24 ? '已参与' : '已购买'
                }else if(item.activity_cat_id == 21){
                    item.btnName = item.participant_status == 2 ? '邀请助力' : '参与活动'
                }else if(item.activity_cat_id == 22){
                    item.btnName = item.participant_status == 2 ? '已参与' : '立即抢购'
                }else if(item.activity_cat_id == 23){
                    item.btnName = item.participant_status  == 2 ? '已参与' : item.participant_status  == 3  ? '重新发起' : '参与拼团'
                }else{
                    item.btnName = item.participant_status == 2 ? '已参与' : '立即参与'
                }
            }
        });
        return data
    },
    //处理type数据
    formatTypeListData(list,type){
        let addData = [{
        id:0,
        name:'全部活动'
        }]

        list.forEach(item => {
        if(item.id == 1){
            item.activity_img = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/b31ae5f9337168b0be2a73b2efbfb87a.png'
        }
        if(item.id == 3){
            item.activity_img = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210722/e7e183b3fe5c143afe6d62affce3a434.png'
        }
        });
        if(type == 1){
            return list
        }

        list = [...addData,...list]
        return list 
    },
    //获取活动分类
    getActivityType() {
        const { redirectUrl } = this.data
        let url = app.globalData.baseUrl + api.activityData,
        that = this,
        store_id = wx.getStorageSync('store_id');
        let data = {
            method: 'activity.getactivitycat',
            store_id
        }
        let header = {},
        token = wx.getStorageSync('token');
        if (token) {
            header = {
                token
            }
        }
        request({
            url,
            data,
            header,
            isTologin:true,
            redirectUrl,
            method: 'POST',
            success: (res) => {
                // 对数据做一波处理 转盘和拼团暂时不存子
                that.setData({
                    activityList:that.formatTypeListData(res,2)
                })
                that.getList(this.contactList)
            }
        })
    },
    // 我参与的活动
    getMyJoin(callback){
        const { activeId, page, count, isLast, redirectUrl } = this.data
        if(isLast){
            return
        }
        let that = this
        let url = baseUrl + api.activityData
        let data = {
            method: 'activity.getjoinactivity',
            store_id: wx.getStorageSync('store_id') || '',
            page:page,
            size:count,
            activity_cat:'',
            
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
                // 后台改了数据结构 被迫处理 说实话 真的不想改 不合理
                let list = that.formatList(that.merageData(res),1)
                if (callback) callback(list)
                
                that.setData({
                    list:that.data.list,
                    // isLast:true
                    isLoading:true
                })
                if(!res || !res.length){
                    that.setData({
                      isLast: true
                    })
                    return
                }
                if(!res || !res.length){
                    that.setData({
                      isLast: true
                    })
                    return
                }
            },
            fail(err){
                console.log('err',err)
            }
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    formatTime(time){
        if(!time){
            return moment().format('YYYY/MM/DD HH:mm:ss')
        }
        return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
    },
    // 针对后台得数据调整被迫处理数据
    merageData(list){
        if(!list){
            return []
        }
        let restList = list.map(item=>{
            let obj = {...item.activity_detail,...item,activityId:item.activity_id || item.id}
            return obj
        })
        console.log('list___',restList)
        return restList
    },
    onShareAppMessage(e) {
        return {
            title: '活动列表',
            path: '/pages/activity/index',
            imageUrl:''
        }
    },
})