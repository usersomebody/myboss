import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()

const { commentList, setCommentStatus } = api
Page({
    data:{
        submitData:{},
        page: 1,
        count: 20,
        totalCount: 0,
        loading:false,
        isLast:false,
        satisfy:{
            1:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220217/b61740693d3c85c5ab42802cc98d65e4.png",
            2:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220217/3b682e29187ba09236cba0d2db9937fe.png"
        }
    },
    onShow(){
        this.setData({
            submitData:app.globalData.submitComment || {},
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
    goScreen(){
        wx.navigateTo({
            url: '/pages/comment/screen'
        })
    },
    delete(e){
        const { type } = e.currentTarget.dataset
        const { submitData } = this.data
        let screenList = submitData.showScreenList.filter((item)=>{
            return item.screenType != type
        })
        let data = {
            start_time:submitData.start_time,
            end_time:submitData.end_time,
            course_id:this.getSubmitId('course',screenList),
            coach_staff_id:this.getSubmitId('coach_staff_id',screenList),
            star:this.getSubmitId('star',screenList),
            content:this.getSubmitId('content',screenList),
            showScreenList:screenList
        }
        app.globalData.submitComment = data
        this.setData({
            submitData:data,
            page:1,
            list: [],
            isLast:false,
            totalCount: 0,
        })
        this.getList(this.contactList)
    },
    getSubmitId(type,list){
        if(!list || !list.length){
            return type == 'content' ? '' : 0
        }
        let validData = list.filter((item)=>{
            return item.screenType == type
        })
        if(validData.length){
            return validData[0].id
        }
        return type == 'content' ? '' : 0
    },
    getList(callback){
        let that = this
        const { page, count, submitData } = this.data
        let data = {
            start_time:submitData.start_time,
            end_time:submitData.end_time,
            course_id:this.getSubmitId('course',submitData.showScreenList),
            coach_staff_id:this.getSubmitId('coach_staff_id',submitData.showScreenList),
            star:this.getSubmitId('star',submitData.showScreenList),
            content:this.getSubmitId('content',submitData.showScreenList),
            page,
            limit:count,
        }
        request({
          url:  baseUrl + commentList,
          data: data,
          isTologin:true,
          method:'POST',
          success(res) {
            if (callback) callback(res.list)
            that.setData({
              list: that.data.list,
              totalCount: res.count
            })
            // <!-- card_type_name 状态 1成功 2取消 3完成(表示正常上课) 4未上课 5开课失败 6 排队中 7 排队失败 -->
            
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
    //置顶或者隐藏
    setTopHidden(e){
        const { type, isshow, istop, id } = e.currentTarget.dataset
        if(type == 1){
            wx.showModal({
                title:isshow == 1 ? "确认隐藏" : '取消隐藏',
                // content:'隐藏后其他用户将看不到这条评论',
                success:((res)=>{
                    if(res.confirm){
                        this.showTop(type, isshow, istop, id)
                    }
                })
            })
            return
        }
        this.showTop(type, isshow, istop, id)
    },
    // 显示 置顶
    showTop(type,isshow,istop,id){
        request({
            url:baseUrl + setCommentStatus,
            data:{
                id,
                is_show:type == 1 ? isshow == 1 ? 2 : 1 : isshow,
                is_top:type == 2 ? istop == 1 ? 2 : 1 : istop
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                wx.showToast({title:'设置成功'})
                this.setData({
                    page:1,
                    list: [],
                    isLast:false,
                    totalCount: 0,
                })
                this.getList(this.contactList)
            })
        })
    },
    goCommentDetail(e){
        const { id } = e.currentTarget.dataset
        const { list } = this.data
        let storageData = list.filter((item)=>{
            return item.id == id
        })
        wx.setStorageSync('comment-detail', storageData)
        wx.navigateTo({
            url: '/pages/comment/detail?caid=' + id
        })
    }
})