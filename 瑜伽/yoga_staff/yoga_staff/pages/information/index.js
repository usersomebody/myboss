import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { informationList  } = api
Page({
    data:{
        swiper:{
            indicatorDots: true,
            left:'40rpx',
            indicatorColor:'rgba(163,127,252,.3)',
            indicatorActiveColor:'#A37FFC'
        },
        banner:[
            "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/15dda1d745fe170c8ed1a6b3740f5f1b.jpg",
            "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/c71db80bc0abe5b0d437a1f72b48ad5c.jpg"
        ],
        page:1,
        infoList: [],
        limit:10,
        isLast:false,
        totalCount: 0,
        iPhonex:false
    },
    onLoad(){

    },
    onShow(){
        this.setData({
            page:1,
            infoList: [],
            isLast:false,
            totalCount: 0,
            iPhonex:app.globalData.isIphoneX || false,
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
    goDetail(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url: '/pages/information/detail?id=' + id
        })
    },
    //获取列表
    getList(callback){
        const { page, limit } = this.data
        request({
          url:  baseUrl + informationList,
          data: {
            key_word:'',
            page,
            limit,
          },
          method:'POST',
          success:res=> {
            console.log('res',res)
            if (callback) callback(res.list)
            console.log('this.data.infoList',this.data.infoList)
            this.setData({
                infoList: this.data.infoList,
                totalCount: res.count
            })
            if (isLast(page, this.data.totalCount, limit)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          },
        })
    },
    contactList(list) {
        this.data.infoList = this.data.infoList.concat(list)
    },
})