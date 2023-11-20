import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv, accMul } from '../../utils/common.js'
import { api } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { baseUrl }  = app.globalData
const { announce } = api
Page({
    data:{
        page:1,
        limit:10,
        list:[],
        isLast:false,
        totalCount:0,
        statusMap:{
            2:{
                name:'已定时',
                color:'#FA9552'
            },
            1:{
                name:'已推送',
                color:'#9B77F4'
            }
        },
        lineNum:''
    },
    onLoad(){
        let sWidth = app.globalData.screenWidth 
        let contentWidth = parseInt(accMul(accMul(sWidth,0.92),0.88))
        let textNum = Math.ceil(accDiv(contentWidth,14))
        this.setData({
            lineNum:textNum
        })
    },
    onShow(){
        this.setData({
            list:[],
            page:1,
            limit:10,
            isLast:false,
            totalCount:0
        })
        this.getAnnounceList()
        // this.getCourseList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        // this.getCourseList(this.contactList)
    },
    getCourseList(callback) {
        const { limit, page } = this.data
        request({
          url:baseUrl + announceList,
          isTologin:true,
          data:{
            page,
            limit,
          },
          method: 'POST',
          success: (res => {
            if (callback) callback(res.list)
            this.setData({
              list: this.data.list,
              totalCount: res.count
            })
            if (isLast(this.data.page, this.data.totalCount, this.data.limit)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          })
        })
    },
      // 公告列表
    getAnnounceList(){
     request({
            url:  baseUrl + announce,
            data: {
                store_id: wx.getStorageSync('store_id'),
                page:1,
                size:100,
                method:'user.announcelist'
            },
            method:'POST',
            success:res=> {
                const { lineNum } = this.data
                res.forEach(item => {
                    item.ellipsisShow = item.content.length > accMul(lineNum,2) && true
                    item.ellipsisInit = item.content.length % accMul(lineNum,2) == 0
                    item.remainder = parseInt(item.content.length / accMul(lineNum,2)) >= 1
                    item.showContent = item.content.length > accMul(lineNum,2) ? item.content.slice(0,accMul(lineNum,2) - 2) + '...' : item.content
                    item.showBtn = item.content.length > accMul(lineNum,2) ? true : false
                });
                this.setData({
                    list: res,
                })
            },
        })
    },
    contactList(list) {
      
        this.data.list = this.data.list.concat(list)
    },
    goDetail(e){
        const { id } = e.currentTarget.dataset
        let url = id ? '/pages/baseConfig/noticeManager?id=' + id : '/pages/baseConfig/noticeManager'
        wx.navigateTo({
            url: url,
        })
    },
    showAllContent(e){
        const { id } = e.currentTarget.dataset
        const { list } = this.data
        list.forEach(item => {
            item.showBtn = id == item.id ? !item.showBtn : item.showBtn
        });
        this.setData({
            list,
        })
    }
})