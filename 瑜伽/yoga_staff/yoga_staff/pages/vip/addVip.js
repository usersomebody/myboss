import { request } from '../../utils/util.js'
import { telReg } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import moment from '../../utils/moment.js'

const app = getApp()
const { canUseCardList, addCard, uploadImg, addUserConfig, addUser } = api
Page({
    data:{
        upyunFilePath:[],
        avatarSrc:'',
        imgSrc:'',
        showList:[{
            name:'头像',
            key:'head_img',
            placeholder:'',
            value:'',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:true
        },{
            name:'会员姓名',
            key:'name',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'手机号',
            key:'phone',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'性别',
            key:'sex',
            placeholder:'必填',
            value:'女',
            list:[{
                id:0,
                name:'未知'
            },{
                id:1,
                name:'男'
            },{
                id:2,
                name:'女'
            }],
            index:2,
            selectId:2,
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'出生年月',
            key:'birthday',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'会员来源',
            key:'channel_id',
            dataKey:'channel',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'活动'
            },{
                id:2,
                name:'后台添加'
            },{
                id:3,
                name:'主动申请'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'会员标签',
            key:'label_id',
            dataKey:'label',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'标签1'
            },{
                id:2,
                name:'标签2'
            },{
                id:3,
                name:'标签3'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true,
        },{
            name:'所在单位',
            key:'company_name',
            placeholder:'选填',
            value:'',
            isInput:true,
            require:false,
            isShowIcon:true
        },{
            name:'私教教练',
            key:'coach_staff_id',
            dataKey:'coach',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'教练1'
            },{
                id:2,
                name:'教练2'
            },{
                id:3,
                name:'教练3'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'销售',
            key:'sale_staff_id',
            dataKey:'sale',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'销售1'
            },{
                id:2,
                name:'销售2'
            },{
                id:3,
                name:'销售3'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'微信号',
            key:'wechat',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'会员卡',
            key:'card_arr',
            value:'',
            placeholder:'发卡',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:true
        }],
        date:'',
        width:200,//宽度
        height: 200,//高度
        currentDate:'',
        sendCard:[]
    },
    onUnload(){
        wx.removeStorageSync('sendCardList')
    },
    onLoad(options){
        this.setData({
            currentDate:moment().format('YYYY-MM-DD')
        })
        this.getPickerBaseData()
    },
    onShow(){
        let sendCard = wx.getStorageSync('sendCardList') || []
        let showList = this.updateAssignment('card_arr',sendCard, 1)
        this.setData({
            sendCard,
            showList
        })
    },
    // 获取picker基本数据
    getPickerBaseData(){
        const { showList } = this.data
        request({
            url:baseUrl + addUserConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                showList.forEach((item)=>{
                    if(res[item.dataKey]){
                        item.list = res[item.dataKey]
                    }
                })
                this.setData({
                    showList,
                })
            }
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1
        })
    },
    sure(){
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        // let cardValid = isPass.card_arr.filter((item)=>{
        //     return item.id
        // })
        // isPass.card_arr = cardValid
        request({
            url:baseUrl + addUser,
            data:isPass,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'添加成功',
                    showCancel:false,
                    success:()=>{
                        wx.navigateBack({
                            delta: 1, 
                        })
                    }
                })
            }
        })
    },
    verifyData(){
        const { showList } = this.data
        let submitDataList = this.toObj(showList)
        for(let key in submitDataList){
            let checkData = showList.filter((item)=>{
                if(item.key == key){
                    return {require:item.require}
                }
            })
            if(!submitDataList[key] && checkData[0].require){
                console.log({key,submitDataList,checkData})
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        return submitDataList
        
    },
    toObj(list){
        let info = {}
        let idArr = ['sex','channel_id','label_id', 'coach_staff_id', 'sale_staff_id']
        list.forEach((item)=>{
            if(idArr.indexOf(item.key) > -1){
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
                        let showList = that.updateAssignment('head_img',imgInfo.content.url,1)
                        that.setData({
                            avatarSrc:that.data.upyunFilePath,
                            imgSrc:'',
                            showList
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
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        if(key == 'phone' && !telReg(value)){
            wx.showModal({
                title:'手机号格式不正确',
                showCancel:false
            })
            return
        }
        let showList = this.updateAssignment(key,value,1)
        this.setData({
            showList, 
        })
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,1)
        this.setData({
          date: value,
          showList
        })
    },
    bindPickerChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,2)
        this.setData({
            showList
        })
    },
    updateAssignment(key,value,type){
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
                    console.log({key,value})
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    console.log('selectData',selectData)
                    item.selectId = selectData[0].id ? selectData[0].id :''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }

        return showList
    },
    goSendCard(){
        wx.navigateTo({
            url: '/pages/vip/giveVipCard?addvip=1'
        })
    }
})