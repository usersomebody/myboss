import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { activityList, setEnd } = api

Page({
    data:{
        page:1,
        count:10,
        totalCount:0,
        loading:false,
        isLast:false,
        switchList:[{
            id:1,
            name:'进行中'
        },{
            id:2,
            name:'未开始'
        },{
            id:3,
            name:'已过期'
        }],
        checkedId:1,
        list:[],
        page:1,
        count:10,
        totalCount:0,
        activityType:1,
        activityMap:{
            1:{
                name:'助力登顶',
                key:'buying_price',
                priceName:'助力价：'
            },
            2:{
                name:'限时秒杀',
                key:'seckill_price',
                priceName:'秒杀价：'
            },
            4:{
                name:'幸运转盘',
                key:'draw_price',
                priceName:''
            }
        },
        activityCover:"",
        addActivityIcon:{
            1:{
                name:'助力登顶',
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211101/54888f0c1c0c45e7791e2dbdff86ea9a.png',
                link:'/pages/activity/help?isAction=2'
            },
            2:{
                name:'限时秒杀',
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211101/54888f0c1c0c45e7791e2dbdff86ea9a.png',
                link:'/pages/activity/secondsKill?isAction=2'
            },
            4:{
                name:'幸运转盘',
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211101/54888f0c1c0c45e7791e2dbdff86ea9a.png',
                link:'/pages/activity/luckyDraw?isAction=2'
            }
        }
    },
    onLoad(options){
        this.setData({
            activityType:options.type
        })
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        })
    },  
    onShow(){
        wx.removeStorageSync('prizeData')
        wx.removeStorageSync('fictitious')
        this.setData({
            page:1,
            list: [],
            isLast:false,
            totalCount: 0,
          })
        this.getList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getList(this.contactList)
    },
    switchTab(e){
        const { checkedId } = this.data
        const { id } = e.currentTarget.dataset
        if(checkedId == id){
            return
        }
        this.setData({
            list:[],
            page:1,
            checkedId:id,
            isLast:false,
        })
        this.getList(this.contactList)
    },
    getList(callback){
        let that = this
        const { page, count, checkedId, activityType } = this.data
        request({
          url:  baseUrl + activityList,
          data: {
            type:activityType,
            status:checkedId,
            page,
            limit:count,
          },
          isTologin:true,
          method:'POST',
          success(res) {
            if (callback) callback(res.list)
            that.setData({
              list: that.data.list,
              totalCount: res.count
            })
            if (isLast(page, that.data.totalCount, count)) {
              that.setData({
                isLast: true
              })
            }else{
                that.setData({
                    isLast: false
                })
            }
            that.setData({
              loading: false
            })
          },
        }).catch((err)=>{
            that.setData({
                isLast: true
            })
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    share(e){
        const { id, cover } = e.currentTarget.dataset
        this.cover = cover
        this.setData({
            activityCover:cover
        })
    },
    goOrderDetail(e){
        const { id } = e.currentTarget.dataset
        const { activityType } = this.data
        wx.navigateTo({
            url:`/pages/activity/orderDetail?id=${id}&type=${activityType}`
        })
    },
    gotoActivity(e){
        const { item } = e.currentTarget.dataset
        const { activityType, checkedId } = this.data
        let activityList = {
            1:`/pages/activity/help?id=${item.id}&type=${activityType}&isAction=${checkedId}`,
            2:`/pages/activity/secondsKill?id=${item.id}&type=${activityType}&isAction=${checkedId}`,
            4:`/pages/activity/luckyDraw?id=${item.id}&type=${activityType}&isAction=${checkedId}`
        }
        wx.setStorageSync('activityInfo',item)
        wx.navigateTo({
            url:activityList[activityType]
        })
    },
    setEnd(e){
        const { id } = e.currentTarget.dataset
        const { checkedId } = this.data
        wx.showModal({
            title:checkedId != 3 ? '确认结束活动' : '确认恢复活动',
            success:(res)=>{
                if(res.confirm){
                    request({
                        url:  baseUrl + setEnd,
                        data: {
                          id,
                          is_end:checkedId != 3 ? 1 : 9
                        },
                        isTologin:true,
                        method:'POST',
                        success:()=> {
                          this.setData({
                              page:1,
                              list: [],
                              isLast:false,
                              totalCount: 0,
                          })
                          this.getList(this.contactList)
                        },
                    })
                }
            }
        })
        
    },
    onShareAppMessage(){
        const {activityType, activityMap, activityCover} = this.data
        const promise = new Promise(resolve => {
            setTimeout(() => {
              resolve({
                title: activityMap[activityType].name,
                imageUrl:this.cover 
              })
            }, 500)
        })
        return {
            title: activityMap[activityType].name,
            imageUrl:this.cover,
            path: '/pages/activity/drawList?type=' + activityType,
            promise 
          }
    },
})