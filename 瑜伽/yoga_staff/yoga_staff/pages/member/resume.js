import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';

const app = getApp()
const { uploadImg, getAllRoleForStoreIds, addSkilled, delSkilled } = api

Page({
    data:{
        showList:[{
            id:1,
            name:'从业年数',
            placeholder:'选填',
            key:'work_years',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:2,
            name:'擅长方向',
            placeholder:'选填',
            key:'skilled_id',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false
        },{
            id:3,
            name:'个人风采',
            placeholder:'（建议尺寸296x194px）',
            key:'rule_imgs',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false,
        },{
            id:4,
            name:'封面图片',
            placeholder:'（建议尺寸750x500px）',
            key:'cover_img',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false
        },{
            id:5,
            name:'个人简介',
            placeholder:'选填',
            key:'resume',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false,
        }],

        //图片上传
        upyunFilePath: '',
        uploadFileIdx: 0,

        imgFileList:[],
        alyunFilePath: [],
        alloadFileIdx: 0,
        width:375,//宽度
        height: 250,//高度
        imgSrc:'',
        skillList:[],
        popupShow:false,
        overlayer:false,
        skillIds:[],
        showKey:''
    },
    onLoad(options){
        this.getALLRole()
    },
    dataInit(){
        let defaultValue = app.globalData.personal_style
        const { showList, skillList } = this.data
        let skilledList = []
        skillList.forEach((item)=>{
            if(defaultValue['skilled_id'].indexOf(item.id) > -1){
                item.checked = true
                skilledList = [...skilledList,item.name]
            }
        })
        showList.forEach(item => {
            if(item.key == 'skilled_id'){
                item.selectId = defaultValue[item.key] || []
                item.value = skilledList.join(',')
            }else{
                item.value = defaultValue[item.key] || ''
            }
        });
        this.setData({
            showList,
            alyunFilePath:defaultValue['rule_imgs'] || [],
            skillList
        })
    },
    getALLRole(){
        request({
            url:baseUrl + getAllRoleForStoreIds,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    skillList:res.skilled
                })
                if(app.globalData.personal_style){
                    this.dataInit()
                }
            }
        })
    },
    
    getNumberValue(e){
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

    
    cancle(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    sure(){
        const { showList } = this.data
        let submitData = {}
        let objData = this.verifyData()
        if(!objData){
            return
        }

        submitData = {...objData}
        submitData.personal_style = submitData.rule_imgs.map((item)=>{
            let obj = {
                type:1,
                url:item,
                cover_url:''
            }
            return obj
        })
        app.globalData.personal_style = submitData
        wx.navigateBack({
            delta: 1
        })
        console.log('submitData',submitData)

    },
    verifyData(){
        const { showList } = this.data
        let submitDataList = this.toObj(showList)
        // for(let key in submitDataList){
        //     if(!submitDataList[key] && key != 'rule_imgs' && key != 'resume'){
        //         wx.showModal({
        //             title:'请完善信息',
        //             showCancel: false,
        //         })
        //         return false
        //     }
        // }
        return submitDataList
        
    },
    toObj(list){
        let info = {}
        let idArr = [2]
        list.forEach((item)=>{
            if(idArr.indexOf(item.id) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
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
                            that.data.showList[2].value = that.data.alyunFilePath
                            that.setData({
                                showList:that.data.showList,
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
    effectiveImg(){
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
                        that.data.showList[3].value = that.data.upyunFilePath
                        that.setData({
                            showList:that.data.showList,
                            imgSrc:''
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
    toggelePopup(e){
        console.log('e',e)
        const { key } = e.currentTarget.dataset
        const { popupShow, overlayer} = this.data
        this.setData({
            showKey:key,
            popupShow:!popupShow,
            overlayer:!overlayer
        })
    },
    saveData(){
        const { skillList, showKey, popupShow, overlayer } = this.data
        let skillIds = skillList.filter((item)=>{
            return item.checked
        })
        let ids = skillIds.map((item)=>{
            return item.id
        })
        let name = skillIds.map((item)=>{
            return item.name
        })
        this.setData({
            skillIds,
            showList:this.updateAssignment(showKey,name,3,ids),
            popupShow:!popupShow,
            overlayer:!overlayer
        })
    },
    //多选
    multipleChoose(e){
        const { id, name, item } = e.currentTarget.dataset
        const { skillList } = this.data
        skillList.forEach((item)=>{
            item.checked = item.id == id ? !item.checked : item.checked
        })
        this.setData({
            skillList
        })
    },
    updateAssignment(key,value,type,selectId){
        const { showList } = this.data
        if(type == 1){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                }
            })
        }else if(type == 2){
            showList.forEach((item)=>{
                if(item.key == key){
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    item.selectId = selectData[0].id ? selectData[0].id :''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }else if(type == 3){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                    item.selectId = selectId
                }
            })
        }

        return showList
    },
    addSkill(){
        wx.showModal({
            title:"添加擅长方向标签",
            confirmText:'添加',
            editable:true,
            placeholderText:'请输入',
            success:(res)=>{
                if(res.confirm){
                    request({
                        url:baseUrl + addSkilled,
                        data:{
                            name:res.content
                        },
                        method:'POST',
                        isTologin:true,
                        success:(res)=>{
                            this.getALLRole()
                        }
                    })
                }
            }
        })
    },
    deleteSkill(e){
        const { id}  = e.currentTarget.dataset
        request({
            url:baseUrl + delSkilled,
            data:{
                id
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.getALLRole()
            }
        })
    }
})