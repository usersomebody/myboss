import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()

const { commentReplyList, commentReply, setCommentStatus, commentDel } = api
Page({
    data:{
        detail:{},
        replyList:[],
        fabulousType:{
            '-1':'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220212/adc7f3696ffcae3c4f0933255908b220.png',
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220212/7071a811d5a9e84b18e4ceb6bc4e4318.png'
        },
        showOverlayer:false,
        autoFocus:false,
        placeholderVal:'热情回复,文明用语',
        keyBoardHeight:'',
        content:"",
        recordId:'',
        page: 1,
        count: 20,
        totalCount: 0,
        loading:false,
        isLast:false,
    },
    onLoad(options){
        this.setData({
            recordId:options.caid,
            recordListId:options.caid,
            detail:wx.getStorageSync('comment-detail')[0]
        })
    },
    onShow(){
        this.setData({
            page:1,
            replyList: [],
            isLast:false,
            totalCount: 0,
        })
        this.getCommentList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getCommentList(this.contactList)
      },
    inputFocus(event){
        this.setData({
            keyBoardHeight:event.detail.height + ''
        })
    },
    showKeyBoard(e){
        const { type, rid, username } = e.currentTarget.dataset
        const { autoFocus, placeholderVal, recordId } = this.data
        this.setData({
            autoFocus:true,
            placeholderVal:type == 2 ? `回复${username}` : placeholderVal,
            recordId:rid || recordId
        })
        this.toggleLayer()
    },
    toggleLayer(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer
        })
    },
    getVal(e){
        this.setData({
            content: e.detail.value
          })
    },
    sendMsg(){
        const { recordId, content } = this.data
        request({
            url:baseUrl + commentReply,
            data:{
                id:recordId,
                user_id:wx.getStorageSync('user_id'),
                content:content,
            },
            isTologin:true,
            // redirectUrl,
            method: 'POST',
            success: (res) => {
                wx.showToast({title:'评论成功'})
                this.toggleLayer()
                this.setData({
                    page:1,
                    replyList: [],
                    isLast:false,
                    totalCount: 0,
                    content:''
                })
                this.getCommentList(this.contactList)
            }
        })
    },
    //获取列表
    getCommentList(callback){
        let that = this
        const { page, count, recordListId } = this.data
        let data = {
            id:recordListId,
            page,
            limit:count,
        }
        request({
          url:  baseUrl + commentReplyList,
          data: data,
          isTologin:true,
          method:'POST',
          success(res) {
            if (callback) callback(res.list)
            that.setData({
              replyList: that.data.replyList,
              totalCount: res.count
            })
            console.log('replyList',that.data.replyList)
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
        this.data.replyList = this.data.replyList.concat(list)
    },
    //置顶或者隐藏
    setTopHidden(e){
        const { id, isshow, type } = e.currentTarget.dataset
        wx.showModal({
            title:type == 1 ? "确认隐藏" : '确认删除',
            // content:'隐藏后其他用户将看不到这条评论',
            success:((res)=>{
                if(res.confirm){
                    if(type == 1){
                        this.showHidden(id, isshow)
                    }else{
                        this.deleteComment(id)
                    }
                }
            })
        })
    },
    showHidden(id, isshow){
        request({
            url:baseUrl + setCommentStatus,
            data:{
                id,
                is_show:isshow == 1 ? 2 : 1
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                wx.showToast({title:'设置成功'})
                this.setData({
                    page:1,
                    replyList: [],
                    isLast:false,
                    totalCount: 0,
                })
                this.getCommentList(this.contactList)
            })
        })
    },
    deleteComment(id){
        request({
            url:baseUrl + commentDel,
            data:{
                id,
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                wx.showToast({title:'删除成功'})
                this.setData({
                    page:1,
                    replyList: [],
                    isLast:false,
                    totalCount: 0,
                })
                this.getCommentList(this.contactList)
            })
        })
    }
})