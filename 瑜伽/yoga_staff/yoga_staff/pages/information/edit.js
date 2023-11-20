import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
// import { posterData } from './posterData.js'
const app = getApp()
const { uploadImg, setCardInfo, getProvinces, getCity, getDiyInfo } = api
let allProvinces = []
Page({
    data:{
        showList:[{
                id:1,
                name:'场馆名称',
                placeholder:'请输入场馆名称',
                key:'name',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },{
                id:2,
                name:'手机号',
                placeholder:'请输入手机号',
                key:'phone',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:3,
                name:'省市区',
                placeholder:'请选择省市区',
                key:'provinces',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false
            },
            {
                id:4,
                name:'详细地址',
                placeholder:'请输入详细地址',
                key:'address',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:5,
                name:'店铺logo',
                placeholder:'上传logo',
                key:'brand_logo',
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
        region:['请选择省市区'],
        businessList:[
            {
                id:1,
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/6acbfa60188d166d393d04e8cc8ef1be.png'
            },
            {
                id:2,
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/57d244fbf63071a6182fa06bd816f6f3.png'
            },
            {
                id:3,
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/165a07514db5ea37d0f9efddc924d9c5.png'
            },
            {
                id:4,
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/7db9b9eda91841da2a9d5b8b1cba5c99.jpg'
            }
        ],
        posterBg:'',
        posterInfo:{},
        storeInfo:{
            name:'',
            phone:'',
            provinces:'',
            address:'',
            brand_logo:''
        },
        cityId:'',
        areaId:'',
        provinceId:''
    },
    onLoad(){
        this.getProvice()
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
              const { card_data } = res
              let storeInfo = card_data
              storeInfo.provinces = `${card_data.province_name}${card_data.city_name}${card_data.area_name}`
              storeInfo.brand_logo = card_data.brand_logo || 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211208/8df6efd87fbb544fa545013b5337460f.png'
              //showList 数据
              showList.forEach((item)=>{
                  item.value = storeInfo[item.key]
              })
              let region = [storeInfo.province_name,storeInfo.city_name,storeInfo.area_name]
              this.setData({
                storeInfo:storeInfo,
                showList,
                region,
                cityId:storeInfo.city,
                areaId:storeInfo.area,
                provinceId:storeInfo.province
              })
              
            },
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
                        that.data.showList[4].value = that.data.upyunFilePath
                        storeInfo.brand_logo = imgInfo.content.url
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
    getCover(obj){
        console.log('obj',obj)
        this.setData({
            posterInfo:obj.detail
        })
    },
    bindRegionChange(e) {
        const { storeInfo } = this.data
        console.log('picker发送选择改变，携带值为', e.detail.value)
        storeInfo['provinces'] = e.detail.value.toString().replace(new RegExp(',','g'),'')
        this.setData({
          region: e.detail.value,
          storeInfo,
          provinceId:this.formatFilterData(allProvinces,'',e.detail.value[0])
        })
    },
    sure(e){
        console.log('e',e)
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

        //获取提交数据的省市区代码串
        this.getCity(this.data.provinceId,1).then((cityId)=>{
            this.getCity(cityId,2).then((areaId)=>{
                this.setData({
                    cityId,
                    areaId
                })
                this.uploadPosterPicture(posterInfo.cover).then((url)=>{
                    this.save(url)
                })
            })
        })
        // this.save()
    },
    save(url){
        const { storeInfo, region, cityId, areaId, provinceId, posterInfo } = this.data
        let cardInfo = {
            card_style:posterInfo.idx,
            card_merge_img:posterInfo.cover
        }
        let submit = {...storeInfo, ...{city:cityId},...{area:areaId},...{province:provinceId},...cardInfo}
        submit.card_merge_img = url
        request({
            url:  baseUrl + setCardInfo,
            data: submit,
            isTologin:true,
            method:'POST',
            success(res) {
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
    //获取所有省份数据
    getProvice(){
        request({
            url:  baseUrl + getProvinces,
            data: {
              
            },
            method:'POST',
            success(res) {
                allProvinces = res
            },
        })
    },
    getCity(id,type){
        console.log('id',id)
        const { region } = this.data
        return new Promise((resolve,reject)=>{
            request({
                url:  baseUrl + getCity,
                data: {
                  id:id || '',
                },
                method:'POST',
                success:(res)=> {
                    let name = type == 1 ? region[1] : region[2]
                    let cityId = this.formatFilterData(res,'',name)
                    resolve(cityId)
                },
                fail(err){
                    reject('处理失败...')
                }
            })
        })
    },
    //过滤获取id
    formatFilterData(list,id,name){
        let checkName = name.slice(0,2)
        let filterData = list.filter((item)=>{
            return checkName == item.name.slice(0,2) || id == item.id
        })
        console.log('filterData',filterData)
        return filterData[0].id
    },
    checkDataValid(){
        const { storeInfo } = this.data
        for(let key in storeInfo){
            if(!storeInfo[key] && key != 'card_merge_img' && key != 'card_style'){
                wx.showModal({
                    title:'请完善信息'
                })
                return true
            }
        }
        console.log('完善数据')
        return false
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