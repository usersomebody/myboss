
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { qaQuestionAnswer } = api

Page({
    data:{
        guideInfo:{}
    },
    onLoad(options){
        this.setData({
            guideInfo:app.globalData.guideInfo,
        })
    },
    previewImg(e){
        const { link } = e.currentTarget.dataset
        const { guideInfo } = this.data
        wx.previewImage({
            current: link, // 当前显示图片的http链接
            urls: guideInfo.content_imgs// 需要预览的图片http链接列表
        })
    }
})