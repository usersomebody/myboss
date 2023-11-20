import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getCardList } = api
Page({
    data:{
        page:1,
        limit:10,
        courseType:[{
            id:1,
            name:'期限卡'
        },{
            id:2,
            name:'次数卡'
        },{
            id:3,
            name:'储值卡'
        },{
            id:4,
            name:'计时卡'
        }],
        list:[],
        checkedId:1,
        isLast:false,
        totalCount:0,
        statusId:1,
        statusArr:[{
            id:1,
            name:'正常'
        },{
            id:2,
            name:'停用'
        }],
        statusName:'正常',
        statusShow:false,
        cardType:{
            1:{
                id:1,
                name:'期限卡',
                key:'---',
                color:'#c88707'
            },
            2:{
                id:2,
                name:'次数卡',
                key:'assets_num',
                color:'#5f82f1'
            },
            3:{
                id:3,
                name:'储值卡',
                key:'assets_money',
                color:'#df4b3e'
            },
            4:{
                id:4,
                name:'计时卡',
                key:'assets_time',
                color:'#8b8d9d'
                
            }
        },
    },
    onLoad(){
    },
    onShow(){
        this.setData({
            page:1,
            limit:10,
            totalCount:0,
            list:[],
            isLast: false
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
        const { checkedId, statusId, limit, page } = this.data
        request({
          url:baseUrl + getCardList,
          isTologin:true,
          data:{
            page:page,
            limit:limit,
            type:checkedId,
            status:statusId,
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
        const { id,type,sid } = e.currentTarget.dataset
        let url = `/pages/vip/addVipCard${type == 1 ? '' : '?id=' + id + '&sid=' + sid}`
        wx.navigateTo({
            url
        })
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { checkedId } = this.data
        if(id == checkedId){
            return
        }
        this.setData({
            checkedId:id,
            page:1,
            limit:10,
            totalCount:0,
            list:[],
            isLast: false
        })
        this.getCourseList(this.contactList)
    },
    getStatus(e){
        const { id, name } = e.currentTarget.dataset
        const { statusId } = this.data
        if(id == statusId){
            return
        }
        this.setData({
            statusId:id,
            statusName:name,
            page:1,
            limit:10,
            totalCount:0,
            list:[]
        })
        this.showStatus()
        this.getCourseList(this.contactList)
    },
    showStatus(){
        this.setData({
            statusShow:!this.data.statusShow
        })
    },
})