import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { orderDetail, orderList, prizeWinList, activityWinInfo, verificationPrizeCode } = api

Page({
    data:{
        activityType:1,
        id:'',
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
            3:{
                name:'超值拼团',
                key:'seckill_price',
                priceName:'拼团价：'
            },
            4:{
                name:'幸运转盘',
                key:'',
                priceName:''
            }
        },
        orderData:[{
            type:'view_count',
            luckyType:'baseVisitData',
            title:'浏览人数',
            color:'#FFC33B',
            bg:'#FFC441',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/12e38e281b3ba7523c7fc78618e7f9cb.png',
            number:0
        },{
            type:'join_count',
            luckyType:'count',
            title:'参与人数',
            color:'#AB8AFF',
            bg:'#AB8AFF',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/1af0d4d76b7545e9215efa8734e34f4f.png',
            number:0
            
        },{
            type:'success_count',
            luckyType:'participantData',
            title:'成功人数',
            color:'#FF5453',
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/27247cdb12edee8c83ee7d0e57f312f3.png',
            bg:'#FF5453',
            number:0
        }],
        success_money:"",
        list:[],
        page:1,
        count:10,
        totalCount:0,
        activity_prize:[],
        loading:false,
        isLast:false,
        searchType:[{
            id:1,
            name:'昵称'
        },{
            id:2,
            name:'兑奖码'
        }],
        search_type:1,
        key_word:'',
        showOverlayer:false,
        showSearchType:false,
        reedmmNumber:'',
        numberInfo:{},
        showCovert:false,
        showPrizeList:false
    },
    onLoad(options){
        const { activityMap } = this.data
        this.setData({
            activityType:options.type,
            id:options.id
        })
        wx.setNavigationBarTitle({
            title:activityMap[options.type].name,
        })
    },
    onShow(){
        this.setData({
            page:1,
            list: [],
            isLast:false,
            totalCount: 0,
          })
        this.getList(this.contactList)
        if(this.data.activityType == 4){
            this.getLuckyDetail()
        }else{
            this.getDetail()
        }
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getList(this.contactList)
    },
    getList(callback){
        let that = this
        const { page, count, id, activityType, search_type, key_word } = this.data
        let link = activityType == 4 ? prizeWinList : orderList
        request({
          url:  baseUrl + link,
          data: {
            id,
            page,
            limit:count,
            search_type,
            key_word
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
            }
            that.setData({
              loading: false
            })
          },
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    getDetail(){
        let that = this
        const { id, orderData } = this.data
        request({
          url:  baseUrl + orderDetail,
          data: {
            id,

          },
          isTologin:true,
          method:'POST',
          success(res) {
            const { view_count, join_count, success_count, success_money } = res
            orderData.forEach(item => {
              item.number = res[item.type] 
            });
            that.setData({
                orderData,
                success_money
            })
          },
        })
    },
    getLuckyDetail(){
        let that = this
        const { id, orderData } = this.data
        request({
          url:  baseUrl + activityWinInfo,
          data: {
            id,

          },
          isTologin:true,
          method:'POST',
          success(res) {
            const { baseVisitData, count, participantData, activity_prize } = res
            orderData.forEach(item => {
              item.number = res[item.luckyType] 
            });
            activity_prize.forEach((item =>{
                item.name_copy = item.name.slice(0,6)
            }))
            that.setData({
                orderData,
                activity_prize,
            })
          },
        })
    },
    selectSearchType(e){
        const { type } = e.currentTarget.dataset
        this.setData({
            search_type:type,
            showSearchType:!this.data.showSearchType
        })
    },
    toggleSearchType(){
        this.setData({
            showSearchType:!this.data.showSearchType
        })
    },
    searchData(){
        this.setData({
            page:1,
            list: [],
            isLast:false,
            totalCount: 0,
          })
        this.getList(this.contactList)
    },
    getSearchVal(e){
        const { value } = e.detail
        this.setData({
            key_word:value
        })
    },
    getCovertNumber(e){
        const { value } = e.detail
        this.setData({
            reedmmNumber:value
        })
    },
    getInfo(e){
        const { name, number,id } = e.currentTarget.dataset
        let numberInfo = {
            id,
            name,
            number,
            showNumber:number.slice(0,6)
        }
        this.setData({
            numberInfo,
        })
        this.toggleCvertBox()
    },
    toggleCvertBox(){
        this.setData({
            showOverlayer:!this.data.showOverlayer,
            showCovert:!this.data.showCovert
        })
    },
    togglePrizeList(){
        this.setData({
            showPrizeList:!this.data.showPrizeList,
            showOverlayer:!this.data.showOverlayer
        })
    },
    checkNumber(){
        const { reedmmNumber, numberInfo } = this.data
        if(!reedmmNumber || (numberInfo.showNumber + reedmmNumber != numberInfo.number)){
            wx.showModal({
                title:'兑换失败',
                content:'抱歉，您兑奖码输入错误，请重试',
                confirmText:'知道了',
                showCancel:false,
            })
            this.toggleCvertBox()
            return
        }

        request({
          url:  baseUrl + verificationPrizeCode,
          data: {
            id:numberInfo.id,
            redeem_number:numberInfo.number
          },
          isTologin:true,
          method:'POST',
          success:()=> {
            wx.showToast({title:'兑奖成功'})
            this.toggleCvertBox()
            this.setData({
                page:1,
                list: [],
                isLast:false,
                totalCount: 0,
            })
            this.getList(this.contactList)
          },
        }).catch(()=>{
            this.toggleCvertBox()
        })
    }
})