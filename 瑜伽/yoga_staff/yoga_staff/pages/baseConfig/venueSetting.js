import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
// import { posterData } from './posterData.js'
const app = getApp()
const { uploadImg, editStore, getProvinces, getCity, getStoreInfo, getLat } = api
let allProvinces = []
Page({
    data:{
        showList:[{
                id:1,
                name:'场馆名称',
                placeholder:'必填',
                key:'name',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },{
                id:2,
                name:'手机号',
                placeholder:'必填',
                key:'phone',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:3,
                name:'固定电话',
                placeholder:'选填',
                key:'mobile',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:4,
                name:'省市区',
                placeholder:'请选择省市区',
                key:'provinces',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false
            },
            {
                id:5,
                name:'详细地址',
                placeholder:'请输入详细地址',
                key:'address',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:6,
                name:'经度',
                placeholder:'选填',
                key:'longitude',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:7,
                name:'纬度',
                placeholder:'选填',
                key:'latitude',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:true
            },
            {
                id:8,
                name:'店铺logo',
                placeholder:'上传logo',
                key:'brand_logo',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false
            },
            {
                id:9,
                name:'店铺介绍',
                placeholder:'选填',
                key:'synopsis',
                selectId:'',
                value:'',
                isHandle:false,
                inputBox:false,
            }
        ],
        width:128,//宽度
        height: 128,//高度
        upyunFilePath:'',
        imgSrc:'',
        region:['请选择省市区'],
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
        if(key == 'address' && value && showList[3].value){
            // 获取经纬度
            let adrress = showList[3].value + value 
            this.getLat(adrress)
        }
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showList } = this.data
        showList.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showList, 
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
            url:  baseUrl + getStoreInfo,
            data: {
                venue_store_id:wx.getStorageSync('store_id')
            },
            isTologin:true,
            method:'POST',
            success:res=> {
              let storeInfo = res
              storeInfo.provinces = `${res.province_name}${res.city_name}${res.area_name}`
              storeInfo.brand_logo = res.brand_logo || 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211208/8df6efd87fbb544fa545013b5337460f.png'
              //showList 数据
              showList.forEach((item)=>{
                  item.value = res[item.key]
              })
              let region = [res.province_name,res.city_name,res.area_name]
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
                        that.data.showList[7].value = that.data.upyunFilePath
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

    bindRegionChange(e) {
        const { storeInfo, showList } = this.data
        console.log('picker发送选择改变，携带值为', e.detail.value)
        storeInfo['provinces'] = e.detail.value.toString().replace(new RegExp(',','g'),'')
        showList[4].value = ''
        this.setData({
          region: e.detail.value,
          storeInfo,
          provinceId:this.formatFilterData(allProvinces,'',e.detail.value[0]),
          showList
        })
        if(showList[4].value){
            // 获取经纬度
            let adrress = e.detail.value.join('') + showList[4].value
            this.getLat(adrress)
        }
    },
    sure(e){
        console.log('e',e)
        const { storeInfo  } = this.data
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
                this.save()
            })
        })
    },
    save(){
        const { storeInfo, region, cityId, areaId, provinceId, showList } = this.data

        let submit = {...storeInfo, ...{city:cityId},...{area:areaId},...{province:provinceId,synopsis:showList[showList.length - 1].value}}
        request({
            url:  baseUrl + editStore,
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
        const { storeInfo,showList } = this.data
        let data = this.toObj(showList)
        for(let key in data){
            if(!data[key] && key != 'mobile' && key != 'synopsis'){
                wx.showModal({
                    title:'请完善信息'
                })
                return true
            }
        }
        console.log('完善数据')
        return false
    },
    toObj(list){
        let info = {}
        list.forEach((item)=>{
            info[item.key] = item.value
        })
        return info
    },
    //获取经纬度
    getLat(address){
        const { showList } = this.data
        let that = this
        request({
            url:  baseUrl + getLat,
            data: {
                address,
            },
            isTologin:true,
            method:'POST',
            success(res) {
                showList.forEach((item)=>{
                    if(res[item.key]){
                        item.value = res[item.key]
                    }
                })
                that.setData({
                    showList
                })
            },
          })
    }
})