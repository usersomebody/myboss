import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { information  } = api
const { baseUrl } = app.globalData

Page({
    data:{
        banner:[
            "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/15dda1d745fe170c8ed1a6b3740f5f1b.jpg",
            "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/c71db80bc0abe5b0d437a1f72b48ad5c.jpg"
        ],
        switchList:[{
            id:1,
            name:'全部',
        },{
            id:2,
            name:'热门',
        }],
        page:1,
        infoList: [],
        limit:10,
        isLast:false,
        totalCount: 0,
        switchId:1,
    },
    onLoad(){

    },
    onShow(){
        this.setData({
            page:1,
            infoList: [],
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
        const { id } = e.currentTarget.dataset
        console.log('id',id)
        if(id == this.data.switchId){
            return
        }
        this.setData({
            switchId:id,
            page:1,
            infoList: [],
            isLast:false,
            totalCount: 0,
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
        const { page, limit, switchId } = this.data
        wx.request({
          url:  baseUrl + information,
          data: {
            store_id: wx.getStorageSync('store_id'),
            page,
            size:limit,
            type:switchId,
            method:'notice.list'
          },
          method:'POST',
          success:res=> {
            if (callback) callback(res.data.data)
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
        let data = list.map((item)=>{
            let obj = item
            obj.update_time = item.update_time.split(' ')[0]
            obj.read_num = item.vm_page_view + item.page_view
            return obj 
        })
        this.data.infoList = this.data.infoList.concat(data)
    },
})