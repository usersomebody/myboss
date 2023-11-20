import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { memberList } = api
Page({
    data:{
        page:1,
        limit:10,
        list:[],
        isLast:false,
        totalCount:0,
    },
    onLoad(){
    },
    onShow(){
        wx.removeStorageSync('checkStoreIds')
        wx.removeStorageSync('checkStoreNames')
        this.setData({
            list:[],
            page:1,
            limit:10,
            isLast:false,
            totalCount:0
        })
        this.getCourseList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getCourseList(this.contactList)
    },
    getCourseList(callback) {
        const { limit, page } = this.data
        request({
          url:baseUrl + memberList,
          isTologin:true,
          data:{
            course_type_ids:'1',
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
        }).catch((err)=>{
            this.setData({
                isLast: true
              })
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    goDetail(e){
        const { id, sid } = e.currentTarget.dataset
        let storeId = wx.getStorageSync('store_id')
        let url = id ? `/pages/member/addMember?id=${id}&action=${storeId == sid ? '1' : '2'}` : '/pages/member/addMember'
        wx.navigateTo({
            url: url,
        })
    },
})