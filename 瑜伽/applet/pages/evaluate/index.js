// pages/courseBooking/courseBooking.js
import  moment  from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api } from '../../utils/api.js'
const app = getApp();
Page({
    data:{
        storeId:'',
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
        recordListId:''
    },
    onLoad(options){
        this.setData({
            storeId:options.store_id,
            recordId:options.caid,
            recordListId:options.caid,
            detail:wx.getStorageSync('comment-detail')[0],
            user_id:wx.getStorageSync('user_id')
        })
        this.getCommentList()
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
        const { storeId, recordId, content } = this.data
        console.log('recordId',recordId)
        let header = {},
          token = wx.getStorageSync('token');
        if (token) {
          header = {
            token
          }
        }
        request({
            url:app.globalData.baseUrl + '/applet/comment',
            data:{
                method: 'comment.reply',
                id:recordId,
                user_id:wx.getStorageSync('user_id'),
                content:content,
                store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
            },
            header,
            isTologin:true,
            // redirectUrl,
            method: 'POST',
            success: (res) => {
                wx.showToast({title:'评论成功'})
                this.setData({
                    content:''
                  })
                this.toggleLayer()
                this.getCommentList()
            }
        })
    },
    // 点赞
    isLike(e){
        const { storeId } = this.data
        const { id, islike } = e.currentTarget.dataset
        console.log({id, islike})
        let header = {},
          token = wx.getStorageSync('token');
        if (token) {
          header = {
            token
          }
        }
        request({
            url:app.globalData.baseUrl + '/applet/comment',
            data:{
                method: 'comment.star',
                id,
                type:islike == '-1' ? 1 : 2,
                store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
            },
            header,
            isTologin:true,
            // redirectUrl,
            method: 'POST',
            success: (res) => {
                this.getCommentList()
            }
        })
    },
    //获取列表
    getCommentList(){
        const { storeId, submitData, satisfiedLabel,recordListId } = this.data
        let header = {},
          token = wx.getStorageSync('token');
        if (token) {
          header = {
            token
          }
        }
        request({
            url:app.globalData.baseUrl + '/applet/comment',
            data:{
                method: 'comment.replylist',
                id:recordListId,
                store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
            },
            header,
            // isTologin:true,
            // redirectUrl,
            method: 'POST',
            success: (res) => {
                res.forEach(element => {
                    element.deleteShow = false
                    if(element.reply_list){
                        element.reply_list.forEach((item)=>{
                            item.deleteShow = false
                        })
                    }
                });
              this.setData({
                replyList:res
              })
            }
        })
    },
    showDeleteIcon(e){
        const { id } = e.currentTarget.dataset
        const { replyList } = this.data 
        replyList.forEach(element => {
            if(element.id == id ){
                element.deleteShow = !element.deleteShow
            }
            if(element.reply_list){
                element.reply_list.forEach((item)=>{
                    if(item.id == id){
                        item.deleteShow = !item.deleteShow 
                    }
                })
            }
            
        });
        this.setData({
            replyList
        })
    },
    deleteReply(e){
        const { id } = e.currentTarget.dataset
        const { storeId } = this.data
        let header = {},
          token = wx.getStorageSync('token');
        if (token) {
          header = {
            token
          }
        }
        wx.showModal({
            title:'确认删除',
            content:'删除后评论将不可恢复',
            success:(res)=>{
                if(res.confirm){
                    request({
                        url:app.globalData.baseUrl + '/applet/comment',
                        data:{
                            method: 'comment.del',
                            id,
                            store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                        },
                        header,
                        isTologin:true,
                        // redirectUrl,
                        method: 'POST',
                        success: (res) => {
                            this.setData({
                                replyList:[]
                            })
                            this.getCommentList()
                        }
                    })
                }
            }
        })
    }
})