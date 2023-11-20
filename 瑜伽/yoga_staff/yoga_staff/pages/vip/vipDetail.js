import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { setStar, userDetail, bookingDetailList, vipCardList, deleteCard, leaveEnd, operaCard, getRecordList } = api
// setStar:'/venue/user.user/setUserStar',//星标会员
// userDetail:'/venue/user.user/userDetail',//用户信息
// bookingDetailList:'/venue/user.user/getAllSubscribeCourse',//预约详情列表
// vipCardList:'/venue/user.UserCard/getUserAllCard',//用户会员卡
// 3续卡(记录明细) 4延卡(记录明细) 5赠送(记录明细) 6停卡(手动恢复有差值的需记录明细) 7恢复 8扣卡(记录明细) 9请假
Page({
    data:{
        isLast:false,
        loading:false,
        totalCount: 0,
        vipId:'',
        page: 1,
        count: 20,
        userInfo:{},
        typeName:{
            1:'团课',
            2:'小班课',
            3:'精品课',
            4:'私教课'
        },
        status:{
            3:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/635da73c11581a8c3e600e50bb0e1622.png',
            2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220311/26a74d949d1dc24622f49d27fe7c4f95.png',
            4:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/275b7bd94372890108e5de24fba334ce.png',
            5:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/9d97d1e220a75ff4a0ace43d1ec49047.png'
        },
        switchList:[{
            id:1,
            name:'会员卡'
        },{
            id:2,
            name:'预约课程'
        },{
            id:3,
            name:'卡管理'
        },{
            id:4,
            name:'体测数据'
        }],
        switchId:1,
        cardList:[],
        bookingList:[],
        cardType:{
            1:{
                name:'剩余天数:',
                key:'day',
                symbol:'天',
                type:'期限卡',
                sale:'consume_days',
                color:'#c88707'
            },
            2:{
                name:'剩余次数:',
                key:'assets_num',
                symbol:'次',
                type:'次数卡',
                sale:"consume_num",
                color:'#5f82f1'
            },
            3:{
                name:'剩余金额:',
                key:'assets_money',
                symbol:'元',
                type:'储值卡',
                sale:'consume_price',
                color:'#df4b3e'
            },
            4:{
                name:'剩余时间:',
                key:'assets_time',
                symbol:'分钟',
                type:'计时卡',
                sale:'consume_time',
                color:'#8b8d9d'
            }
        },
        // 状态 1正常 2禁用 3停卡 4已失效 5未开卡
        statusMap:{
            1:{
                name:"正常",
                color:'#FF9D00'
            },
            2:{
                name:"禁用",
                color:'#E83926'
            },
            3:{
                name:"停卡",
                color:'#E83926'
            },
            4:{
                name:"已失效",
                color:'#999999'
            },
            5:{
                name:"未开卡",
                color:'#E83926'
            }
        },
        operationList:[{
            id:9,
            name:'请假',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/0ee72485a086f0019d5cfec432b2bad5.png'
        },{
            id:6,
            name:'停卡',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/1150da45b8fadc904f06b1644403a2c5.png'
        },{
            id:5,
            name:'赠送',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/d2b9a2553bf0adfd6b1cc6a2ef0d9cc6.png'
        },{
            id:4,
            name:'延卡',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/968ded8c91a82e5e74648c1cd9694f02.png'
        },{
            id:8,
            name:'扣卡',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/6b66a2dbec34ec005d2ae26177185158.png'
        },{
            id:3,
            name:'续卡',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211214/e8581bb50a66339efb38146a1c2bb2e7.png'
        }],
        vipType:1,
        bodyDataList:[],
        showOverlayer:false
    },
    onLoad(options){
        this.setData({
            vipId:options.id,
            vipType:options.type
        })
        this.getBookingList(this.contactList)
    },
    onShow(){
        this.getUserDetail()
        this.getCardList()
    },
    onReachBottom() {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        console.log('res','触发')
        this.getBookingList(this.contactList)
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { switchId } = this.data
        if(switchId == id){
            return
        }
        this.setData({
            switchId:id,
            page:1,
            bookingList:[]
        })
        if(id == 1){
            this.getCardList()
            return
        }
        if(id == 2){
            this.getBookingList(this.contactList)
            return            
        }

        if(id == 4){
            this.getRecordList()
            return            
        }
    },
    //拉取会员卡数据
    getCardList(){
        // vipCardList
        const { vipId, vipType } = this.data
        request({
          url:baseUrl + vipCardList,
          data:{
              id:vipId,
              type:vipType
          },
          method: 'POST',
          isTologin: true,
          success: (res => {
              this.setData({
                cardList:res,
              })
          })
        })
    },
    //拉取预约数据
    getBookingList(callback){
        // bookingDetailList
        const { vipId,page,count, vipType } = this.data
        request({
          url:baseUrl + bookingDetailList,
          data:{
              id:vipId,
              page:page,
              limit:count,
              type:vipType
            },
          method: 'POST',
          isTologin: true,
          success: (res => {
            console.log('res',res)
            if (callback) callback(res.list)
            this.setData({
              bookingList: this.data.bookingList,
              totalCount: res.count
            })
            
            if (isLast(page, this.data.totalCount, count)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          }),
        }).catch((err)=>{
            console.log('err',err)
            this.setData({
                isLast: true
            })
        })
    },
    //会员信息
    getUserDetail(){
        // userDetail
        const { vipId, vipType } = this.data
        request({
          url:baseUrl + userDetail,
          data:{
              id:vipId,
              type:vipType
          },
          method: 'POST',
          isTologin: true,
          success: (res => {
            wx.setStorageSync('vipInfo', res)
            this.setData({
                userInfo:res
            })
            this.getRecordList()
          })
        })
    },
    // 设为星标会员
    settingUserStar(){
        const { vipId, userInfo, vipType } = this.data
        let star = 1
        if(userInfo.is_star && userInfo.is_star == 1){
            star = 2
        }
        request({
          url:baseUrl + setStar,
          data:{
              id:vipId,
              is_star:star,//1设置星标2取消星标
              type:vipType
          },
          method: 'POST',
          isTologin: true,
          success: (res => {
            wx.showModal({
                title:star == 1 ? '设置成功' : '取消成功',
                showCancel: false,
            })
            this.getUserDetail()
          })
        })
    },
    addCard(){
        const { vipId, vipType } = this.data
        wx.navigateTo({
          url: '/pages/vip/giveVipCard?id=' + vipId + '&vipType=' + vipType,
        })
    },
    checkCardInfo(e){
        const { item } = e.currentTarget.dataset
        wx.setStorageSync('vip_card_info', item)
        wx.navigateTo({
            url: '/pages/vip/userCardDetail',
        })
    },
    contactList(list) {
        this.data.bookingList = this.data.bookingList.concat(list)
    },
    userDetail(){
        const { vipId, vipType } = this.data 
        wx.navigateTo({
            url: '/pages/vip/vipUserDetail?id=' + vipId + '&type=' + vipType
        })
    },
    cardOperation(e){
        const { vipId, vipType, userInfo } = this.data 
        const { type } = e.currentTarget.dataset
        if(userInfo.status == 9){
            wx.showModal({
                title:'提示',
                content:'该会员未绑定小程序，请绑定后再进行卡操作',
                showCancel:false
            })
            return
        }
        wx.navigateTo({
            url: '/pages/vip/cardAction?id=' + vipId + '&type=' + type
        })
    },

    delCard(e){
        const { vipId } = this.data
        const { id } = e.currentTarget.dataset
        wx.showModal({
            title:'确认删除',
            success:(res)=>{
                if(res.confirm){
                    // 删除
                    request({
                        url:baseUrl + deleteCard,
                        data:{
                            id,
                        },
                        method: 'POST',
                        isTologin: true,
                        success: (res => {
                        wx.showModal({
                            title:'删除成功',
                            showCancel: false,
                        })
                        this.setData({
                            page:1,
                            bookingList:[],
                            isLast:false
                        })
                        this.getCardList()
                        })
                    })
                }
            }
        })
        
    },
    leaveOver(e){
        const { id } = e.currentTarget.dataset
        // 请假结束
        request({
            url:baseUrl + leaveEnd,
            data:{
                id,
            },
            method: 'POST',
            isTologin: true,
            success: (res => {
              wx.showModal({
                  title:'结束成功',
                  showCancel: false,
              })
              this.setData({
                page:1,
                bookingList:[],
                isLast:false
            })
            this.getCardList()
            })
          })
    },
    relieve(e){
        const { id } = e.currentTarget.dataset
        const { vipType } = this.data
        // 解除停卡
        request({
            url:baseUrl + operaCard,
            data:{
                id,
                type:7
            },
            method: 'POST',
            isTologin: true,
            success: (res => {
              wx.showModal({
                  title:'解除成功',
                  showCancel: false,
              })
              this.setData({
                page:1,
                bookingList:[],
                isLast:false
              })
              this.getCardList()
            })
          })
    },
    addRecord(){
        const { vipId, vipType, userInfo } = this.data
        if(!userInfo.unionid || userInfo.status == 9){
            wx.showModal({
                title:'提示',
                content:'该会员未绑定小程序，请绑定后再添加体测数据',
                showCancel:false
            })
            return
        }
        wx.navigateTo({
            url: `/pages/vip/addBodyData?id=${vipId}&type=${vipType}&phone=${userInfo.phone}&name=${userInfo.name}`
        })
    },
    toggleBox(){
        const { showOverlayer, userInfo } = this.data
        if(!userInfo.unionid || userInfo.status == 9){
            wx.showModal({
                title:'提示',
                content:'该会员未绑定小程序，请绑定后再添加体测数据',
                showCancel:false
            })
            return
        }
        this.setData({
            showOverlayer:!showOverlayer
        })
    },
    next(e){
        const { vipId, vipType, userInfo } = this.data
        const { type } = e.currentTarget.dataset
        let url = `/pages/vip/bodyDataCompare?id=${vipId}&type=${vipType}&ctype=${type}&phone=${userInfo.phone}&name=${userInfo.name}`
        wx.navigateTo({
            url: url
        })
    },
    getRecordList(){
        const { vipId, vipType, userInfo } = this.data
        request({
            url:baseUrl + getRecordList,
            data:{
                phone:userInfo.phone,
                type:vipType
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    bodyDataList:res
                })
            }
        })
    },
    checkBodyDetail(e){
        const { vipId, vipType, userInfo } = this.data
        const { id } = e.currentTarget.dataset
        let url = `/pages/vip/editBodyData?rid=${id}&type=${vipType}&phone=${userInfo.phone}&name=${userInfo.name}`
        wx.navigateTo({
            url: url
        })
    },
    goIntegral(){
        const { vipType, userInfo } = this.data
        let url = `/pages/integral/index?type=${vipType}&phone=${userInfo.phone}`
        wx.navigateTo({
            url: url
        })
    }
})