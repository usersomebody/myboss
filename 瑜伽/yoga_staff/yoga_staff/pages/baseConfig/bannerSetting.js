import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';

const app = getApp()
const { uploadImg, picIndex, picIndexEdit } = api
Page({
    data:{
        alyunFilePath:[],
        imgFileList:[]
    },
    onLoad(){
        this.getCover()
    },
    getCover(){
        let that = this
        request({
            url:  baseUrl + picIndex,
            data: {},
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                    alyunFilePath:res.facade_img
                })
            },
          })
    },
    getImgs() {
        let that = this
        wx.chooseImage({
            count:9 - that.data.imgFileList.length, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.imgFileList = that.data.imgFileList.concat(res.tempFilePaths)
                that.setData({
                    imgFileList: that.data.imgFileList,
                })
                wx.uploadFile({
                    url: baseUrl + uploadImg,
                    filePath:res.tempFilePaths[0],
                    name:'image',
                    formData:{
                        image:res.tempFilePaths
                    },
                    success: function(res){
                        let imgInfo = JSON.parse(res.data)
                        if(res.statusCode == 200) {
                            that.data.alyunFilePath.push(imgInfo.content.url)
                            that.setData({
                                alyunFilePath:that.data.alyunFilePath
                            })
                        }
                    },
                })
            }
        })

    },
    delImg(e) {
        let idx = e.currentTarget.dataset.idx
        this.data.alyunFilePath.splice(idx, 1)
        this.setData({
            alyunFilePath: this.data.alyunFilePath
        })
    },
    back(){
        wx.navigateBack({
            delta: 1
        })
    },
    submit(){
        let that = this
        const { alyunFilePath } = this.data
        request({
            url:  baseUrl + picIndexEdit,
            data: {
                facade_img:alyunFilePath
            },
            isTologin:true,
            method:'POST',
            success(res) {
                wx.showModal({
                    title:'修改成功',
                    showCancel:false,
                    success:()=>{
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            },
          })
    },
    handlePreview(e){
        console.log('e_____',e)
        let index = e.target.dataset.idx;
        let images = this.data.alyunFilePath
        wx.previewImage({
          current: images[index], //当前预览的图片
          urls: images, //所有要预览的图片数组
        })
      },
})