
import { api, baseUrl } from '../../utils/api.js'
import { formatParagraph, filterEOF } from '../../utils/common.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { qaQuestionAnswer } = api

Page({
    data:{
        qid:'',
        answer:{},
        contentList:[]
    },
    onLoad(options){
        this.setData({
            qid:options.id
        })
        this.getInfo()
    },
    getInfo(){
        const { qid } = this.data
        request({
            url:baseUrl + qaQuestionAnswer,
            data:{
                id:qid
            },
            method:'POST',
            isTologin:true,
            success: (res)=>{
                this.setData({
                    answer:res,
                    contentList:formatParagraph(filterEOF(res.content))
                })
            }
        })
    },
    previewImg(e){
        const { link } = e.currentTarget.dataset
        const { answer } = this.data
        wx.previewImage({
            current: link, // 当前显示图片的http链接
            urls: answer.content_imgs// 需要预览的图片http链接列表
        })
    }
})