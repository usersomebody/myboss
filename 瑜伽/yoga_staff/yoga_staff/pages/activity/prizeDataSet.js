import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';
const { uploadImg } = api
const app = getApp()
Page({
    data:{
        prizes_list:[{
            name:'谢谢参与',
            icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220228/1445e81b2d1565e72edbc79523d0532f.png',
            number:'',
            prob:'',
            winning_type:2
        }],
        width:100,//宽度
        height: 100,//高度
        imgSrc:'',
        upyunFilePath:'',
        uploadIndex:0
    },
    onLoad(){
        this.setData({
            prizes_list:wx.getStorageSync('prizeData') || this.data.prizes_list
        })
        
    },
    getVal(e){
        const { index,type } = e.currentTarget.dataset
        const { prizes_list } = this.data
        prizes_list[index][type] = e.detail.value + ''
        this.setData({
            prizes_list,
        })
    },
    getValProb(e){
        const { index,type } = e.currentTarget.dataset
        const { prizes_list } = this.data
        // prizes_list[index][type] = e.detail.value + ''
        let allProd = 0
        prizes_list.forEach((element,idx) => {
            if(index != idx){
                allProd = parseInt(allProd) + parseInt(element.prob || 0)
            }
        });
        if(allProd + parseInt(e.detail.value || 0) <= 100){
            prizes_list[index][type] = e.detail.value + ''
        }else{
            prizes_list[index][type] = 100 - allProd >= 0 ? 100 - allProd : 0
        }
        this.setData({
            prizes_list,
        })
    },
    getImg(e) {
        const { index } = e.currentTarget.dataset
        let that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.upyunFilePath = res.tempFilePaths[0]
                that.setData({
                    imgSrc:that.data.upyunFilePath,
                    uploadIndex:index,
                })
                that.cropper = that.selectComponent("#image-cropper");
            }
        })
    },
    //获取到image-cropper实例
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log(e.detail);
    },
    effectiveImg(e){
        const { prizes_list, uploadIndex } = this.data
        let that = this
        wx.showLoading({
            title:'上传中'
        })
        this.cropper.getImg((obj) => {
            console.log('obj.url',obj.url)
            wx.uploadFile({
                url: baseUrl + uploadImg,
                filePath:obj.url,
                name:'image',
                formData:{
                    image:obj.url
                },
                success:(result)=>{
                    let imgInfo = JSON.parse(result.data)
                    if(result.statusCode == 200) {
                        that.data.upyunFilePath = imgInfo.content.url
                        prizes_list[uploadIndex].icon = imgInfo.content.url
                        that.setData({
                            imgSrc:'',
                            prizes_list
                        })
                        wx.hideLoading()
                    }
                }
            })
        });
    },
    cancleTailoring(){
        this.setData({
            imgSrc: ''
        })
    },
    deleteList(e){
        const { index } = e.currentTarget.dataset
        const { prizes_list } = this.data
        let list = prizes_list.filter((item,idx)=>{
            return index != idx
        })
        this.setData({
            prizes_list:list
        })
    },
    addData(){
        const { prizes_list } = this.data
        let obj = {
            name:'',
            icon:'',
            number:'',
            prob:'',
            winning_type:1
        }
        prizes_list.push(obj)
        this.setData({
            prizes_list
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    sure(){
        const { prizes_list } = this.data
        let validData = prizes_list.some((item)=>{
            return item.winning_type == 1 && (!item.name || !item.icon)
        })
        let allProd = 0
        for(let i=1;i<prizes_list.length;i+=1){
            allProd = allProd + parseInt(prizes_list[i].prob)
        }
        if(allProd == 100){
            prizes_list[0].prob = '0'
        }else if(allProd < 100){
            prizes_list[0].prob = 100 - allProd
        }
        this.setData({
            prizes_list
        })
        if(prizes_list.length < 3 || prizes_list.length > 8  || validData){
            wx.showModal({
                title:'设置奖品数量不能小于3个或者大于8个',
                showCancel:false,
            })
            return
        }
        wx.setStorageSync('prizeData',prizes_list)
        this.cancle()
    },
    
})