import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
// import { posterData } from './posterData.js'
const app = getApp()
const { uploadImg, setQr, getDiyInfo } = api
Page({
    data:{
        showList:[{
                id:1,
                name:'二维码类型',
                placeholder:'',
                key:'qr_type',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false
            },{
                id:2,
                name:'二维码名称',
                placeholder:'建议与二维码识别后名称一致',
                key:'qr_name',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:3,
                name:'操作引导',
                placeholder:'',
                key:'guide',
                selectId:'',
                value:'长按保存，打开微信扫一扫加好友',
                isHandle:false,
                inputBox:true
            },
            {
                id:4,
                name:'二维码上传',
                placeholder:'上传二维码',
                key:'qr_img',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false
            },
        ],
        width:128,//宽度
        height: 128,//高度
        upyunFilePath:'',
        imgSrc:'',
        posterBg:'',
        posterInfo:{},
        storeInfo:{
            qr_name:'',
            guide:'',
            qr_img:'',
            qr_type:1,
            qr_merge_img:''
        },
        region:[{
            name:'企业二维码',
            info:'长按保存，打开微信扫一扫加好友'
        },{
            name:'个人二维码',
            info:'长按识别，点击添加好友'
        },{
            name:'群二维码',
            info:'长按保存，打开微信扫一扫加好友'
        }]
    },
    onLoad(){
        this.getStoreInfo()
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showList, storeInfo } = this.data
        showList.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        storeInfo[key] = value
        this.setData({
            showList, 
            storeInfo
        })
    },
    getImg() {
        let that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.upyunFilePath = res.tempFilePaths[0]
                that.setData({
                    imgSrc:that.data.upyunFilePath
                })
                that.cropper = that.selectComponent("#image-cropper");
            }
        })
    },
    effectiveImg(){
        const { storeInfo } = this.data
        let that = this
        wx.showLoading({
            title:'上传中'
        })
        this.cropper.getImg((obj) => {
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
                        that.data.showList[3].value = that.data.upyunFilePath
                        storeInfo.qr_img = imgInfo.content.url
                        that.setData({
                            showList:that.data.showList,
                            imgSrc:'',
                            storeInfo
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
    sure(e){
        const { storeInfo, posterInfo  } = this.data
        const { type } = e.target.dataset
        if(type == 1){
            wx.navigateBack({
                delta: 1,
            })
            return
        }
        if(this.checkDataValid()){
            return
        }
        this.uploadPosterPicture(posterInfo.cover).then((url)=>{
            this.setQrCode(url)
        })
    },
    bindRegionChange(e) {
        const { storeInfo, region, showList } = this.data
        showList[0].value = Number(e.detail.value) + 1
        showList[1].value = region[e.detail.value].name
        showList[2].value = region[e.detail.value].info
        storeInfo['qr_type'] = Number(e.detail.value) + 1
        storeInfo['qr_name'] = region[e.detail.value].name
        storeInfo['guide'] = region[e.detail.value].info
        this.setData({
          storeInfo,
          showList,
        })
    },
    checkDataValid(){
        const { storeInfo } = this.data
        for(let key in storeInfo){
            if(!storeInfo[key]){
                wx.showModal({
                    title:'请完善信息'
                })
                return true
            }
        }
        console.log('完善数据')
        return false
    },
    setQrCode(url){
        const { storeInfo } = this.data
        let submit = storeInfo
        submit.qr_merge_img = url
        request({
            url:  baseUrl + setQr,
            data: submit,
            isTologin:true,
            method:'POST',
            success:res=> {
                wx.showModal({
                    title:'保存成功',
                    showCancel:false,
                    success(){
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                })
            },
          })
    },
    getStoreInfo(){
        const { showList } = this.data
        request({
            url:  baseUrl + getDiyInfo,
            data: {
                venue_store_id:wx.getStorageSync('store_id')
            },
            isTologin:true,
            method:'POST',
            success:res=> {
                console.log('res',res)
              const { qr_data } = res
              let storeInfo =  qr_data.qr_name ? qr_data : {
                qr_name:'去约瑜伽场馆小助理',
                guide:'长按保存，打开微信扫一扫加好友',
                qr_img:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/8388be33f4efbe3f86392b2206c035e3.jpg',
                qr_type:1,
                qr_merge_img:''
              }
              //showList 数据
              showList.forEach((item)=>{
                  item.value = storeInfo[item.key]
              })
              this.setData({
                storeInfo:storeInfo,
                showList,
              })
            },
          })
    },
    getCover(obj){
        console.log('obj',obj)
        this.setData({
            posterInfo:obj.detail,
            'storeInfo.qr_merge_img':obj.detail.cover
        })
    },
    // 上传海报图
    uploadPosterPicture(url){
        return new Promise((resolve,reject)=>{
            wx.uploadFile({
                url: baseUrl + uploadImg,
                filePath:url,
                name:'image',
                formData:{
                    image:url
                },
                success:(result)=>{
                    let imgInfo = JSON.parse(result.data)
                    if(result.statusCode == 200) {
                        resolve(imgInfo.content.url)
                    }
                },
                fail:err=>{
                    reject('上传失败')
                }
            })
        })
    }
})